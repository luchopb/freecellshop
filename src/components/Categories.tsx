import React from 'react';
import { motion } from 'motion/react';
import * as Icons from 'lucide-react';
import { Category } from '../types';
import { CATEGORIES } from '../data';

interface CategoriesProps {
  selectedCategory: string;
  onSelectCategory: (categoryId: 'all' | 'smartphones' | 'accessories' | 'gadgets') => void;
}

export default function Categories({ selectedCategory, onSelectCategory }: CategoriesProps) {
  
  // Dynamic Icon Renderer
  const renderIcon = (iconName: string, active: boolean) => {
    // @ts-ignore
    const IconComponent = Icons[iconName];
    if (!IconComponent) return null;
    return (
      <IconComponent 
        className={`w-6 h-6 transition-all duration-300 ${
          active ? 'text-white dark:text-black' : 'text-slate-400 group-hover:text-white dark:group-hover:text-black group-hover:scale-110'
        }`} 
      />
    );
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-3">
        <h3 className="font-display font-normal text-xs tracking-widest text-blue-600 dark:text-lime-500 uppercase">
          Categorías Oficiales
        </h3>
        <h2 className="font-display font-normal text-4xl sm:text-5xl text-slate-900 dark:text-white tracking-tighter leading-none">
          FREE CELL | SHOP
        </h2>
        <p className="font-sans text-slate-500 dark:text-zinc-400 max-w-xl mx-auto text-base font-light leading-relaxed">
          Encontrá el producto que más se ajuste a vos. <br/>
          Productos sellados con garantía oficial respaldada. Servicio técnico propio.
        </p>
      </div>

      <div 
        id="categories-pills-row" 
        className="flex flex-wrap items-center justify-center gap-3 pt-2"
      >
        {CATEGORIES.map((category) => {
          const isActive = selectedCategory === category.id;
          
          return (
            <motion.button
              key={category.id}
              whileTap={{ scale: 0.96 }}
              onClick={() => onSelectCategory(category.id)}
              className={`px-6 py-3 rounded-full text-sm font-bold tracking-tight transition-all duration-300 cursor-pointer border ${
                isActive 
                  ? 'bg-black text-white border-black dark:bg-lime-500 dark:text-black dark:border-lime-500 shadow-[0_4px_15px_rgba(0,0,0,0.15)] dark:shadow-[0_4px_15px_rgba(132,204,22,0.15)]' 
                  : 'bg-white text-slate-700 border-slate-200 dark:bg-zinc-900 dark:text-zinc-300 dark:border-zinc-850 hover:border-slate-400 dark:hover:border-zinc-700 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>{category.name}</span>
              <span className={`ml-2 text-xs font-medium ${isActive ? 'text-white/60 dark:text-black/60' : 'text-slate-400 dark:text-zinc-500'}`}>
                {category.count}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
