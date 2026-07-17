import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Star, ThumbsUp, ExternalLink, Calendar, Check } from 'lucide-react';

interface GoogleReviewsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ReviewItem {
  id: string;
  autor: string;
  rating: number;
  fecha: string;
  comentario: string;
  avatar: string;
  perfilConfirmado: boolean;
  likes: number;
}

export default function GoogleReviewsModal({ isOpen, onClose }: GoogleReviewsModalProps) {
  
  const reviews: ReviewItem[] = [
    {
      id: 'rev-01',
      autor: 'Diego Falero',
      rating: 5,
      fecha: 'Hace 2 días',
      comentario: 'Excelente servicio. Compré un S25 Ultra combo y la Smart TV llegó de regalo tal como prometieron. El despacho a Montevideo fue en el mismo día, todo sellado y en perfecto estado. 10/10.',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
      perfilConfirmado: true,
      likes: 12
    },
    {
      id: 'rev-02',
      autor: 'Valentina Cabrera',
      rating: 5,
      fecha: 'Hace 1 semana',
      comentario: 'Excelente el servicio técnico. Lleve mi iPhone 13 Pro por cambio de módulo y batería, y quedó como nuevo en menos de dos horas. Me dieron garantía escrita y súper buen precio.',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
      perfilConfirmado: true,
      likes: 8
    },
    {
      id: 'rev-03',
      autor: 'Santiago Silva',
      rating: 5,
      fecha: 'Hace 2 semanas',
      comentario: 'Segunda compra que hago aquí. Primero un reloj y ahora el combo del iPhone 16 Pro Max con los AirPods de regalo. El soporte por WhatsApp es inmediato y muy profesional. Totalmente recomendados.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
      perfilConfirmado: true,
      likes: 5
    },
    {
      id: 'rev-04',
      autor: 'Mariana Gamarra',
      rating: 5,
      fecha: 'Hace 3 semanas',
      comentario: '¡Súper conformes! Compré desde Maldonado y el envío llegó al día siguiente de mañana por DAC. Muy bien empaquetado, todo impecable y sellado de fábrica. El cargador GaN de 140W vuela.',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80',
      perfilConfirmado: true,
      likes: 4
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* Modal box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl z-10 text-white p-6 sm:p-8 text-left"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header / Google Rating Recap */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 pb-6 border-b border-zinc-900">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {/* Google colored G logo */}
                  <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center font-black text-sm select-none shrink-0 shadow-sm">
                    <span className="text-[#4285F4]">G</span>
                  </div>
                  <span className="font-sans text-[10px] uppercase font-black tracking-widest text-zinc-450">Google Opiniones</span>
                </div>
                <h3 className="font-display font-black text-2xl tracking-tight text-white leading-tight">
                  Nuestra Reputación Oficial
                </h3>
              </div>

              {/* Average Stats card */}
              <div className="flex items-center gap-4 bg-zinc-900/60 border border-zinc-850 p-4 rounded-2xl shrink-0">
                <div className="text-center">
                  <p className="font-display font-black text-3xl text-white tracking-tight leading-none">4.9</p>
                  <p className="font-sans text-[9px] text-zinc-500 uppercase font-bold mt-1">sobre 5 estrellas</p>
                </div>
                <div className="h-10 w-px bg-zinc-800" />
                <div>
                  <div className="flex text-amber-400 gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="font-sans text-[11px] text-zinc-400 font-semibold mt-1">328 opiniones verificadas</p>
                </div>
              </div>
            </div>

            {/* Scrollable list of reviews */}
            <div className="my-6 max-h-[380px] overflow-y-auto space-y-4 pr-1 scrollbar-thin">
              {reviews.map((rev) => (
                <div 
                  key={rev.id}
                  className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-900 hover:border-zinc-850 transition-colors space-y-3"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full overflow-hidden border border-zinc-800 shrink-0">
                        <img src={rev.avatar} alt={rev.autor} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h5 className="font-display font-bold text-xs text-zinc-100">{rev.autor}</h5>
                          {rev.perfilConfirmado && (
                            <span className="inline-flex items-center gap-0.5 text-[8px] bg-emerald-950/40 text-emerald-400 px-1.5 py-0.5 rounded-full border border-emerald-900/30">
                              <Check className="w-2.5 h-2.5" />
                              Verificado
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <div className="flex text-amber-400 gap-0.5">
                            {[...Array(rev.rating)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                            ))}
                          </div>
                          <span className="font-sans text-[9px] text-zinc-500 font-semibold">{rev.fecha}</span>
                        </div>
                      </div>
                    </div>

                    {/* Google G stamp */}
                    <div className="w-5 h-5 rounded-full bg-zinc-950 border border-zinc-850 flex items-center justify-center font-sans text-[10px] text-zinc-500 font-bold select-none shrink-0">
                      G
                    </div>
                  </div>

                  <p className="font-sans text-xs text-zinc-350 leading-relaxed font-light">
                    "{rev.comentario}"
                  </p>

                  <div className="flex items-center gap-3 pt-1 text-[11px] text-zinc-500 font-sans">
                    <button className="flex items-center gap-1 hover:text-lime-400 transition-colors cursor-pointer">
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>Útil ({rev.likes})</span>
                    </button>
                    <span className="text-zinc-800">•</span>
                    <span>Reportar</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Call to Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-zinc-900 justify-end">
              <button
                onClick={onClose}
                className="px-6 py-3 rounded-full font-sans font-bold text-xs tracking-tight border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white transition-colors cursor-pointer text-center"
              >
                Cerrar Ventana
              </button>
              
              <a
                href="https://maps.app.goo.gl/7H9kZASBXLxuypUX7"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-full font-sans font-extrabold text-xs tracking-tight bg-lime-500 hover:bg-lime-600 text-black shadow-lg shadow-lime-500/10 transition-transform hover:scale-[1.02] flex items-center justify-center gap-1.5 cursor-pointer text-center"
              >
                <span>VER TODOS EN GOOGLE MAPS</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
