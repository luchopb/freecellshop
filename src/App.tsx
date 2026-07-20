import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Instagram, 
  Send, 
  PhoneCall, 
  MessageSquare, 
  Compass, 
  Check, 
  Loader2, 
  MapPin, 
  Clock, 
  ArrowUp,
  Cpu,
  RefreshCw,
  AlertCircle,
  Calendar,
  Database,
  TrendingUp,
  ExternalLink,
  Layers,
  Globe
} from 'lucide-react';

import { Testimonial } from './types';
import { TESTIMONIALS } from './data';

import Navbar from './components/Navbar';
import Logo from './components/Logo';
import PromoSlider from './components/PromoSlider';
import BannerButtons from './components/BannerButtons';
import Features from './components/Features';
import Newsletter from './components/Newsletter';
import TechnicalServiceSection from './components/TechnicalServiceSection';

export default function App() {
  // Global States
  const [activeSection, setActiveSection] = useState('home');
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Dark Mode State is permanently set to dark for consistent premium cyber look
  const isDark = true;

  useEffect(() => {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  }, []);

  // Contact Form State
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMsg, setContactMsg] = useState('');
  const [isSendingMsg, setIsSendingMsg] = useState(false);
  const [msgSentSuccess, setMsgSentSuccess] = useState(false);

  // Track window scrolled position for active links & showing scroll-to-top buttons
  useEffect(() => {
    const handleScroll = () => {
      // Show/hide scroll top button
      setShowScrollTop(window.scrollY > 500);

      const scrollPosition = window.scrollY + 160; // offset
      const sections = ['home', 'servicio-tecnico', 'features', 'opiniones', 'contact'];
      
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Custom visual navigation scroll clicker
  const handleNavigate = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      const navbarHeight = 70;
      const elementPosition = el.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - navbarHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setActiveSection(sectionId);
    }
  };

  // Local contact Message writing Dispatcher (Saved to localStorage)
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMsg) return;

    setIsSendingMsg(true);
    try {
      // Guardar el mensaje localmente
      const mensajes = JSON.parse(localStorage.getItem('mensajes_contacto') || '[]');
      mensajes.push({
        nombre: contactName,
        email: contactEmail,
        mensaje: contactMsg,
        fecha: new Date().toISOString()
      });
      localStorage.setItem('mensajes_contacto', JSON.stringify(mensajes));

      // Simular latencia de red para mejor UX
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      setIsSendingMsg(false);
      setMsgSentSuccess(true);
      setContactName('');
      setContactEmail('');
      setContactMsg('');
      setTimeout(() => {
        setMsgSentSuccess(false);
      }, 5000);
    } catch (err) {
      console.error("Fallo el envío local del mensaje:", err);
      setIsSendingMsg(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f9f9fb] dark:bg-black text-slate-650 dark:text-zinc-300 overflow-x-hidden selection:bg-blue-600 dark:selection:bg-lime-500 selection:text-white dark:selection:text-black">
      
      {/* Visual Ambient Grid / Glow Mesh Backdrop */}
      <div className="cyber-bg-glow" />
      {/* Fixed Header bar */}
      <Navbar 
        activeSection={activeSection}
        onNavigate={handleNavigate}
      />

      {/* Hero Welcome Stage */}
      <PromoSlider />

      {/* Quick Access Action Bar Buttons */}
      <BannerButtons onNavigate={handleNavigate} />

      {/* Modern Technical Service Section */}
      <TechnicalServiceSection />

      {/* Trust standards layout segment */}
      <Features />

      {/* Testimonials Review Slider */}
      <section id="opiniones" className="py-24 border-t border-slate-100 dark:border-zinc-900 relative overflow-hidden bg-slate-50/50 dark:bg-zinc-950/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-16">
            <p className="font-sans text-xs text-blue-600 dark:text-lime-500 font-extrabold tracking-widest uppercase">Garantía de Cliente</p>
            <h2 className="font-display font-normal text-4xl sm:text-5xl text-slate-900 dark:text-white tracking-tighter">Experiencias de Compra</h2>
            <p className="font-sans text-slate-500 dark:text-zinc-400 max-w-md mx-auto text-sm font-light">
              Lee lo que opinan los profesionales que ya han migrado su equipo móvil con nosotros.
            </p>
          </div>

          <div id="testimonials-carousel" className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t) => (
              <div 
                key={t.id} 
                className="p-8 rounded-[24px] bg-white dark:bg-zinc-950 border border-slate-100 dark:border-zinc-900 shadow-sm flex flex-col justify-between space-y-6 hover:shadow-md dark:hover:shadow-lime-500/5 transition-shadow"
              >
                <p className="font-sans text-sm text-slate-500 dark:text-zinc-400 leading-relaxed font-light italic">
                  "{t.comment}"
                </p>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 dark:border-zinc-800 shrink-0">
                    <img src={t.avatar} alt={t.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div>
                    <h5 className="font-display font-normal text-sm text-slate-800 dark:text-zinc-200">{t.name}</h5>
                    <p className="font-sans text-[10px] text-slate-400 dark:text-zinc-500 font-semibold uppercase">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center flex justify-center">
            <a 
              href="https://maps.app.goo.gl/7H9kZASBXLxuypUX7" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 hover:border-blue-550 dark:hover:border-lime-400 font-sans text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-zinc-200 transition-all shadow-md hover:shadow-lg hover:shadow-blue-500/5 dark:hover:shadow-lime-500/5 cursor-pointer hover:scale-[1.02]"
            >
              <img src="https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png" alt="Google" className="h-4 object-contain brightness-100 dark:brightness-110" />
              <span>Ver opiniones en Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5 text-blue-500 dark:text-lime-400" />
            </a>
          </div>
        </div>
      </section>

      {/* Contact Ticketing Interactive Desk */}
      <section id="contact" className="py-24 border-t border-slate-100 dark:border-zinc-900 relative overflow-hidden bg-white dark:bg-black">
        {/* Background mesh */}
        <div className="absolute bottom-10 left-10 w-[200px] h-[200px] bg-blue-500/5 dark:bg-lime-500/5 rounded-full blur-[90px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left side text columns */}
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-3">
                <p className="font-sans text-xs text-blue-600 dark:text-lime-500 font-extrabold tracking-widest uppercase">Mesa de Ayuda</p>
                <h2 className="font-display font-normal text-3xl sm:text-4xl text-slate-900 dark:text-white tracking-tighter leading-tight">¿Tenés dudas o buscás asesoría?</h2>
                <p className="font-sans text-slate-500 dark:text-zinc-400 text-sm font-light leading-relaxed">
                  Estamos listos para guiar tu compra o recomendarte el mejor equipo. Escribinos o contactanos por cualquiera de nuestros canales oficiales.
                </p>
              </div>

              {/* Direct channels */}
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 dark:border-zinc-900 bg-slate-50/50 dark:bg-zinc-950/30 shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-lime-950/30 flex items-center justify-center shrink-0">
                    <PhoneCall className="w-4 h-4 text-blue-600 dark:text-lime-400 animate-bounce" />
                  </div>
                  <div>
                    <h6 className="font-display font-normal text-xs text-slate-800 dark:text-zinc-200">Canal Telefónico Directo</h6>
                    <a href="tel:+59829022659" className="font-sans text-xs text-slate-650 dark:text-zinc-300 font-bold hover:text-blue-600 dark:hover:text-lime-400 transition-colors">+598 2902 2659</a>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 dark:border-zinc-900 bg-slate-50/50 dark:bg-zinc-950/30 shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-lime-950/30 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-indigo-600 dark:text-lime-400" />
                  </div>
                  <div>
                    <h6 className="font-display font-normal text-xs text-slate-800 dark:text-zinc-200">Oficinas / Showroom Principal</h6>
                    <p className="font-sans text-xs text-slate-500 dark:text-zinc-400 font-medium">Galería De Las Américas, Av. 18 de Julio 1240, 11100 Montevideo, Uruguay</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 dark:border-zinc-900 bg-slate-50/50 dark:bg-zinc-950/30 shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-pink-50 dark:bg-lime-950/30 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4 text-pink-600 dark:text-lime-400" />
                  </div>
                  <div>
                    <h6 className="font-display font-normal text-xs text-slate-800 dark:text-zinc-200">Horario de Despacho</h6>
                    <p className="font-sans text-xs text-slate-500 dark:text-zinc-400 font-medium">Lunes a Viernes de 10 a 19h</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 dark:border-zinc-900 bg-slate-50/50 dark:bg-zinc-950/30 shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-lime-950/30 flex items-center justify-center shrink-0">
                    <Instagram className="w-4 h-4 text-violet-600 dark:text-lime-400" />
                  </div>
                  <div>
                    <h6 className="font-display font-normal text-xs text-slate-800 dark:text-zinc-200">Instagram Oficial</h6>
                    <a href="http://www.instagram.com/freecellshop" target="_blank" rel="noreferrer" className="font-sans text-xs text-blue-600 dark:text-lime-400 font-bold hover:underline">@freecellshop</a>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side form block */}
            <div className="lg:col-span-7">
              <div className="p-8 rounded-[32px] border border-slate-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 shadow-[0_15px_30px_rgba(0,0,0,0.02)] relative overflow-hidden">
                
                <h3 className="font-display font-normal text-lg text-slate-800 dark:text-zinc-200 mb-6">Enviar Mensaje Digital</h3>
                
                <AnimatePresence mode="wait">
                  {!msgSentSuccess ? (
                    <motion.form 
                       key="msg-form"
                       initial={{ opacity: 1 }}
                       exit={{ opacity: 0 }}
                       onSubmit={handleSendMessage} 
                       className="space-y-4"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block font-sans text-[10px] text-slate-500 dark:text-zinc-450 uppercase tracking-wide mb-1.5 font-bold">Nombre Completo</label>
                          <input
                            type="text"
                            required
                            value={contactName}
                            onChange={(e) => setContactName(e.target.value)}
                            placeholder="Ej. Martín"
                            className="w-full bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-full px-4 py-3 text-xs text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-600 dark:focus:border-lime-500 focus:ring-1 focus:ring-blue-600 dark:focus:ring-lime-500 transition-all font-semibold"
                          />
                        </div>
                        <div>
                          <label className="block font-sans text-[10px] text-slate-500 dark:text-zinc-450 uppercase tracking-wide mb-1.5 font-bold">Correo de Respuesta</label>
                          <input
                            type="email"
                            required
                            value={contactEmail}
                            onChange={(e) => setContactEmail(e.target.value)}
                            placeholder="martin@tech.co"
                            className="w-full bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-full px-4 py-3 text-xs text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-600 dark:focus:border-lime-500 focus:ring-1 focus:ring-blue-600 dark:focus:ring-lime-500 transition-all font-semibold"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-sans text-[10px] text-slate-500 dark:text-zinc-450 uppercase tracking-wide mb-1.5 font-bold">Tu Mensaje</label>
                        <textarea
                          rows={4}
                          required
                          value={contactMsg}
                          onChange={(e) => setContactMsg(e.target.value)}
                          placeholder="Hola Free Cell Shop, me interesa optimizar mi setup móvil..."
                          className="w-full bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-[20px] px-4 py-3 text-xs text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-600 dark:focus:border-lime-500 focus:ring-1 focus:ring-blue-600 dark:focus:ring-lime-500 transition-all font-medium resize-none"
                        />
                      </div>

                      <button
                        id="contact-form-submit"
                        type="submit"
                        disabled={isSendingMsg}
                        className="w-full py-4 rounded-full font-sans font-extrabold text-sm tracking-tight bg-slate-950 dark:bg-lime-500 hover:bg-slate-800 dark:hover:bg-lime-600 text-white dark:text-black shadow-md shadow-slate-100 dark:shadow-lime-500/10 transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        {isSendingMsg ? (
                          <Loader2 className="w-4 h-4 animate-spin text-white dark:text-black" />
                        ) : (
                          <>
                            <span>TRANSMITIR MENSAJE</span>
                            <Send className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    </motion.form>
                  ) : (
                    <motion.div
                      key="msg-success"
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.95, opacity: 0 }}
                      className="py-12 flex flex-col items-center justify-center text-center space-y-4"
                    >
                      <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                        <Check className="w-6 h-6" />
                      </div>
                      <div className="space-y-1.5">
                        <h4 className="font-display font-bold text-base text-slate-800 dark:text-zinc-200">¡Mensaje Transmitido con Éxito!</h4>
                        <p className="font-sans text-xs text-slate-500 dark:text-zinc-400 max-w-sm leading-relaxed">
                          Hemos recibido tus datos con éxito. Uno de nuestros asesores técnicos de ventas se comunicará vía mail en un plazo máximo de 2 horas hábiles.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Global Newsletter Subscription block */}
      <Newsletter />

      {/* Premium Dark Slate Footer with structural contrasts */}
      <footer className="bg-[#050507] text-slate-400 border-t border-zinc-900 py-16 relative z-10 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center pb-8 border-b border-slate-900 dark:border-zinc-900">
            
            {/* Logo and info */}
            <div className="md:col-span-4 space-y-3">
              <div className="flex items-center">
                <Logo height="32" className="text-white hover:scale-[1.02] transition-all duration-300" />
              </div>
              <p className="font-sans text-slate-400 dark:text-zinc-550 font-light leading-relaxed max-w-xs text-xs">
                La tienda móvil preferida de los fanáticos de la tecnología. Innovaciones de vanguardia, envíos ultra veloces.
              </p>
            </div>

            {/* Quick links lists */}
            <div className="md:col-span-5 grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <h6 className="font-sans font-extrabold text-white text-[10px] tracking-wider uppercase">Secciones</h6>
                <ul className="space-y-1.5 font-sans text-xs text-slate-400 dark:text-zinc-550">
                  <li><button onClick={() => handleNavigate('home')} className="hover:text-blue-400 dark:hover:text-lime-400 transition-colors cursor-pointer">Inicio</button></li>
                  <li><button onClick={() => handleNavigate('servicio-tecnico')} className="hover:text-blue-400 dark:hover:text-lime-400 transition-colors cursor-pointer">S. Técnico</button></li>
                  <li><button onClick={() => handleNavigate('features')} className="hover:text-blue-400 dark:hover:text-lime-400 transition-colors cursor-pointer">Detalles</button></li>
                  <li><button onClick={() => handleNavigate('opiniones')} className="hover:text-blue-400 dark:hover:text-lime-400 transition-colors cursor-pointer">Opiniones</button></li>
                  <li><button onClick={() => handleNavigate('contact')} className="hover:text-blue-400 dark:hover:text-lime-400 transition-colors cursor-pointer">Contacto</button></li>
                </ul>
              </div>
              <div className="space-y-2">
                <h6 className="font-sans font-extrabold text-white text-[10px] tracking-wider uppercase">Servicio Técnico</h6>
                <ul className="space-y-1.5 font-sans text-xs text-slate-400 dark:text-zinc-550">
                  <li><button onClick={() => handleNavigate('servicio-tecnico')} className="hover:text-blue-400 dark:hover:text-lime-400 transition-colors text-left cursor-pointer">Reparaciones</button></li>
                  <li><button onClick={() => handleNavigate('servicio-tecnico')} className="hover:text-blue-400 dark:hover:text-lime-400 transition-colors text-left cursor-pointer">Pantallas OLED</button></li>
                  <li><button onClick={() => handleNavigate('servicio-tecnico')} className="hover:text-blue-400 dark:hover:text-lime-400 transition-colors text-left cursor-pointer">Baterías 100%</button></li>
                  <li><button onClick={() => handleNavigate('servicio-tecnico')} className="hover:text-blue-400 dark:hover:text-lime-400 transition-colors text-left cursor-pointer">Presupuestos</button></li>
                </ul>
              </div>
              <div className="space-y-2">
                <h6 className="font-sans font-extrabold text-white text-[10px] tracking-wider uppercase">Soporte</h6>
                <ul className="space-y-1.5 font-sans text-xs text-slate-400 dark:text-zinc-550">
                  <li><button onClick={() => handleNavigate('contact')} className="hover:text-blue-400 dark:hover:text-lime-400 transition-colors cursor-pointer">Contacto</button></li>
                  <li><button className="hover:text-blue-400 dark:hover:text-lime-400 transition-colors text-left cursor-pointer">Términos de Servicio</button></li>
                  <li><button className="hover:text-blue-400 dark:hover:text-lime-400 transition-colors text-left cursor-pointer">Políticas de Privacidad</button></li>
                </ul>
              </div>
            </div>

            {/* Social channels */}
            <div className="md:col-span-3 flex flex-col items-start md:items-end space-y-3">
              <h6 className="font-sans font-extrabold text-white text-[10px] tracking-wider uppercase">Redes Oficiales</h6>
              <div className="flex gap-2.5">
                <a 
                  href="http://www.instagram.com/freecellshop" 
                  target="_blank" 
                  rel="noreferrer"
                  className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 hover:border-blue-500/50 dark:hover:border-lime-500 flex items-center justify-center text-slate-350 hover:text-white hover:bg-slate-850 transition-all shadow-sm"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a 
                  href="https://twitter.com" 
                  target="_blank" 
                  rel="noreferrer"
                  className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 hover:border-blue-500/50 dark:hover:border-lime-500 flex items-center justify-center text-slate-350 hover:text-white hover:bg-slate-850 transition-all shadow-sm"
                >
                  <Compass className="w-4 h-4" />
                </a>
                <a 
                  href="https://facebook.com" 
                  target="_blank" 
                  rel="noreferrer"
                  className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 hover:border-blue-500/50 dark:hover:border-lime-500 flex items-center justify-center text-slate-350 hover:text-white hover:bg-slate-850 transition-all shadow-sm"
                >
                  <MessageSquare className="w-4 h-4" />
                </a>
              </div>
            </div>

          </div>

          {/* Copy-row */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-sans text-xs">
            <span className="text-slate-500">
              Free Cell Shop © 2026. Todos los derechos reservados.
            </span>
            <span className="text-slate-650 dark:text-lime-500 font-bold uppercase tracking-widest text-[10px]">
              {isDark ? 'Tema Cyber Dark Activado' : 'Diseño Elegante Premium Light'}
            </span>
          </div>
        </div>
      </footer>

      {/* Click Scroll back to top element button panel */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            key="scroll-top-btn"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-6 right-6 z-30 p-3.5 rounded-full border border-slate-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900 text-slate-800 dark:text-zinc-200 hover:text-blue-600 dark:hover:text-lime-500 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all cursor-pointer shadow-lg shadow-black/5"
          >
            <ArrowUp className="w-4 h-4" />
          </motion.button>
        )}
      </AnimatePresence>
      
    </div>
  );
}
