import React from 'react';
import { motion } from 'motion/react';
import { Truck, ShieldCheck, Headset } from 'lucide-react';

export default function Features() {
  const highlights = [
    {
      icon: Truck,
      title: 'Envío Priority Gratis',
      description: 'Envío prioritario express asegurado sin costo a todo el país. Seguimiento en tiempo real desde que sale del local.',
      label: 'EXPRESS'
    },
    {
      icon: ShieldCheck,
      title: 'Garantía Oficial',
      description: 'Cobertura completa oficial certificada de 24 meses en todos tus teléfonos y dispositivos del ecosistema.',
      label: 'SOPORTE PREMIUM'
    },
    {
      icon: Headset,
      title: 'Soporte Técnico 24/7',
      description: 'Técnicos certificados listos para asesorarte u optimizar la configuración de tu nuevo smartphone.',
      label: 'SOPORTE 24H'
    }
  ];

  return (
    <section id="features" className="py-24 relative overflow-hidden bg-white dark:bg-black border-t border-slate-100 dark:border-zinc-900 transition-colors duration-300">
      {/* Background visual light elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-blue-500/5 dark:bg-lime-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Text */}
        <div className="text-center space-y-3 mb-16">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-sans text-xs text-blue-600 dark:text-lime-500 font-extrabold tracking-widest uppercase"
          >
            Nuestros Estándares
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="font-display font-normal text-4xl sm:text-5xl text-slate-900 dark:text-white tracking-tighter"
          >
            ¿Por qué elegir Free Cell Shop?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-sans text-slate-500 dark:text-zinc-400 max-w-lg mx-auto text-sm font-light leading-relaxed"
          >
            No solo vendemos celulares; respaldamos tu inversión de tecnología móvil con soporte premium y envios súper rápidos.
          </motion.p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {highlights.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -6 }}
                className="relative p-8 rounded-[28px] border border-slate-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 transition-all duration-300 group hover:border-slate-300 dark:hover:border-zinc-850 hover:shadow-[0_12px_28px_rgba(0,0,0,0.03)]"
              >
                {/* Tech label badge */}
                <div className="absolute top-4 right-4 font-sans text-[9px] font-bold text-slate-400 dark:text-zinc-550 bg-slate-50 dark:bg-zinc-900/60 border border-slate-100 dark:border-zinc-850">
                  {item.label}
                </div>

                {/* Animated Inner Icon Container */}
                <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-105 ${
                  index === 0 ? 'bg-blue-50 dark:bg-lime-950/30 text-blue-600 dark:text-lime-400 border-blue-100 dark:border-lime-900/40' :
                  index === 1 ? 'bg-indigo-50 dark:bg-lime-950/30 text-indigo-600 dark:text-lime-400 border-indigo-100 dark:border-lime-900/40' :
                  'bg-pink-50 dark:bg-lime-950/30 text-pink-600 dark:text-lime-400 border-pink-100 dark:border-lime-900/40'
                }`}>
                  <Icon className="w-6 h-6" />
                </div>

                {/* Title & Description */}
                <div className="space-y-2">
                  <h3 className="font-display font-normal text-lg text-slate-800 dark:text-zinc-100">
                    {item.title}
                  </h3>
                  <p className="font-sans text-xs text-slate-500 dark:text-zinc-400 leading-relaxed font-light">
                    {item.description}
                  </p>
                </div>

                {/* Border Accent Hover lines */}
                <div className="absolute left-0 bottom-0 w-0 h-[2.5px] bg-blue-600 dark:bg-lime-500 group-hover:w-full transition-all duration-500 rounded-b-[28px]" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
