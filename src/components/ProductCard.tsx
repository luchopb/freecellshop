import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Plus, Check, ChevronDown, ChevronUp, Cpu, Truck, Package, Eye } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [isAdded, setIsAdded] = useState(false);
  const [showSpecs, setShowSpecs] = useState(false);

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 1800);
  };

  // Price formatting helper to display values in ARG format ($1.149,00 USD)
  const formatValue = (num: number) => {
    return num.toLocaleString('es-AR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Calculate dynamic discount percentage if original price is declared
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  // Monthly installments computed to 12 cuotas sin interés
  const monthlyInstallment = product.price / 12;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -6 }}
      className="relative flex flex-col h-full rounded-[24px] bg-white dark:bg-zinc-950 border border-slate-100 dark:border-zinc-900 overflow-hidden hover:border-slate-300 dark:hover:border-zinc-800 hover:shadow-[0_12px_28px_rgba(0,0,0,0.05)] dark:hover:shadow-[0_12px_28px_rgba(132,204,22,0.05)] transition-all duration-300 group"
    >
      {/* Badges Container - Pill Shaped like the screenshot */}
      <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-1.5">
        {discountPercent ? (
          <span className="px-2.5 py-0.5 rounded-full font-sans text-[10px] font-bold bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-zinc-200 shadow-sm">
            {discountPercent}% OFF
          </span>
        ) : product.isNew ? (
          <span className="px-2.5 py-0.5 rounded-full font-sans text-[10px] font-bold bg-slate-900 dark:bg-lime-500 text-white dark:text-black shadow-sm">
            NUEVO
          </span>
        ) : null}
      </div>

      {/* Image Gallery Stage with clean white/light grey background to focus on product item */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#fafafc] dark:bg-zinc-900/40 p-6 flex items-center justify-center border-b border-slate-50 dark:border-zinc-900">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain select-none group-hover:scale-105 transition-transform duration-700 ease-out"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Content Space */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        
        {/* Header (Rating & Category) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-zinc-550">
            <span className="font-sans font-medium tracking-wide uppercase">
              {product.category === 'smartphones' ? 'Celulares' : product.category === 'accessories' ? 'Accesorios' : 'Gadgets'}
            </span>
            <div className="flex items-center gap-1 text-amber-500 font-sans font-medium">
              <Star className="w-3 h-3 fill-current" />
              <span>{product.rating}</span>
            </div>
          </div>

          <h3 className="font-display font-normal text-base text-slate-800 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-lime-500 transition-colors duration-200 leading-tight">
            {product.name}
          </h3>
        </div>

        {/* Specs Toggle Bar */}
        <div className="border-t border-b border-slate-100 dark:border-zinc-900 py-2">
          <button
            onClick={() => setShowSpecs(!showSpecs)}
            className="flex items-center justify-between w-full font-sans text-[10px] text-slate-400 dark:text-zinc-550 hover:text-slate-800 dark:hover:text-zinc-300 transition-colors uppercase tracking-wider cursor-pointer"
          >
            <span className="flex items-center gap-1 font-semibold">
              <Cpu className="w-3 h-3 text-blue-500 dark:text-lime-500" />
              Especificaciones Técnicas
            </span>
            {showSpecs ? <ChevronUp className="w-3.2 h-3.2" /> : <ChevronDown className="w-3.2 h-3.2" />}
          </button>

          <AnimatePresence>
            {showSpecs && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 gap-1 pt-2">
                  {product.specs.map((spec, index) => (
                    <div key={index} className="flex items-center gap-1.5 text-slate-500 dark:text-zinc-400 font-sans text-[10px]">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-lime-500" />
                      <span>{spec}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Pricing Layout - Directly replicating currency format and 12-cuotas structure */}
        <div className="space-y-1">
          {product.originalPrice && (
            <span className="font-sans text-[11px] text-slate-400 dark:text-zinc-550 line-through block">
              ${formatValue(product.originalPrice)} USD
            </span>
          )}
          <div className="flex items-baseline gap-1">
            <span className="font-display font-normal text-slate-900 dark:text-white text-2xl tracking-tighter">
              ${formatValue(product.price)}
            </span>
            <span className="font-sans text-xs font-bold text-slate-700 dark:text-zinc-300">USD</span>
          </div>
          
          <div className="text-xs text-slate-800 dark:text-zinc-305 font-medium">
            <span className="font-bold text-slate-900 dark:text-white">12 cuotas de ${formatValue(monthlyInstallment)} USD</span> sin recargo
          </div>
        </div>

        {/* Real-world stock and dispatch indicator row */}
        <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-zinc-900">
          <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-zinc-300">
            <Truck className="w-3.5 h-3.5 text-emerald-500 dark:text-lime-500" />
            <span>
              {product.price > 500 ? (
                <span>Envíos en <span className="text-emerald-600 dark:text-lime-500 font-bold">2 horas</span></span>
              ) : (
                <span>Envío en el <span className="text-emerald-600 dark:text-lime-500 font-bold">día</span></span>
              )}
            </span>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-zinc-500">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-lime-500" />
              Con garantía oficial
            </span>
            <span className="underline hover:text-blue-600 dark:hover:text-lime-500 transition-colors cursor-pointer text-[10px] font-semibold">
              Ver stock
            </span>
          </div>
        </div>

        {/* Thumbnail representation and Add Cart Action button */}
        <div className="flex items-center justify-between pt-1 gap-2">
          {/* Thumbnails of product colors/options inside custom outline box */}
          <div className="flex gap-1">
            <div className="w-9 h-9 rounded-lg border-2 border-slate-900 dark:border-lime-500 overflow-hidden p-0.5 bg-white dark:bg-zinc-900 shadow-sm flex items-center justify-center shrink-0">
              <img src={product.image} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
            </div>
            <div className="w-9 h-9 rounded-lg border border-slate-100 dark:border-zinc-850 overflow-hidden p-0.5 bg-white dark:bg-zinc-900 opacity-40 hover:opacity-100 transition-opacity flex items-center justify-center shrink-0 cursor-pointer">
              <img src={product.image} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
            </div>
          </div>

          {/* Fully rounded Add Cart action pill */}
          <button
            id={`add-to-cart-${product.id}`}
            onClick={handleAddToCartClick}
            disabled={isAdded || !product.inStock}
            className={`px-4 py-2.5 rounded-full font-sans text-[11px] font-extrabold tracking-tight uppercase transition-all duration-300 flex items-center gap-1.5 cursor-pointer border ${
              !product.inStock
                ? 'bg-slate-100 dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-slate-400 dark:text-zinc-650 cursor-not-allowed'
                : isAdded
                ? 'bg-emerald-500 dark:bg-lime-500 border-emerald-500 dark:border-lime-500 text-white dark:text-black shadow-md shadow-emerald-100 dark:shadow-lime-500/10'
                : 'bg-black dark:bg-lime-500 text-white dark:text-black border-black dark:border-lime-500 hover:bg-slate-800 dark:hover:bg-lime-600 hover:border-slate-800 dark:hover:border-lime-600 shadow-md shadow-slate-100 dark:shadow-lime-500/10'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Añadido</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Añadir</span>
              </>
            )}
          </button>
        </div>

      </div>
    </motion.div>
  );
}
