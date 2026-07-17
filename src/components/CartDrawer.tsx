import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Plus, 
  Minus, 
  Trash2, 
  ShoppingBag, 
  Tag, 
  ArrowRight, 
  CreditCard, 
  CheckCircle,
  Phone,
  QrCode,
  Wallet,
  Banknote,
  MapPin,
  ExternalLink
} from 'lucide-react';
import { CartItem } from '../types';
import { useFirebase } from '../context/FirebaseContext';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart
}: CartDrawerProps) {
  const { user, loginWithGoogle, placeOrder } = useFirebase();
  const [coupon, setCoupon] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0); // decimal percent (e.g. 0.20)
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [shippingEmail, setShippingEmail] = useState('');
  const [shippingName, setShippingName] = useState('');
  const [shippingPhone, setShippingPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'Efectivo' | 'Transferencia' | 'QR'>('Efectivo');
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [lastOrderDetails, setLastOrderDetails] = useState<{
    orderId: string;
    waUrl: string;
    waMessage: string;
  } | null>(null);

  useEffect(() => {
    if (user) {
      setShippingName(user.displayName || '');
      setShippingEmail(user.email || '');
    }
  }, [user]);

  // Calculation details
  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discountAmount = subtotal * appliedDiscount;
  const total = subtotal - discountAmount;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');
    
    if (coupon.trim().toUpperCase() === 'CYBER20') {
      setAppliedDiscount(0.20);
      setCouponSuccess('¡Cupón "CYBER20" aplicado! 20% de descuento.');
    } else {
      setCouponError('Cupón inválido. Intenta con "CYBER20"');
    }
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingName || !shippingEmail || !shippingPhone || !shippingAddress) return;
    
    setIsCheckingOut(true);
    try {
      const orderResult = await placeOrder(
        shippingName,
        shippingEmail,
        shippingPhone,
        shippingAddress,
        paymentMethod,
        total
      );
      
      setIsCheckingOut(false);
      setLastOrderDetails(orderResult);
      setOrderCompleted(true);
      
      // Attempt to open the WhatsApp chat immediately in a new tab
      window.open(orderResult.waUrl, '_blank');
    } catch (error) {
      console.error("Fallo la creación del pedido en Firestore:", error);
      setIsCheckingOut(false);
    }
  };

  const handleResetCheckoutAndClose = () => {
    setOrderCompleted(false);
    setShippingEmail('');
    setShippingName('');
    setShippingPhone('');
    setShippingAddress('');
    setPaymentMethod('Efectivo');
    setLastOrderDetails(null);
    setCoupon('');
    setAppliedDiscount(0);
    onClearCart();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Dark transparent Backdrop overlay */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Cart Sidebar Panel */}
          <motion.div
            key="cart-panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            id="shopping-cart-drawer"
            className="fixed top-0 right-0 h-full w-full max-w-md z-50 bg-white dark:bg-zinc-950 border-l border-slate-150 dark:border-zinc-900 shadow-2xl flex flex-col justify-between overflow-hidden text-slate-900 dark:text-zinc-105"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-100 dark:border-zinc-900 flex items-center justify-between bg-slate-50 dark:bg-zinc-900/50">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-blue-600 dark:text-lime-500" />
                <span className="font-display font-black text-lg text-slate-900 dark:text-white">Tu Carrito</span>
                <span className="font-sans font-extrabold text-xs text-blue-600 dark:text-lime-400 bg-blue-50 dark:bg-lime-950/30 border border-blue-100 dark:border-lime-900/40 px-3 py-0.5 rounded-full">
                  {cartItems.length}
                </span>
              </div>
              <button
                id="close-cart-drawer"
                onClick={onClose}
                className="p-1.5 rounded-full border border-slate-200 dark:border-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-900 text-slate-500 dark:text-zinc-400 hover:text-slate-850 dark:hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Switcher */}
            <div className="flex-1 overflow-y-auto p-6 scrollbar">
              {orderCompleted ? (
                /* Order SUCCESS display animation */
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center space-y-5 py-6"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-lime-950/20 border border-emerald-100 dark:border-lime-900/30 flex items-center justify-center text-emerald-600 dark:text-lime-400 animate-bounce">
                    <CheckCircle className="w-10 h-10" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-display font-black text-2xl text-slate-900 dark:text-white tracking-tighter">¡Pedido Registrado!</h3>
                    <p className="font-sans text-xs text-slate-500 dark:text-zinc-400 font-light max-w-sm leading-relaxed px-2">
                      Hola <span className="text-slate-800 dark:text-zinc-200 font-bold">{shippingName}</span>. Para concretar tu compra debés enviar el detalle del pedido a nuestro WhatsApp oficial de soporte.
                    </p>
                  </div>

                  {/* Primary WhatsApp Action Button */}
                  {lastOrderDetails && (
                    <div className="w-full px-2">
                      <a
                        href={lastOrderDetails.waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-4 bg-emerald-600 dark:bg-lime-500 hover:bg-emerald-700 dark:hover:bg-lime-600 text-white dark:text-black rounded-full font-sans font-black text-xs uppercase flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 dark:shadow-lime-500/10 transition-transform hover:scale-[1.02] cursor-pointer"
                      >
                        <Phone className="w-4 h-4 fill-white text-white dark:fill-black dark:text-black" />
                        <span>Confirmar en WhatsApp (+598 94 423 423)</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <p className="text-[10px] text-slate-400 dark:text-zinc-550 mt-2">
                        *Si la ventana no se abrió de forma automática, hacé click en el botón de arriba para abrir el chat de WhatsApp.
                      </p>
                    </div>
                  )}

                  <div className="p-4 rounded-2xl border border-slate-100 dark:border-zinc-900 w-full bg-slate-50 dark:bg-zinc-900/30 space-y-2.5 font-sans text-xs text-slate-600 dark:text-zinc-400 text-left shadow-sm">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-200/50 dark:border-zinc-800">
                      <span className="font-bold text-slate-400 dark:text-zinc-500 text-[10px] uppercase">N° ORDEN:</span>
                      <span className="text-slate-800 dark:text-white font-black font-mono bg-white dark:bg-zinc-900 px-2 py-0.5 rounded border border-slate-150 dark:border-zinc-800">
                        {lastOrderDetails?.orderId || '#FCS-00000'}
                      </span>
                    </div>

                    <div>
                      <span className="font-bold text-slate-400 dark:text-zinc-500 text-[10px] uppercase block mb-0.5">Método de pago:</span>
                      <span className="text-blue-600 dark:text-lime-500 font-black text-xs uppercase flex items-center gap-1.5">
                        {paymentMethod === 'Efectivo' && <Banknote className="w-4 h-4 text-blue-600 dark:text-lime-500" />}
                        {paymentMethod === 'Transferencia' && <Wallet className="w-4 h-4 text-blue-600 dark:text-lime-500" />}
                        {paymentMethod === 'QR' && <QrCode className="w-4 h-4 text-blue-600 dark:text-lime-500" />}
                        {paymentMethod}
                      </span>
                    </div>

                    {/* Specific instruction block based on payment method */}
                    <div className="bg-white dark:bg-zinc-950 p-3 rounded-xl border border-slate-200/60 dark:border-zinc-900 text-[11px] leading-relaxed text-slate-600 dark:text-zinc-400 space-y-1">
                      {paymentMethod === 'Efectivo' && (
                        <>
                          <p className="font-bold text-slate-800 dark:text-zinc-200">💵 Pago Contra Entrega:</p>
                          <p>Abonás tu pedido en efectivo o tarjeta de débito/crédito al recibir los productos en tu domicilio de forma 100% segura.</p>
                        </>
                      )}
                      {paymentMethod === 'Transferencia' && (
                        <>
                          <p className="font-bold text-slate-800 dark:text-zinc-200">🏦 Transferencia Bancaria:</p>
                          <p>Te enviaremos los datos de transferencia por WhatsApp. Adjuntanos tu comprobante de pago allí para el despacho Priority.</p>
                        </>
                      )}
                      {paymentMethod === 'QR' && (
                        <div className="space-y-2 flex flex-col items-center text-center">
                          <p className="font-bold text-slate-800 dark:text-zinc-200 w-full text-left">📱 Pago por Código QR:</p>
                          <p className="w-full text-left">Escaneá el código QR oficial de nuestra tienda para realizar el pago, o aguardá el QR dinámico en WhatsApp.</p>
                          {/* Beautiful QR placeholder code */}
                          <div className="w-32 h-32 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-2 flex flex-col items-center justify-center relative shadow-sm">
                            <QrCode className="w-24 h-24 text-slate-800 dark:text-zinc-300" />
                            <div className="absolute inset-0 m-auto w-6 h-6 bg-blue-600 dark:bg-lime-500 rounded-lg flex items-center justify-center text-[8px] font-black text-white dark:text-black shadow-sm">
                              FCS
                            </div>
                          </div>
                          <span className="text-[9px] text-slate-400 dark:text-zinc-500 font-semibold uppercase">QR Oficial Free Cell Shop</span>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between pt-1 border-t border-slate-200/50 dark:border-zinc-855 items-center">
                      <span className="font-bold text-slate-400 dark:text-zinc-500 text-[10px] uppercase">Monto Total:</span>
                      <span className="text-blue-600 dark:text-lime-500 font-black text-sm">${total.toFixed(2)} USD</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleResetCheckoutAndClose}
                    className="w-full py-3.5 rounded-full font-sans font-extrabold text-xs tracking-tight bg-slate-950 dark:bg-lime-500 hover:bg-slate-800 dark:hover:bg-lime-600 text-white dark:text-black transition-all cursor-pointer shadow-md"
                  >
                    VOLVER A LA TIENDA
                  </button>
                </motion.div>
              ) : cartItems.length === 0 ? (
                /* Empty Cart screen */
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-20">
                  <div className="w-16 h-16 rounded-3xl bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-850 flex items-center justify-center text-slate-400 dark:text-zinc-500">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-display font-black text-slate-800 dark:text-zinc-200 text-lg tracking-tight">Tu carrito está vacío</p>
                    <p className="font-sans text-xs text-slate-500 dark:text-zinc-400 font-light max-w-[240px]">
                      Sumá equipos móviles o accesorios premium de nuestra gama seleccionada para empezar.
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="px-6 py-3 rounded-full font-sans text-xs font-bold border border-slate-200 dark:border-zinc-805 bg-slate-50 dark:bg-zinc-900 text-slate-700 dark:text-zinc-350 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                  >
                    VER PRODUCTOS
                  </button>
                </div>
              ) : (
                /* Standard Cart layout listing items */
                <div className="space-y-6">
                  {/* Cart Items List */}
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <motion.div
                        key={item.product.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="flex gap-4 p-3.5 rounded-2xl border border-slate-100 dark:border-zinc-900 bg-slate-50/50 dark:bg-zinc-900/30 hover:bg-slate-50 dark:hover:bg-zinc-900 hover:border-slate-200 dark:hover:border-zinc-800 transition-all duration-250"
                      >
                        {/* Thumbnail */}
                        <div className="w-16 h-16 rounded-xl overflow-hidden border border-slate-200 dark:border-zinc-800 shrink-0 bg-white dark:bg-zinc-900 p-1">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-full h-full object-contain rounded-lg"
                            referrerPolicy="no-referrer"
                          />
                        </div>

                        {/* Details */}
                        <div className="flex-1 flex flex-col justify-between min-w-0">
                          <div className="flex justify-between items-start gap-2">
                            <span className="font-sans font-extrabold text-sm text-slate-800 dark:text-zinc-200 truncate">
                              {item.product.name}
                            </span>
                            <button
                              onClick={() => onRemoveItem(item.product.id)}
                              className="text-slate-400 hover:text-rose-500 transition-colors p-0.5 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="flex items-center justify-between mt-1">
                            {/* Quantity controller togglers */}
                            <div className="flex items-center gap-2 border border-slate-150 dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-full p-0.5 shadow-sm">
                              <button
                                onClick={() => onUpdateQuantity(item.product.id, -1)}
                                className="w-6 h-6 rounded-full flex items-center justify-center text-slate-400 dark:text-zinc-500 hover:bg-slate-50 dark:hover:bg-zinc-905 hover:text-slate-705 dark:hover:text-zinc-300 transition-all cursor-pointer"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="font-sans text-xs font-bold px-0.5 text-slate-800 dark:text-zinc-200">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => onUpdateQuantity(item.product.id, 1)}
                                className="w-6 h-6 rounded-full flex items-center justify-center text-slate-400 dark:text-zinc-500 hover:bg-slate-50 dark:hover:bg-zinc-905 hover:text-slate-705 dark:hover:text-zinc-300 transition-all cursor-pointer"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            {/* Total price item line */}
                            <span className="font-sans text-sm font-extrabold text-blue-600 dark:text-lime-500">
                              ${(item.product.price * item.quantity).toFixed(2)} USD
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Coupon promotion application */}
                  <div className="pt-4 border-t border-slate-100 dark:border-zinc-900">
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 dark:text-zinc-500" />
                        <input
                          type="text"
                          value={coupon}
                          onChange={(e) => setCoupon(e.target.value)}
                          placeholder="Código de descuento"
                          disabled={appliedDiscount > 0}
                          className="w-full bg-slate-50 dark:bg-zinc-900 border border-slate-150 dark:border-zinc-800 rounded-full pl-9 pr-3 py-3 font-semibold text-xs text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-zinc-550 focus:outline-none focus:border-blue-600 dark:focus:border-lime-500 focus:ring-1 focus:ring-blue-600 dark:focus:ring-lime-500 transition-colors"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={!coupon.trim() || appliedDiscount > 0}
                        className="px-5 py-3 rounded-full bg-slate-950 dark:bg-lime-500 hover:bg-slate-800 dark:hover:bg-lime-600 text-xs font-extrabold text-white dark:text-black disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors shrink-0 shadow-sm"
                      >
                        Aplicar
                      </button>
                    </form>
                    {couponError && <p className="font-sans text-[11px] font-bold text-rose-500 mt-1.5">{couponError}</p>}
                    {couponSuccess && <p className="font-sans text-[11px] font-bold text-emerald-650 mt-1.5">{couponSuccess}</p>}
                    {!appliedDiscount && (
                      <p className="font-sans text-[10px] text-slate-400 dark:text-zinc-500 mt-1.5">
                        *Tip: Usa el cupón <span className="text-blue-600 dark:text-lime-500 font-bold">CYBER20</span> para un 20% OFF.
                      </p>
                    )}
                  </div>

                  {/* Simulated payment detail form */}
                  <div className="pt-6 border-t border-slate-100 dark:border-zinc-900 space-y-4">
                    <div className="flex items-center gap-1.5 text-slate-800 dark:text-zinc-100 font-bold">
                      <CreditCard className="w-4 h-4 text-blue-600 dark:text-lime-500" />
                      <span className="font-sans font-extrabold text-xs tracking-wide uppercase">Información de Envío</span>
                    </div>

                    <form onSubmit={handleCheckoutSubmit} className="space-y-3">
                      <div>
                        <input
                          type="text"
                          required
                          value={shippingName}
                          onChange={(e) => setShippingName(e.target.value)}
                          placeholder="Nombre y Apellido completo"
                          className="w-full bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-full px-4 py-3 font-semibold text-xs text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-zinc-550 focus:outline-none focus:border-blue-600 dark:focus:border-lime-500 focus:ring-1 focus:ring-blue-600 dark:focus:ring-lime-500 transition-colors"
                        />
                      </div>
                      <div>
                        <input
                          type="email"
                          required
                          value={shippingEmail}
                          onChange={(e) => setShippingEmail(e.target.value)}
                          placeholder="Email para seguimiento de orden"
                          className="w-full bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-full px-4 py-3 font-semibold text-xs text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-zinc-550 focus:outline-none focus:border-blue-600 dark:focus:border-lime-500 focus:ring-1 focus:ring-blue-600 dark:focus:ring-lime-500 transition-colors"
                        />
                      </div>
                      <div>
                        <input
                          type="tel"
                          required
                          value={shippingPhone}
                          onChange={(e) => setShippingPhone(e.target.value)}
                          placeholder="Teléfono móvil / WhatsApp (Ej: 094423423)"
                          className="w-full bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-full px-4 py-3 font-semibold text-xs text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-zinc-550 focus:outline-none focus:border-blue-600 dark:focus:border-lime-500 focus:ring-1 focus:ring-blue-600 dark:focus:ring-lime-500 transition-colors"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          required
                          value={shippingAddress}
                          onChange={(e) => setShippingAddress(e.target.value)}
                          placeholder="Dirección completa de entrega"
                          className="w-full bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-full px-4 py-3 font-semibold text-xs text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-zinc-550 focus:outline-none focus:border-blue-600 dark:focus:border-lime-500 focus:ring-1 focus:ring-blue-600 dark:focus:ring-lime-500 transition-colors"
                        />
                      </div>

                      {/* Payment Method Selector Grid */}
                      <div className="pt-2 space-y-2">
                        <label className="block text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
                          Forma de Pago Seleccionada:
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          <button
                            type="button"
                            onClick={() => setPaymentMethod('Efectivo')}
                            className={`py-3.5 px-1 rounded-2xl border text-center flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                              paymentMethod === 'Efectivo'
                                ? 'border-blue-600 dark:border-lime-500 bg-blue-50/50 dark:bg-lime-950/20 text-blue-700 dark:text-lime-400 font-extrabold shadow-sm ring-1 ring-blue-500/10 dark:ring-lime-500/10'
                                : 'border-slate-100 dark:border-zinc-850 bg-slate-50 dark:bg-zinc-900 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-500 dark:text-zinc-400'
                            }`}
                          >
                            <Banknote className="w-5 h-5" />
                            <span className="text-[10px] leading-none">Efectivo</span>
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => setPaymentMethod('Transferencia')}
                            className={`py-3.5 px-1 rounded-2xl border text-center flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                              paymentMethod === 'Transferencia'
                                ? 'border-blue-600 dark:border-lime-500 bg-blue-50/50 dark:bg-lime-950/20 text-blue-700 dark:text-lime-400 font-extrabold shadow-sm ring-1 ring-blue-500/10 dark:ring-lime-500/10'
                                : 'border-slate-100 dark:border-zinc-850 bg-slate-50 dark:bg-zinc-900 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-500 dark:text-zinc-400'
                            }`}
                          >
                            <Wallet className="w-5 h-5" />
                            <span className="text-[10px] leading-none">Transferencia</span>
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => setPaymentMethod('QR')}
                            className={`py-3.5 px-1 rounded-2xl border text-center flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                              paymentMethod === 'QR'
                                ? 'border-blue-600 dark:border-lime-500 bg-blue-50/50 dark:bg-lime-950/20 text-blue-700 dark:text-lime-400 font-extrabold shadow-sm ring-1 ring-blue-500/10 dark:ring-lime-500/10'
                                : 'border-slate-100 dark:border-zinc-850 bg-slate-50 dark:bg-zinc-900 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-500 dark:text-zinc-400'
                            }`}
                          >
                            <QrCode className="w-5 h-5" />
                            <span className="text-[10px] leading-none">QR Pago</span>
                          </button>
                        </div>
                      </div>

                      <p className="font-sans text-[10px] text-slate-450 leading-relaxed pt-1">
                        {paymentMethod === 'Efectivo' && '*Abonás en efectivo o tarjeta al recibir en tu domicilio. Envío Priority Express gratis incluido.'}
                        {paymentMethod === 'Transferencia' && '*Te enviaremos los datos de nuestra cuenta bancaria en el chat de WhatsApp. Envío Priority gratis al recibir comprobante.'}
                        {paymentMethod === 'QR' && '*Abonás escaneando el código QR oficial de la tienda. Confirmación de acreditación ultra rápida via WhatsApp.'}
                      </p>

                      {/* Hidden trigger for submitting */}
                      <button type="submit" className="hidden" id="simulate-checkout-form-submit" />
                    </form>
                  </div>
                </div>
              )}
            </div>

            {/* Calculations and Action Footer Bar */}
            {!orderCompleted && cartItems.length > 0 && (
              <div className="p-6 border-t border-slate-100 dark:border-zinc-900 bg-slate-50 dark:bg-zinc-900/50 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between font-sans text-xs text-slate-500 dark:text-zinc-400">
                    <span>Subtotal:</span>
                    <span className="text-slate-800 dark:text-zinc-200 font-bold">${subtotal.toFixed(2)} USD</span>
                  </div>
                  {appliedDiscount > 0 && (
                    <div className="flex justify-between font-sans text-xs text-emerald-600 dark:text-lime-400 font-bold">
                      <span>Descuento (20%):</span>
                      <span>-${discountAmount.toFixed(2)} USD</span>
                    </div>
                  )}
                  <div className="flex justify-between font-sans text-xs text-slate-500 dark:text-zinc-400">
                    <span>Envío Priority Express:</span>
                    <span className="text-emerald-600 dark:text-lime-400 font-bold uppercase">GRATIS</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-slate-200/50 dark:border-zinc-800">
                    <span className="font-display font-black text-xs text-slate-800 dark:text-zinc-350">TOTAL ESTIMADO:</span>
                    <span className="font-sans font-black text-xl text-blue-600 dark:text-lime-500">
                      ${total.toFixed(2)} <span className="font-sans text-[10px] font-normal text-slate-500 dark:text-zinc-550">USD</span>
                    </span>
                  </div>
                </div>

                <button
                  id="cart-submit-checkout-button"
                  onClick={() => {
                    document.getElementById('simulate-checkout-form-submit')?.click();
                  }}
                  disabled={isCheckingOut || !shippingName || !shippingEmail || !shippingPhone || !shippingAddress}
                  className="w-full py-4 rounded-full font-sans font-extrabold text-sm tracking-tight text-white dark:text-black bg-slate-950 dark:bg-lime-500 hover:bg-slate-800 dark:hover:bg-lime-600 uppercase flex items-center justify-center gap-2 transition-transform disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-md shadow-slate-100 dark:shadow-lime-500/10"
                >
                  {isCheckingOut ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>PROCESAR COMPRA RAPIDA</span>
                      <ArrowRight className="w-4 h-4 text-white dark:text-black" />
                    </>
                  )}
                </button>
              </div>
            )}
            
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
