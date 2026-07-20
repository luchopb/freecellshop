import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Wrench, 
  Check, 
  Loader2, 
  Cpu, 
  Smartphone, 
  Send,
  Zap,
  Layers,
  BatteryCharging
} from 'lucide-react';

export default function TechnicalServiceSection() {
  // Form states
  const [nombre, setNombre] = useState('');
  const [contacto, setContacto] = useState('');
  const [modelo, setModelo] = useState('');
  const [falla, setFalla] = useState('Pantalla rota / Vidrio astillado');
  const [descripcion, setDescripcion] = useState('');

  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre || !contacto || !modelo) {
      setError('Por favor completa todos los campos obligatorios.');
      return;
    }

    setLoading(true);
    setError(null);

    const mensajeCompleto = `🔧 SOLICITUD DE SERVICIO TÉCNICO
-------------------------------------------
Modelo del dispositivo: ${modelo}
Tipo de Falla: ${falla}
Descripción del problema: ${descripcion || 'Sin descripción adicional'}

👤 DATOS DE CONTACTO:
Nombre: ${nombre}
Método de contacto: ${contacto}
-------------------------------------------
Enviado desde el sitio web oficial.`;

    try {
      // Guardar localmente para respaldo
      const solicitudes = JSON.parse(localStorage.getItem('solicitudes_servicio_tecnico') || '[]');
      solicitudes.push({
        nombre,
        contacto,
        modelo,
        falla,
        descripcion,
        mensajeCompleto,
        fecha: new Date().toISOString()
      });
      localStorage.setItem('solicitudes_servicio_tecnico', JSON.stringify(solicitudes));
      
      // 2. Redirigir a WhatsApp
      const textEncoded = encodeURIComponent(mensajeCompleto);
      const whatsappUrl = `https://api.whatsapp.com/send?phone=59894423423&text=${textEncoded}`;
      
      // Intentar abrir en pestaña nueva
      const newWindow = window.open(whatsappUrl, '_blank');
      if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
        // Si el navegador bloqueó la ventana emergente, redirigir en la misma pestaña
        window.location.href = whatsappUrl;
      }
      
      setEnviado(true);
      
      // Resetear campos del formulario
      setNombre('');
      setContacto('');
      setModelo('');
      setDescripcion('');
    } catch (err: any) {
      console.error('Error al procesar solicitud técnica:', err);
      setError('Ocurrió un error al enviar tu solicitud. Intenta de nuevo por favor.');
    } finally {
      setLoading(false);
    }
  };

  const fallasComunes = [
    'Pantalla rota / Vidrio astillado',
    'Cambio de batería (Vida útil baja)',
    'Problema de carga / Puerto dañado',
    'Falla de placa madre (Micro-soldadura)',
    'Cámara rota o empañada',
    'Botones / Parlantes con problemas',
    'Mojado / Daño por líquido',
    'Otro problema (Detallar abajo)'
  ];

  const servicios = [
    {
      title: 'PANTALLAS',
      icon: Smartphone,
      description: 'Cambios táctiles, módulos LCD y pantallas OLED completas. Repuestos originales con terminación perfecta.',
      highlight: 'REPARACIÓN EN EL DÍA'
    },
    {
      title: 'COMPONENTES',
      icon: Wrench,
      description: 'Pines de carga, micrófonos, botones físicos, cámaras, altavoces y lentes de protección.',
      highlight: 'REPUESTOS CERTIFICADOS'
    },
    {
      title: 'MICROSOLDADURA',
      icon: Cpu,
      description: 'Reparación de placa madre bajo microscopio. Recuperamos equipos con cortocircuitos o mojados.',
      highlight: 'DIAGNÓSTICO AVANZADO'
    },
    {
      title: 'BATERÍAS',
      icon: BatteryCharging,
      description: 'Remplazo inmediato de baterías con certificación de vida útil al 100% y calibración oficial.',
      highlight: 'GARANTÍA DE RENDIMIENTO'
    }
  ];

  return (
    <section 
      id="servicio-tecnico" 
      className="py-24 border-t border-slate-100 dark:border-zinc-900 bg-white dark:bg-[#030304] relative overflow-hidden"
    >
      {/* Glow Decorative Spots */}
      <div className="absolute top-0 right-1/4 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[250px] h-[250px] bg-lime-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Title Block */}
        <div className="text-center space-y-3 mb-16 max-w-4xl mx-auto">
          <p className="font-sans text-xs sm:text-sm text-blue-600 dark:text-lime-400 font-extrabold tracking-widest uppercase">
            TRABAJAMOS TODAS LAS MARCAS
          </p>
          
          <h2 className="font-display font-normal text-4xl sm:text-5xl text-slate-900 dark:text-white tracking-tighter leading-none uppercase">
            Servicio Técnico Especializado
          </h2>
          
          <p className="font-sans text-slate-500 dark:text-zinc-400 text-sm sm:text-base font-light max-w-2xl mx-auto leading-relaxed">
            Soporte técnico premium de celulares de media y alta gama. 22 años de experiencia garantizan cada reparación.
          </p>
        </div>

        {/* Dynamic Column Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Block: Services Grid */}
          <div className="lg:col-span-7 space-y-8">
            <h3 className="font-display font-normal text-3xl sm:text-4xl text-slate-950 dark:text-white tracking-tight uppercase border-b border-slate-100 dark:border-zinc-900 pb-3">
              ESPECIALIDADES
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {servicios.map((s, idx) => {
                const IconComp = s.icon;
                return (
                  <div 
                    key={idx}
                    id={`servicio-card-${idx}`}
                    className="p-8 rounded-2xl bg-[#fafafa] dark:bg-zinc-950 border border-slate-100 dark:border-zinc-900 hover:border-blue-500/50 dark:hover:border-lime-400/50 hover:shadow-lg hover:-translate-y-1 hover:shadow-blue-500/5 dark:hover:shadow-lime-500/5 transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div className="space-y-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-zinc-900 flex items-center justify-center text-blue-600 dark:text-lime-400 border border-blue-100/10 dark:border-zinc-800 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white dark:group-hover:bg-lime-400 dark:group-hover:text-black transition-all duration-300">
                        <IconComp className="w-6 h-6 stroke-[1.5]" />
                      </div>
                      
                      <div className="space-y-1.5">
                        <h4 className="font-display font-normal text-xl text-slate-950 dark:text-zinc-100 tracking-tight">
                          {s.title}
                        </h4>
                        <p className="font-sans text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
                          {s.description}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 dark:border-zinc-900 flex items-center justify-between">
                      <span className="text-[9px] font-sans font-extrabold uppercase tracking-widest text-blue-600 dark:text-lime-400">
                        {s.highlight}
                      </span>
                      <button 
                        onClick={() => {
                          setFalla(s.title);
                          const formEl = document.getElementById('solicitud-presupuesto-form');
                          if (formEl) {
                            formEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                          }
                        }}
                        className="text-[10px] font-sans font-extrabold text-slate-400 dark:text-zinc-500 hover:text-blue-600 dark:hover:text-lime-400 uppercase tracking-widest flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        CONSULTAR →
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Block: Embedded WhatsApp Form */}
          <div className="lg:col-span-5">
            <div 
              id="solicitud-presupuesto-form"
              className="p-8 rounded-[32px] border border-slate-150 dark:border-zinc-900 bg-[#fafafa] dark:bg-zinc-950 shadow-md sticky top-28"
            >
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-1.5 text-blue-600 dark:text-lime-400 font-extrabold text-xs uppercase tracking-wider">
                  <Wrench className="w-4 h-4 shrink-0" />
                  Presupuesto Sin Cargo
                </div>
                <h3 className="font-display font-normal text-2xl text-slate-900 dark:text-white uppercase tracking-tight">
                  SOLICITAR REPARACIÓN
                </h3>
                <p className="font-sans text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
                  Ingresá tus datos para recibir una cotización exacta al instante por WhatsApp.
                </p>
              </div>

              <AnimatePresence mode="wait">
                {!enviado ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                      <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50 text-red-600 dark:text-red-400 font-sans text-xs font-semibold">
                        {error}
                      </div>
                    )}

                    <div className="space-y-3.5">
                      <div>
                        <label className="block font-sans text-[10px] text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5 font-bold">Tu Nombre Completo *</label>
                        <input
                          type="text"
                          required
                          value={nombre}
                          onChange={(e) => setNombre(e.target.value)}
                          placeholder="Ej. Martín González"
                          className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-550 focus:outline-none focus:border-blue-600 dark:focus:border-lime-500 focus:ring-1 focus:ring-blue-600 dark:focus:ring-lime-500 transition-all font-semibold"
                        />
                      </div>

                      <div>
                        <label className="block font-sans text-[10px] text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5 font-bold">WhatsApp o Correo *</label>
                        <input
                          type="text"
                          required
                          value={contacto}
                          onChange={(e) => setContacto(e.target.value)}
                          placeholder="Ej. +598 94 123 456"
                          className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-550 focus:outline-none focus:border-blue-600 dark:focus:border-lime-500 focus:ring-1 focus:ring-blue-600 dark:focus:ring-lime-500 transition-all font-semibold"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div>
                          <label className="block font-sans text-[10px] text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5 font-bold">Modelo exacto *</label>
                          <input
                            type="text"
                            required
                            value={modelo}
                            onChange={(e) => setModelo(e.target.value)}
                            placeholder="Ej. iPhone 14 Pro Max"
                            className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-550 focus:outline-none focus:border-blue-600 dark:focus:border-lime-500 focus:ring-1 focus:ring-blue-600 dark:focus:ring-lime-500 transition-all font-semibold"
                          />
                        </div>

                        <div>
                          <label className="block font-sans text-[10px] text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5 font-bold">Tipo de Reparación</label>
                          <select
                            value={falla}
                            onChange={(e) => setFalla(e.target.value)}
                            className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-600 dark:focus:border-lime-500 focus:ring-1 focus:ring-blue-600 dark:focus:ring-lime-500 transition-all font-bold"
                          >
                            {fallasComunes.map((f, i) => (
                              <option key={i} value={f} className="bg-white dark:bg-zinc-950 text-slate-900 dark:text-white">
                                {f}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block font-sans text-[10px] text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5 font-bold">Contanos el problema</label>
                        <textarea
                          rows={3}
                          value={descripcion}
                          onChange={(e) => setDescripcion(e.target.value)}
                          placeholder="Ej. Se cayó al agua y no enciende, o la pantalla tiene una línea verde..."
                          className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl px-4 py-3 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-550 focus:outline-none focus:border-blue-600 dark:focus:border-lime-500 focus:ring-1 focus:ring-blue-600 dark:focus:ring-lime-500 transition-all font-medium resize-none"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 rounded-full font-sans font-extrabold text-sm tracking-tight text-white dark:text-black bg-slate-950 dark:bg-lime-500 hover:bg-slate-800 dark:hover:bg-lime-600 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer mt-4"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-white dark:text-black" />
                          <span>ABRIENDO WHATSAPP...</span>
                        </>
                      ) : (
                        <>
                          <span>ENVIAR SOLICITUD POR WHATSAPP</span>
                          <Send className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  <motion.div
                    key="enviado-success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-10 flex flex-col items-center justify-center text-center space-y-4"
                  >
                    <div className="w-14 h-14 rounded-full bg-emerald-50 dark:bg-lime-950 border border-emerald-100 dark:border-lime-900/40 flex items-center justify-center text-emerald-600 dark:text-lime-400">
                      <Check className="w-7 h-7" />
                    </div>
                    <div className="space-y-1.5">
                      <h4 className="font-display font-bold text-xl text-slate-900 dark:text-white tracking-tight uppercase">
                        ¡Abriendo chat de WhatsApp!
                      </h4>
                      <p className="font-sans text-xs text-slate-500 dark:text-zinc-400 max-w-xs leading-relaxed">
                        Te hemos redirigido a WhatsApp con tu consulta preestablecida para que un técnico oficial te cotice de inmediato.
                      </p>
                    </div>
                    <button
                      onClick={() => setEnviado(false)}
                      className="px-6 py-2.5 rounded-full font-sans font-extrabold text-[10px] uppercase tracking-wider text-blue-600 dark:text-lime-400 bg-blue-50 dark:bg-lime-950/20 border border-blue-100/30 dark:border-lime-900/30 hover:bg-blue-100/50 dark:hover:bg-lime-950/50 transition-all cursor-pointer mt-2"
                    >
                      NUEVA CONSULTA TÉCNICA
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
