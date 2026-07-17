import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Check, ArrowRight, Loader2 } from 'lucide-react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => {
        setIsSubscribed(false);
      }, 5000);
    }, 1500);
  };

  return (
    <section className="py-24 relative overflow-hidden border-t border-b border-zinc-900 bg-black text-center" id="newsletter">
      {/* Background blurs */}
      <div className="absolute top-0 right-10 w-[200px] h-[200px] bg-lime-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-[250px] h-[250px] bg-lime-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
        
        {/* Top Mail Circle */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-[20px] bg-lime-950/20 border border-lime-900/30 mx-auto shadow-sm">
          <Mail className="w-6 h-6 text-lime-500" />
        </div>

        {/* Texts */}
        <div className="space-y-3">
          <h2 className="font-display font-normal text-3xl sm:text-4xl text-white tracking-tighter">
            Unite al Club de Lanzamientos
          </h2>
          <p className="font-sans text-xs sm:text-sm text-zinc-400 font-light max-w-lg mx-auto leading-relaxed">
            Recibí avisos prioritarios de lanzamientos premium con stock ultralimitado, ofertas de locura del Cyber Monday y cupones de descuento exclusivos directo en tu casilla.
          </p>
        </div>

        {/* Form */}
        <div className="max-w-md mx-auto relative font-sans">
          <AnimatePresence mode="wait">
            {!isSubscribed ? (
              <motion.form
                key="subscribe-form"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubscribe}
                className="flex flex-col sm:flex-row gap-3"
              >
                <div className="relative flex-1">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-550" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Ingresa tu dirección de email"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-full pl-11 pr-4 py-3.5 font-sans text-xs text-white placeholder-zinc-550 focus:outline-none focus:border-lime-500 focus:ring-1 focus:ring-lime-500 font-semibold transition-all shadow-sm"
                  />
                </div>
                <button
                  id="newsletter-subscribe-button"
                  type="submit"
                  disabled={isSubmitting}
                  className="py-3.5 px-6 rounded-full font-sans text-xs font-extrabold tracking-tight text-black bg-lime-500 hover:bg-lime-600 transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin text-black" />
                  ) : (
                    <>
                      <span>SUSCRIBIRME</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </motion.form>
            ) : (
              <motion.div
                key="subscribe-success"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="p-4 rounded-full border border-emerald-850 bg-emerald-950/20 text-emerald-400 font-bold text-xs tracking-tight flex items-center justify-center gap-2 shadow-sm"
              >
                <Check className="w-4 h-4 text-emerald-450" />
                <span>Te has suscrito con éxito. Revisá tu casilla de correo.</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Aesthetic security sub line */}
        <p className="font-sans text-[10px] text-zinc-550 tracking-wide pt-2">
          *Respetamos tu privacidad. No enviamos spam y puedes desuscribirte en cualquier momento con un clic.
        </p>

      </div>
    </section>
  );
}
