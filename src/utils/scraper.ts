import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';
import { Product } from '../types';

const SCRAPE_URL = 'https://listado.mercadolibre.com.uy/_CustId_438656875';
const CACHE_PATH = path.join(process.cwd(), 'scraped-products.json');

// Mock fallback products in case scrap fails or is blocked on cold start
const DEFAULT_SCRAPED_PRODUCTS: Product[] = [
  {
    id: 'ml-01',
    name: 'Samsung Galaxy S24 Ultra 5G',
    category: 'smartphones',
    price: 1149,
    originalPrice: 1299,
    description: 'Impresionante Galaxy S24 Ultra importado de MercadoLibre. Pantalla Dynamic AMOLED 2X, cámara con zoom óptico 5x e inteligencia artificial integrada.',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=600&q=80',
    tags: ['MercadoLibre', 'Súper Venta'],
    specs: ['Snapdragon 8 Gen 3', '12GB RAM', '256GB Almacenamiento', 'Garantía 1 Año'],
    features: ['Envío Express Gratis', 'Apto Antel/Claro/Movistar', 'IA Integrada de fábrica'],
    inStock: true
  },
  {
    id: 'ml-02',
    name: 'iPhone 15 Pro Max 256GB',
    category: 'smartphones',
    price: 1250,
    originalPrice: 1399,
    description: 'iPhone 15 Pro Max de titanio natural en estado impecable. Desbloqueado para todas las compañías, con batería al 100% y accesorios originales.',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=600&q=80',
    tags: ['Recomendado', 'Titanio'],
    specs: ['Chip A17 Pro', 'Chasis de Titanio', 'Cámara Teleobjetivo 5x', 'Pantalla Super Retina XDR'],
    features: ['Face ID impecable', 'Garantía de originalidad', 'Envío prioritario'],
    inStock: true
  }
];

export interface ScrapeStatus {
  lastScrapeTime: string | null;
  status: 'idle' | 'success' | 'error' | 'scraping';
  error: string | null;
  count: number;
}

