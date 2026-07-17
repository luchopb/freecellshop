import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Wrench, Shield, Check, Loader2, Cpu, Smartphone, Sparkles, Send } from 'lucide-react';
import { useFirebase } from '../context/FirebaseContext';

interface TechnicalServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TechnicalServiceModal({ isOpen, onClose }: TechnicalServiceModalProps) {
  const { submitContactMessage } = useFirebase();

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
Nombre del cliente: ${nombre}
Método de contacto: ${contacto}
-------------------------------------------
Enviado desde el formulario de Servicio Técnico Oficial.`;

    try {
      await submitContactMessage(nombre, contacto, mensajeCompleto);
      setEnviado(true);
      // Reset form
      setNombre('');
      setContacto('');
      setModelo('');
      setDescripcion('');
    } catch (err: any) {
      console.error('Error al guardar solicitud de servicio técnico:', err);
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
            className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl z-10 text-white flex flex-col md:flex-row"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Left Column: Info details */}
            <div className="w-full md:w-5/12 bg-zinc-900/50 p-6 sm:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-zinc-800">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-lime-950/40 border border-lime-900/40 text-lime-400 font-sans text-[10px] font-black uppercase tracking-wider">
                  <Wrench className="w-3.5 h-3.5" />
                  Soporte Premium
                </div>

                <div className="space-y-2">
                  <h3 className="font-display font-black text-2xl tracking-tight leading-tight text-white">
                    Servicio Técnico Especializado
                  </h3>
                  <p className="font-sans text-xs text-zinc-400 leading-relaxed font-light">
                    Reparamos celulares de alta gama de forma profesional con repuestos originales de calidad certificada.
                  </p>
                </div>

                <div className="space-y-3 pt-2 text-left">
                  <div className="flex items-start gap-2.5">
                    <Shield className="w-4 h-4 text-lime-400 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="font-display font-bold text-xs text-zinc-200">Garantía Escrita</h5>
                      <p className="font-sans text-[11px] text-zinc-400">Todas nuestras reparaciones cuentan con 3 meses de garantía real.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Cpu className="w-4 h-4 text-lime-400 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="font-display font-bold text-xs text-zinc-200">Micro-soldadura</h5>
                      <p className="font-sans text-[11px] text-zinc-400">Especialistas en fallas de placa de nivel avanzado, integrados y FaceID.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Smartphone className="w-4 h-4 text-lime-400 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="font-display font-bold text-xs text-zinc-200">Repuestos Originales</h5>
                      <p className="font-sans text-[11px] text-zinc-400">Pantallas OLED genuinas, baterías certificadas y módulos de alta durabilidad.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="hidden md:block pt-6 border-t border-zinc-900">
                <p className="text-[10px] text-zinc-500 leading-tight">
                  ⚡ <strong>Presupuesto sin cargo:</strong> Trae tu equipo a nuestro taller principal y lo diagnosticamos en el momento de forma totalmente gratuita.
                </p>
              </div>
            </div>

            {/* Right Column: Form interactive desk */}
            <div className="w-full md:w-7/12 p-6 sm:p-8 flex flex-col justify-center">
              {!enviado ? (
                <form onSubmit={handleSubmit} className="space-y-4 text-left">
                  <div className="space-y-1">
                    <h4 className="font-display font-black text-sm text-zinc-200 uppercase tracking-wide">
                      Solicitar Presupuesto Online
                    </h4>
                    <p className="font-sans text-[11px] text-zinc-500">
                      Completa los detalles y un técnico se contactará en minutos.
                    </p>
                  </div>

                  {error && (
                    <div className="p-3 rounded-xl bg-red-950/30 border border-red-900/50 text-red-400 font-sans text-xs">
                      {error}
                    </div>
                  )}

                  <div className="space-y-3">
                    <div>
                      <label className="block font-sans text-[10px] text-zinc-400 uppercase tracking-wider mb-1 font-bold">Tu Nombre *</label>
                      <input
                        type="text"
                        required
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        placeholder="Ej. Juan Pérez"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-lime-500 focus:ring-1 focus:ring-lime-500 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block font-sans text-[10px] text-zinc-400 uppercase tracking-wider mb-1 font-bold">WhatsApp o Correo *</label>
                      <input
                        type="text"
                        required
                        value={contacto}
                        onChange={(e) => setContacto(e.target.value)}
                        placeholder="Ej. +598 99 123 456 / juan@gmail.com"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-lime-500 focus:ring-1 focus:ring-lime-500 transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-sans text-[10px] text-zinc-400 uppercase tracking-wider mb-1 font-bold">Modelo del Celular *</label>
                        <input
                          type="text"
                          required
                          value={modelo}
                          onChange={(e) => setModelo(e.target.value)}
                          placeholder="Ej. iPhone 15 Pro, S24 Ultra"
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-lime-500 focus:ring-1 focus:ring-lime-500 transition-all"
                        />
                      </div>

                      <div>
                        <label className="block font-sans text-[10px] text-zinc-400 uppercase tracking-wider mb-1 font-bold">Tipo de Falla</label>
                        <select
                          value={falla}
                          onChange={(e) => setFalla(e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-lime-500 focus:ring-1 focus:ring-lime-500 transition-all"
                        >
                          {fallasComunes.map((f, i) => (
                            <option key={i} value={f} className="bg-zinc-950">
                              {f}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block font-sans text-[10px] text-zinc-400 uppercase tracking-wider mb-1 font-bold">Descripción del problema</label>
                      <textarea
                        rows={2}
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        placeholder="Cuéntanos más detalles, por ejemplo: ¿se golpeó?, ¿dejó de cargar de un momento a otro?"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-lime-500 focus:ring-1 focus:ring-lime-500 transition-all resize-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-full font-sans font-extrabold text-xs tracking-wider bg-lime-500 hover:bg-lime-600 text-black shadow-lg shadow-lime-500/10 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:bg-zinc-800 disabled:text-zinc-500 disabled:cursor-not-allowed mt-4"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>PROCESANDO SOLICITUD...</span>
                      </>
                    ) : (
                      <>
                        <span>ENVIAR SOLICITUD DE REPARACIÓN</span>
                        <Send className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <div className="py-8 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-lime-950 border border-lime-800 flex items-center justify-center text-lime-400">
                    <Check className="w-6 h-6 animate-bounce" />
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="font-display font-black text-base text-zinc-100 uppercase tracking-wide">
                      ¡Solicitud Registrada!
                    </h4>
                    <p className="font-sans text-xs text-zinc-400 max-w-sm leading-relaxed font-light">
                      Hemos recibido tu solicitud de presupuesto con éxito. Un técnico experto revisará los detalles del modelo y se comunicará contigo vía WhatsApp o correo electrónico para coordinar el diagnóstico definitivo en menos de 1 hora.
                    </p>
                  </div>
                  <button
                    onClick={() => setEnviado(false)}
                    className="px-5 py-2 rounded-full font-sans font-bold text-[11px] uppercase tracking-wider text-lime-400 bg-lime-950/20 border border-lime-900/30 hover:bg-lime-950/50 transition-colors cursor-pointer mt-4"
                  >
                    Nueva Solicitud
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
