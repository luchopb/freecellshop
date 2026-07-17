import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Wrench, 
  Handshake, 
  MessageSquareMore, 
  ChevronRight
} from 'lucide-react';
import TechnicalServiceModal from './TechnicalServiceModal';
import GoogleReviewsModal from './GoogleReviewsModal';

interface BannerButtonsProps {
  onNavigate: (sectionId: string) => void;
}

export default function BannerButtons({ onNavigate }: BannerButtonsProps) {
  const [isServiceOpen, setIsServiceOpen] = useState(false);
  const [isReviewsOpen, setIsReviewsOpen] = useState(false);

  return (
    <div className="w-full bg-[#050507] border-y border-zinc-900 z-20 relative">
      
      {/* Edge-to-edge grid container. No rounded corners, no padding, 100% screen width */}
      <div className="grid grid-cols-2 md:grid-cols-5 bg-black divide-y divide-zinc-900 md:divide-y-0 md:divide-x divide-zinc-900/90">
        
        {/* Button 1: PRODUCTOS */}
        <button 
          onClick={() => onNavigate('products')}
          className="flex flex-col items-center justify-center py-7 px-4 md:py-10 bg-black hover:bg-[#070709] active:bg-[#030304] transition-all duration-300 group cursor-pointer text-center select-none"
        >
          <div className="mb-4 transform group-hover:scale-105 transition-transform duration-300">
            <ShoppingCart className="w-10 h-10 text-[#9EFF00] stroke-[1.25]" />
          </div>
          <div className="flex items-center gap-1 justify-center">
            <span className="font-sans font-extrabold text-[11px] md:text-xs text-white uppercase tracking-wider">
              Productos
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-[#9EFF00] shrink-0 transform group-hover:translate-x-0.5 transition-transform" />
          </div>
        </button>

        {/* Button 2: SERVICIO TÉCNICO */}
        <button 
          onClick={() => onNavigate('servicio-tecnico')}
          className="flex flex-col items-center justify-center py-7 px-4 md:py-10 bg-black hover:bg-[#070709] active:bg-[#030304] transition-all duration-300 group cursor-pointer text-center select-none"
        >
          <div className="mb-4 transform group-hover:scale-105 transition-transform duration-300">
            <Wrench className="w-10 h-10 text-[#9EFF00] stroke-[1.25]" />
          </div>
          <div className="flex items-center gap-1 justify-center">
            <span className="font-sans font-extrabold text-[11px] md:text-xs text-white uppercase tracking-wider">
              Servicio Técnico
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-[#9EFF00] shrink-0 transform group-hover:translate-x-0.5 transition-transform" />
          </div>
        </button>

        {/* Button 3: MERCADO LIBRE */}
        <a 
          href="https://listado.mercadolibre.com.uy/_CustId_438656875" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center py-7 px-4 md:py-10 bg-black hover:bg-[#070709] active:bg-[#030304] transition-all duration-300 group cursor-pointer text-center select-none"
        >
          <div className="mb-4 transform group-hover:scale-105 transition-transform duration-300">
            {/* Custom styled handshake icon replicating the screenshot */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-lime-400 to-lime-600/90 flex items-center justify-center text-black shadow-inner">
              <Handshake className="w-5 h-5 stroke-[2] text-zinc-950" />
            </div>
          </div>
          <div className="flex items-center gap-1 justify-center">
            <span className="font-sans font-extrabold text-[11px] md:text-xs text-white uppercase tracking-wider">
              Mercado Libre
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-[#9EFF00] shrink-0 transform group-hover:translate-x-0.5 transition-transform" />
          </div>
        </a>

        {/* Button 4: CONTACTO */}
        <button 
          onClick={() => onNavigate('contact')}
          className="flex flex-col items-center justify-center py-7 px-4 md:py-10 bg-black hover:bg-[#070709] active:bg-[#030304] transition-all duration-300 group cursor-pointer text-center select-none"
        >
          <div className="mb-4 transform group-hover:scale-105 transition-transform duration-300">
            <MessageSquareMore className="w-10 h-10 text-[#9EFF00] stroke-[1.25]" />
          </div>
          <div className="flex items-center gap-1 justify-center">
            <span className="font-sans font-extrabold text-[11px] md:text-xs text-white uppercase tracking-wider">
              Contacto
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-[#9EFF00] shrink-0 transform group-hover:translate-x-0.5 transition-transform" />
          </div>
        </button>

        {/* Button 5: OPINIONES DE GOOGLE */}
        <button 
          onClick={() => setIsReviewsOpen(true)}
          className="col-span-2 md:col-span-1 flex flex-col items-center justify-center py-7 px-4 md:py-10 bg-black hover:bg-[#070709] active:bg-[#030304] transition-all duration-300 group cursor-pointer text-center select-none"
        >
          {/* Custom Google logo exactly matching the style of the screenshot */}
          <div className="mb-4 transform group-hover:scale-105 transition-transform duration-300">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-lg select-none">
              {/* Perfect SVG Google G Icon */}
              <svg viewBox="0 0 24 24" className="w-5.5 h-5.5">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            </div>
          </div>
          <div className="flex items-center gap-1 justify-center">
            <span className="font-sans font-extrabold text-[11px] md:text-xs text-white uppercase tracking-wider">
              Opiniones de Google
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-[#9EFF00] shrink-0 transform group-hover:translate-x-0.5 transition-transform" />
          </div>
        </button>

      </div>

      {/* Modals popup containers */}
      <TechnicalServiceModal 
        isOpen={isServiceOpen} 
        onClose={() => setIsServiceOpen(false)} 
      />
      <GoogleReviewsModal 
        isOpen={isReviewsOpen} 
        onClose={() => setIsReviewsOpen(false)} 
      />

    </div>
  );
}
