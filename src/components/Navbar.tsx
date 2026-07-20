import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Cpu, LogOut, User, Sun, Moon } from 'lucide-react';
import { useFirebase } from '../context/FirebaseContext';
import Logo from './Logo';

interface NavbarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

export default function Navbar({ activeSection, onNavigate }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, loginWithGoogle, logout, loading } = useFirebase();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 35);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Inicio', id: 'home' },
    { name: 'Catálogo', id: 'productos' },
    { name: 'Servicio Técnico', id: 'servicio-tecnico' },
    { name: 'Características', id: 'features' },
    { name: 'Opiniones', id: 'opiniones' },
    { name: 'Contacto', id: 'contact' },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        id="main-navbar"
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
          isScrolled 
            ? 'py-3 bg-white/90 dark:bg-black/90 backdrop-blur-md border-b border-slate-100 dark:border-zinc-900 shadow-[0_4px_24px_rgba(0,0,0,0.03)]' 
            : 'py-6 bg-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div 
              id="navbar-logo"
              className="flex items-center cursor-pointer group"
              onClick={() => onNavigate('home')}
            >
              <Logo height="32" className="text-slate-900 dark:text-white hover:scale-[1.02] transition-all duration-300" />
            </div>

            {/* Desktop Nav Links */}
            <nav id="desktop-navigation" className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  id={`nav-link-${link.id}`}
                  onClick={() => onNavigate(link.id)}
                  className={`relative px-4 py-2 font-display text-sm tracking-wide font-bold transition-all hover:text-slate-900 dark:hover:text-white cursor-pointer ${
                    activeSection === link.id 
                      ? 'text-blue-600 dark:text-lime-500' 
                      : 'text-slate-500 dark:text-zinc-400'
                  }`}
                >
                  {link.name}
                  {activeSection === link.id && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-4 right-4 h-[2.5px] bg-blue-600 dark:bg-lime-500 rounded-full shadow-[0_1px_5px_rgba(37,99,235,0.4)] dark:shadow-[0_1px_5px_rgba(132,204,22,0.4)]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </nav>

            {/* Right Group Actions */}
            <div id="navbar-actions-group" className="flex items-center gap-4">
              {/* Mobile Menu Toggle */}
              <button
                id="mobile-menu-toggle"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 md:hidden rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-700 dark:text-zinc-350 hover:text-slate-900 dark:hover:text-white transition-all duration-200 cursor-pointer shadow-sm"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="mobile-menu-panel"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-[65px] left-0 w-full z-30 bg-white dark:bg-zinc-950 backdrop-blur-lg border-b border-slate-200 dark:border-zinc-900 md:hidden shadow-lg shadow-slate-100 dark:shadow-black/50"
          >
            <div className="px-4 py-6 space-y-3">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  id={`mobile-nav-link-${link.id}`}
                  onClick={() => {
                    onNavigate(link.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-5 py-3 font-display rounded-full tracking-tight text-sm font-bold ${
                    activeSection === link.id
                      ? 'bg-slate-50 dark:bg-zinc-900 text-blue-600 dark:text-lime-500 border-l-4 border-blue-600 dark:border-lime-500'
                      : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-900 hover:text-slate-900 dark:hover:text-white'
                  } transition-all`}
                >
                  {link.name}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
