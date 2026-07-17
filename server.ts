import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { runScraper, getCachedProducts, ScrapeStatus } from './src/utils/scraper';
import { PRODUCTS } from './src/data';
import { db } from './src/firebase';
import { collection, getDocs, setDoc, doc } from 'firebase/firestore';

// Global variables to hold scraping state in memory
let scrapeStatus: ScrapeStatus = {
  lastScrapeTime: null,
  status: 'idle',
  error: null,
  count: 0
};

// Guardar productos en Firestore usando nombres de columnas siempre en español
async function guardarProductosEnFirestore(productos: any[]) {
  console.log(`Guardando ${productos.length} productos en Firestore (colección 'productos')...`);
  for (const producto of productos) {
    const productoEsp = {
      id: producto.id || '',
      nombre: producto.name || producto.nombre || '',
      categoria: producto.category || producto.categoria || '',
      precio: Number(producto.price || producto.precio || 0),
      precioOriginal: Number(producto.originalPrice || producto.precioOriginal || 0),
      descripcion: producto.description || producto.descripcion || '',
      calificacion: Number(producto.rating || producto.calificacion || 0),
      imagen: producto.image || producto.imagen || '',
      etiquetas: producto.tags || producto.etiquetas || [],
      especificaciones: producto.specs || producto.especificaciones || [],
      caracteristicas: producto.features || producto.caracteristicas || [],
      enStock: producto.inStock !== undefined ? producto.inStock : true,
      esNuevo: producto.isNew !== undefined ? producto.isNew : false,
      enlaceMercadoLibre: producto.mlLink || producto.enlaceMercadoLibre || ''
    };
    
    try {
      await setDoc(doc(db, 'productos', productoEsp.id), productoEsp);
    } catch (e) {
      console.error(`Error al guardar producto ${productoEsp.id} en Firestore:`, e);
    }
  }
}

// Leer productos de Firestore (colección 'productos') con columnas en español y convertirlos a formato compatible con el front
async function obtenerProductosDeFirestore(): Promise<any[]> {
  try {
    const querySnapshot = await getDocs(collection(db, 'productos'));
    const productos: any[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      productos.push({
        id: data.id || docSnap.id,
        name: data.nombre || '',
        category: data.categoria || 'smartphones',
        price: data.precio || 0,
        originalPrice: data.precioOriginal || 0,
        description: data.descripcion || '',
        rating: data.calificacion || 0,
        image: data.imagen || '',
        tags: data.etiquetas || [],
        specs: data.especificaciones || [],
        features: data.caracteristicas || [],
        inStock: data.enStock !== undefined ? data.enStock : true,
        isNew: data.esNuevo !== undefined ? data.esNuevo : false,
        mlLink: data.enlaceMercadoLibre || ''
      });
    });
    return productos;
  } catch (error) {
    console.error('Error al leer de Firestore (colección "productos"):', error);
    return [];
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Use JSON middleware
  app.use(express.json());

  // Warm-up database on startup: if DB is empty, populate from cache + static products
  try {
    const fsProducts = await obtenerProductosDeFirestore();
    if (fsProducts.length === 0) {
      console.log('La colección "productos" en Firestore está vacía. Poblando con datos estáticos y caché inicial de MercadoLibre...');
      const scraped = getCachedProducts();
      const combined = [...PRODUCTS, ...scraped];
      const uniqueMap = new Map();
      combined.forEach(p => uniqueMap.set(p.id, p));
      await guardarProductosEnFirestore(Array.from(uniqueMap.values()));
      
      // Update scrapeStatus count
      scrapeStatus.count = uniqueMap.size;
      scrapeStatus.status = 'success';
      scrapeStatus.lastScrapeTime = new Date().toLocaleString('es-UY', { timeZone: 'America/Montevideo' });
    } else {
      console.log(`Firestore cargado: se leyeron ${fsProducts.length} productos de la colección "productos" en español.`);
      scrapeStatus.count = fsProducts.length;
      scrapeStatus.status = 'success';
      scrapeStatus.lastScrapeTime = new Date().toLocaleString('es-UY', { timeZone: 'America/Montevideo' });
    }
  } catch (error) {
    console.error('Error al inicializar productos en Firestore:', error);
  }

  // Set up daily scraping runner interval (24 hours = 86400000ms)
  const DAY_IN_MS = 24 * 60 * 60 * 1000;
  setInterval(async () => {
    console.log(`[DAILY SYNC] Ejecutando sincronización scraping diaria automática de MercadoLibre...`);
    scrapeStatus.status = 'scraping';
    try {
      const result = await runScraper();
      scrapeStatus = result.status;
      
      // Save newly sync'ed products directly to Firestore!
      await guardarProductosEnFirestore(result.products);
      
      console.log(`[DAILY SYNC] Completado correctamente a la fecha: ${scrapeStatus.lastScrapeTime}`);
    } catch (e: any) {
      scrapeStatus.status = 'error';
      scrapeStatus.error = e.message;
      console.error(`[DAILY SYNC] Fallo la sincronización:`, e);
    }
  }, DAY_IN_MS);

  // --- API ROUTES ---

  // 1. Unified products list loaded directly from Spanish Firestore collection
  app.get('/api/products', async (req, res) => {
    try {
      const fsProducts = await obtenerProductosDeFirestore();
      
      // Fallback only if Firestore is offline or fails
      if (fsProducts.length === 0) {
        const scraped = getCachedProducts();
        const combined = [...PRODUCTS, ...scraped];
        const uniqueMap = new Map();
        combined.forEach(p => uniqueMap.set(p.id, p));
        res.json(Array.from(uniqueMap.values()));
      } else {
        res.json(fsProducts);
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // 2. Scraping execution status info
  app.get('/api/scrape/status', (req, res) => {
    res.json({
      ...scrapeStatus,
      interval: 'Cada 24 horas (Automático Diario)',
      target: 'https://listado.mercadolibre.com.uy/_CustId_438656875'
    });
  });

  // 3. Manual scraping execution trigger: Scraping + Firestore Synchronization
  app.post('/api/scrape/trigger', async (req, res) => {
    scrapeStatus.status = 'scraping';
    console.log('[MANUAL TRIGGER] Iniciando scrape forzado a petición del administrador y guardando en Firestore...');
    try {
      const result = await runScraper();
      scrapeStatus = result.status;
      
      // Guardar productos en Firestore en español
      await guardarProductosEnFirestore(result.products);
      
      // Recargar todos los productos actualizados de Firestore
      const updatedProducts = await obtenerProductosDeFirestore();
      scrapeStatus.count = updatedProducts.length;
      
      res.json({
        success: true,
        status: scrapeStatus,
        products: updatedProducts
      });
    } catch (error: any) {
      scrapeStatus.status = 'error';
      scrapeStatus.error = error.message;
      res.status(500).json({
        success: false,
        status: scrapeStatus,
        error: error.message
      });
    }
  });

  // --- VITE MIDDLEWARE SETUP ---

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
