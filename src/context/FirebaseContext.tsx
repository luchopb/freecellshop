import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  User, 
  signInWithPopup, 
  signOut 
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  serverTimestamp,
  collection
} from 'firebase/firestore';
import { auth, db, googleProvider, OperationType, handleFirestoreError, testConnection } from '../firebase';
import { Product, CartItem } from '../types';

interface UserProfile {
  userId: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  createdAt: any;
  updatedAt: any;
}

interface FirebaseContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  cart: CartItem[];
  addToCart: (product: Product) => void;
  updateQuantity: (productId: string, delta: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  submitContactMessage: (name: string, email: string, message: string) => Promise<string>;
  placeOrder: (
    shippingName: string,
    shippingEmail: string,
    shippingPhone: string,
    shippingAddress: string,
    paymentMethod: string,
    total: number
  ) => Promise<{ orderId: string; waUrl: string; waMessage: string }>;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);

  // 1. Connection check on boot
  useEffect(() => {
    testConnection();
  }, []);

  // 2. Load default guest cart from local storage on mount
  useEffect(() => {
    if (!user) {
      const local = localStorage.getItem('fcs_cart');
      if (local) {
        try {
          setCart(JSON.parse(local));
        } catch (e) {
          console.error("Failed parsing guest cart.", e);
        }
      }
    }
  }, [user]);

  // 3. Sync cart to localStorage (when guest) or to Firestore (when logged in)
  useEffect(() => {
    if (!user) {
      // Guest
      localStorage.setItem('fcs_cart', JSON.stringify(cart));
    } else {
      // Authenticated User - Sync to Firestore with debouncing or direct state changes
      const syncCartToFirestore = async () => {
        const path = `carts/${user.uid}`;
        try {
          // Minimal payload structure to match Blueprint schema
          await setDoc(doc(db, 'carts', user.uid), {
            userId: user.uid,
            items: cart.map(item => ({
              product: {
                id: item.product.id,
                name: item.product.name,
                price: item.product.price,
                image: item.product.image,
                category: item.product.category
              },
              quantity: item.quantity
            })),
            updatedAt: serverTimestamp()
          });
        } catch (error) {
          console.error("Fallo la sincronización del carrito en Firestore:", error);
          // If we encounter permissions (e.g. guest trying to write user's cart) throw through diagnostic serializer
          handleFirestoreError(error, OperationType.WRITE, path);
        }
      };

      // Simple cooldown to prevent excessive API writes
      const timeoutId = setTimeout(() => {
        syncCartToFirestore();
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [cart, user]);

  // 4. Authenticated user profile and cart state loader
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        setLoading(true);
        const userDocPath = `users/${currentUser.uid}`;
        const cartDocPath = `carts/${currentUser.uid}`;
        
        try {
          // A. Load or create profile
          const profileSnap = await getDoc(doc(db, 'users', currentUser.uid));
          let currentProfile: UserProfile;
          
          if (!profileSnap.exists()) {
            const rawProfile = {
              userId: currentUser.uid,
              email: currentUser.email || '',
              displayName: currentUser.displayName,
              photoURL: currentUser.photoURL,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp()
            };
            
            await setDoc(doc(db, 'users', currentUser.uid), rawProfile);
            currentProfile = {
              ...rawProfile,
              createdAt: new Date(),
              updatedAt: new Date()
            };
          } else {
            const data = profileSnap.data();
            currentProfile = {
              userId: data.userId,
              email: data.email,
              displayName: data.displayName || null,
              photoURL: data.photoURL || null,
              createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
              updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt
            };
          }
          setUserProfile(currentProfile);

          // B. Load stored cart or merge local guests cart
          const cartSnap = await getDoc(doc(db, 'carts', currentUser.uid));
          if (cartSnap.exists()) {
            const firestoreItems = cartSnap.data().items || [];
            
            // If visitor added items before logging in, let's merge them
            const guestCart = localStorage.getItem('fcs_cart');
            if (guestCart) {
              const parsedGuest: CartItem[] = JSON.parse(guestCart);
              if (parsedGuest.length > 0) {
                // Merge unique items prioritizing highest quantity
                const mergeMap = new Map<string, CartItem>();
                
                // Add items from Firestore cart
                firestoreItems.forEach((item: any) => {
                  mergeMap.set(item.product.id, item);
                });
                
                // Merge guest items
                parsedGuest.forEach((item) => {
                  const existingItem = mergeMap.get(item.product.id);
                  if (existingItem) {
                    mergeMap.set(item.product.id, {
                      ...existingItem,
                      quantity: Math.max(existingItem.quantity, item.quantity)
                    });
                  } else {
                    mergeMap.set(item.product.id, item);
                  }
                });

                const mergedCart = Array.from(mergeMap.values());
                setCart(mergedCart);
                
                // Erase local storage guest copy
                localStorage.removeItem('fcs_cart');
              } else {
                setCart(firestoreItems);
              }
            } else {
              setCart(firestoreItems);
            }
          } else {
            // No cart document in Firestore -> migrate current local cart
            const guestCart = localStorage.getItem('fcs_cart');
            if (guestCart) {
              const parsed = JSON.parse(guestCart);
              setCart(parsed);
              localStorage.removeItem('fcs_cart');
            }
          }
        } catch (error) {
          console.error("Error loading user profile or database records:", error);
          // Log through error diagnostic wrapper
          handleFirestoreError(error, OperationType.GET, userDocPath);
        } finally {
          setLoading(false);
        }
      } else {
        // Logged out
        setUserProfile(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // 5. Google Authentication popup Trigger
  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (e) {
      console.error("popup sign-in failed", e);
      throw e;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setCart([]); // Reset active runtime cart
      localStorage.removeItem('fcs_cart'); // Clear guest cache
    } catch (e) {
      console.error("sign out failed", e);
      throw e;
    }
  };

  // 6. Shopping Cart mutators
  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const exists = prevCart.find((item) => item.product.id === product.id);
      if (exists) {
        return prevCart.map((item) => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prevCart, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prevCart) => 
      prevCart.map((item) => {
        if (item.product.id === productId) {
          const nextQty = item.quantity + delta;
          return nextQty > 0 ? { ...item, quantity: nextQty } : item;
        }
        return item;
      })
    );
  };

  const removeItem = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  // 7. Write interactive inquiry message to Firestore
  const submitContactMessage = async (name: string, email: string, message: string): Promise<string> => {
    const timestampStr = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 7);
    const messageId = `msg-${timestampStr}-${randomStr}`;
    const path = `contactMessages/${messageId}`;
    
    try {
      const payload = {
        messageId,
        name,
        email,
        message,
        createdAt: serverTimestamp()
      };
      await setDoc(doc(db, 'contactMessages', messageId), payload);
      return messageId;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  };

  // 8. Place and persist completed purchase orders in Firestore
  const placeOrder = async (
    shippingName: string,
    shippingEmail: string,
    shippingPhone: string,
    shippingAddress: string,
    paymentMethod: string,
    total: number
  ): Promise<{ orderId: string; waUrl: string; waMessage: string }> => {
    if (!user) {
      throw new Error("Debe iniciar sesión para registrar su compra.");
    }

    const orderId = `FCS-${Math.floor(Math.random() * 90000) + 10000}`;
    const path = `orders/${orderId}`;

    const itemsText = cart.map(
      item => `• ${item.quantity}x ${item.product.name} ($${(item.product.price * item.quantity).toFixed(2)} USD)`
    ).join('\n');

    const discountAmount = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0) - total;

    const message = `¡Hola! Vengo de Free Cell Shop para finalizar mi compra.

📋 *Detalles del Pedido:*
*N° Orden:* #${orderId}
*Método de Pago:* ${paymentMethod.toUpperCase()}

👤 *Datos del Comprador:*
*Nombre:* ${shippingName}
*Email:* ${shippingEmail}
*Teléfono:* ${shippingPhone}
*Dirección de Envío:* ${shippingAddress}

🛒 *Productos:*
${itemsText}

----------------------------
*Subtotal:* $${(total + discountAmount).toFixed(2)} USD
${discountAmount > 0 ? `*Descuento aplicado:* -$${discountAmount.toFixed(2)} USD\n` : ''}*Envío Express Priority:* GRATIS
*TOTAL DEL PEDIDO:* $${total.toFixed(2)} USD

¡Quedo a la espera de la confirmación del pago y despacho! ¡Muchas gracias!`;

    const whatsappUrl = `https://wa.me/59894423423?text=${encodeURIComponent(message)}`;

    try {
      const orderPayload = {
        orderId,
        userId: user.uid,
        customerName: shippingName,
        customerEmail: shippingEmail,
        phone: shippingPhone,
        shippingAddress: shippingAddress,
        items: cart.map(item => ({
          productId: item.product.id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity
        })),
        totalAmount: total,
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      await setDoc(doc(db, 'orders', orderId), orderPayload);
      
      // Clear Cart after successful placement
      setCart([]);

      return {
        orderId,
        waUrl: whatsappUrl,
        waMessage: message
      };
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  };

  return (
    <FirebaseContext.Provider value={{
      user,
      userProfile,
      loading,
      cart,
      addToCart,
      updateQuantity,
      removeItem,
      clearCart,
      loginWithGoogle,
      logout,
      submitContactMessage,
      placeOrder
    }}>
      {children}
    </FirebaseContext.Provider>
  );
}

export function useFirebase() {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
}
