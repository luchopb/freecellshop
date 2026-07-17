export interface Product {
  id: string;
  name: string;
  category: 'smartphones' | 'accessories' | 'gadgets';
  price: number;
  originalPrice?: number;
  description: string;
  rating: number;
  image: string;
  tags: string[];
  specs: string[];
  features: string[];
  inStock: boolean;
  isNew?: boolean;
  mlLink?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Category {
  id: 'all' | 'smartphones' | 'accessories' | 'gadgets';
  name: string;
  description: string;
  icon: string;
  count: number;
  gradient: string;
  shadowColor: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  comment: string;
  avatar: string;
  rating: number;
}