export async function runScraper(): Promise<{ products: Product[]; status: ScrapeStatus }> {
  const currentTimestamp = new Date().toLocaleString('es-UY', { timeZone: 'America/Montevideo' });
  const statusInfo: ScrapeStatus = {
    lastScrapeTime: currentTimestamp,
    status: 'success',
    error: null,
    count: 0
  };

  try {
    console.log(`Iniciando scraping de: ${SCRAPE_URL}...`);
    
    const response = await fetch(SCRAPE_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
        'Cache-Control': 'no-cache'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    const parsedProducts: Product[] = [];

    // MercadoLibre selectors can be flexible. Let's target layout search items
    // Typical containers:
    // .ui-search-layout__item, .poly-card, ui-search-result
    const containers = $('.ui-search-layout__item, .ui-search-result, .poly-card');
    
    console.log(`Encontrados ${containers.length} contenedores de productos potenciales.`);

    containers.each((index, element) => {
      try {
        const item = $(element);

        // Extract Title
        let title = item.find('.ui-search-item__title, .poly-component__title, h2, h3').first().text().trim();
        if (!title) return; // Skip if no title found

        // Extract Link
        let link = item.find('a').first().attr('href') || '#';

        // Extract Image
        const imgElement = item.find('img').first();
        let image = imgElement.attr('data-src') || imgElement.attr('src') || '';
        
        // Handle low-quality thumbnail upgrade if available or placeholder
        if (image && image.includes('D_NQ_NP_')) {
          // MercadoLibre thumbnails are usually 2x, replace with higher resolution if helpful
          image = image.replace(/-I\.(jpg|webp)/g, '-O.$1');
        } else if (!image) {
          image = 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80';
        }

        // Extract Price and Currency
        // Example: $ 39.500 or U$S 1.200
        const symbolText = item.find('.andes-money-amount__symbol, .ui-search-price__second-line .andes-money-amount__symbol').first().text().trim();
        const fractionText = item.find('.andes-money-amount__fraction, .ui-search-price__second-line .andes-money-amount__fraction').first().text().trim();
        
        let currency = 'USD';
        if (symbolText.includes('$') && !symbolText.includes('U$S')) {
          currency = 'UYU'; // Uruguayan Pesos
        } else if (symbolText.includes('U$S') || symbolText.toLowerCase().includes('usd')) {
          currency = 'USD'; // Dollars
        }

        let rawPriceVal = parseInt(fractionText.replace(/\./g, '').replace(/,/g, ''), 10);
        if (isNaN(rawPriceVal)) {
          // Try to fallback parser
          const priceLine = item.find('.ui-search-price__second-line, .poly-price__current').text().trim();
          const match = priceLine.match(/(U\$S|\$)\s*([\d\.,]+)/);
          if (match) {
            if (match[1] === '$') currency = 'UYU';
            rawPriceVal = parseInt(match[2].replace(/\./g, '').replace(/,/g, ''), 10);
          } else {
            rawPriceVal = 500; // Solid fallback
          }
        }

        // Convert UYU to USD automatically if list is in Uruguayan Pesos (assuming rate 1 USD = 39.5 Pesos)
        let finalPriceUSD = rawPriceVal;
        if (currency === 'UYU') {
          finalPriceUSD = Math.round(rawPriceVal / 39.5);
        }

        // Generate a clean description based on product parameters
        const isApple = title.toLowerCase().includes('iphone') || title.toLowerCase().includes('apple') || title.toLowerCase().includes('ipad');
        const isSamsung = title.toLowerCase().includes('galaxy') || title.toLowerCase().includes('samsung');
        
        let desc = `Prestigioso dispositivo importado directamente. ${title}, con total calidad de fabricación y la confianza oficial de nuestra tienda.`;
        if (isApple) {
          desc = `Experimentá la excelencia del ecosistema de Apple de forma premium. ${title} importado de alta gama con garantía de compatibilidad internacional.`;
        } else if (isSamsung) {
          desc = `Disfrutá de la vanguardia móvil de Samsung con pantalla líder en el mercado. ${title} con gran almacenamiento y procesador ultra potente.`;
        }

        // Generate unique local ID derived from title hash or ML product code
        const mlIdMatch = link.match(/MLU-\d+|MLU\d+/);
        const uniqueId = mlIdMatch ? `ml-${mlIdMatch[0].toLowerCase()}` : `ml-scraped-${index}`;

        const category = title.toLowerCase().includes('funda') || title.toLowerCase().includes('cargador') || title.toLowerCase().includes('protector') || title.toLowerCase().includes('auricular')
          ? 'accessories'
          : (title.toLowerCase().includes('reloj') || title.toLowerCase().includes('watch') || title.toLowerCase().includes('tv') || title.toLowerCase().includes('tablet') ? 'gadgets' : 'smartphones');

        // Create fully compliant Product object
        const product: Product = {
          id: uniqueId,
          name: title,
          category: category,
          price: finalPriceUSD,
          originalPrice: Math.round(finalPriceUSD * 1.15), // Mock a original price for beautiful discounts
          description: desc,
          rating: Number((4.5 + Math.random() * 0.5).toFixed(1)),
          image: image,
          tags: ['MercadoLibre', 'Precio Actualizado'],
          specs: [
            category === 'smartphones' ? 'Conectividad 5G Global' : 'Compatibilidad Universal',
            'Liberado Factory de fábrica',
            'Estado Técnico Certificado 10/10'
          ],
          features: [
            'Sincronizado de MercadoLibre Uruguay',
            'Soporte post-venta incluido',
            'Disponible para envío Priority gratis',
            'Pago Contra Entrega elegible'
          ],
          inStock: true,
          mlLink: link // link helper
        };

        parsedProducts.push(product);
      } catch (err) {
        console.error('Error al procesar contenedor individual de MercadoLibre:', err);
      }
    });

    if (parsedProducts.length === 0) {
      throw new Error('No se pudo encontrar ningún producto en la página web con los selectores actuales.');
    }

    console.log(`Scraping completado con éxito! Encontrados y validados ${parsedProducts.length} productos.`);

    // Persist cache locally as requests do not get lost
    fs.writeFileSync(CACHE_PATH, JSON.stringify(parsedProducts, null, 2), 'utf-8');

    statusInfo.count = parsedProducts.length;
    return {
      products: parsedProducts,
      status: statusInfo
    };
  } catch (error: any) {
    console.error('Fallo el scraper de MercadoLibre. Usando caché de resguardo:', error.message);
    
    // Check if we have standard cache file
    let cached: Product[] = [];
    if (fs.existsSync(CACHE_PATH)) {
      try {
        cached = JSON.parse(fs.readFileSync(CACHE_PATH, 'utf-8'));
      } catch (e) {
        cached = DEFAULT_SCRAPED_PRODUCTS;
      }
    } else {
      cached = DEFAULT_SCRAPED_PRODUCTS;
      fs.writeFileSync(CACHE_PATH, JSON.stringify(cached, null, 2), 'utf-8');
    }

    statusInfo.status = 'error';
    statusInfo.error = error.message;
    statusInfo.count = cached.length;

    return {
      products: cached,
      status: statusInfo
    };
  }
}

// Function to read currently cached products safely
export function getCachedProducts(): Product[] {
  if (fs.existsSync(CACHE_PATH)) {
    try {
      return JSON.parse(fs.readFileSync(CACHE_PATH, 'utf-8'));
    } catch (e) {
      return DEFAULT_SCRAPED_PRODUCTS;
    }
  }
  
  // Write default on first run
  fs.writeFileSync(CACHE_PATH, JSON.stringify(DEFAULT_SCRAPED_PRODUCTS, null, 2), 'utf-8');
  return DEFAULT_SCRAPED_PRODUCTS;
}
