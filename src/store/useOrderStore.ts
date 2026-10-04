import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from './useCartStore';

export type OrderStatusType = 'Pending' | 'Processing' | 'Confirmed' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Cancelled';

export interface OrderStep {
  label: string;
  date: string;
  done: boolean;
}

export interface OrderCustomer {
  name: string;
  email: string;
  phone?: string;
  address: string;
  city?: string;
  postalCode?: string;
}

export interface Order {
  id: string;
  customer: OrderCustomer;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: OrderStatusType;
  statusColor: string;
  placedAt: string;
  estimatedDelivery: string;
  shippingAddress: string;
  trackingNumber?: string;
  paymentMethod: string;
  steps: OrderStep[];
}

interface OrderStore {
  orders: Order[];
  placeOrder: (
    items: CartItem[],
    subtotal: number,
    shipping: number,
    tax: number,
    total: number,
    address: string,
    customer?: Partial<OrderCustomer>,
    paymentMethod?: string
  ) => Order;
  updateOrderStatus: (id: string, status: OrderStatusType, trackingNumber?: string) => void;
  getOrderById: (id: string) => Order | null;
  getAllOrders: () => Order[];
  resetOrders: () => void;
}

function generateOrderId(): string {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `ORD-${num}`;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function getStatusColor(status: OrderStatusType): string {
  switch (status) {
    case 'Delivered':
      return 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20';
    case 'Shipped':
    case 'Out for Delivery':
      return 'text-blue-600 bg-blue-500/10 border-blue-500/20';
    case 'Processing':
    case 'Confirmed':
      return 'text-amber-600 bg-amber-500/10 border-amber-500/20';
    case 'Cancelled':
      return 'text-rose-600 bg-rose-500/10 border-rose-500/20';
    default:
      return 'text-slate-600 bg-slate-500/10 border-slate-500/20';
  }
}

const SEED_ORDERS: Order[] = [
  {
    id: 'ORD-7294',
    customer: {
      name: 'Eleanor Vance',
      email: 'eleanor.vance@example.com',
      phone: '+1 (555) 234-5678',
      address: '742 Evergreen Terrace, Springfield, OR 97477',
      city: 'Springfield',
      postalCode: '97477',
    },
    items: [
      {
        id: '1',
        name: 'Minimalist Leather Backpack',
        price: 129.99,
        image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80',
        variant: 'Tan',
        quantity: 1,
      },
      {
        id: '5',
        name: 'Classic Aviator Sunglasses',
        price: 89.0,
        image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&q=80',
        variant: 'Gold/Green',
        quantity: 1,
      },
    ],
    subtotal: 218.99,
    shipping: 0,
    tax: 17.52,
    total: 236.51,
    status: 'Processing',
    statusColor: getStatusColor('Processing'),
    placedAt: 'Mar 8, 2026',
    estimatedDelivery: 'Mar 14, 2026',
    shippingAddress: '742 Evergreen Terrace, Springfield, OR 97477',
    trackingNumber: 'OWI-TRK-984210',
    paymentMethod: 'Credit Card (•••• 4242)',
    steps: [
      { label: 'Order Placed', date: 'Mar 8, 2026', done: true },
      { label: 'Processing', date: 'Mar 9, 2026', done: true },
      { label: 'Shipped', date: 'Mar 11, 2026', done: false },
      { label: 'Out for Delivery', date: 'Mar 13, 2026', done: false },
      { label: 'Delivered', date: 'Mar 14, 2026', done: false },
    ],
  },
  {
    id: 'ORD-5182',
    customer: {
      name: 'Marcus Sterling',
      email: 'marcus.s@example.com',
      phone: '+1 (555) 876-5432',
      address: '100 Broadway, New York, NY 10005',
      city: 'New York',
      postalCode: '10005',
    },
    items: [
      {
        id: '2',
        name: 'Wireless Noise-Cancelling Headphones',
        price: 299.0,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
        variant: 'Midnight Black',
        quantity: 1,
      },
    ],
    subtotal: 299.0,
    shipping: 0,
    tax: 23.92,
    total: 322.92,
    status: 'Shipped',
    statusColor: getStatusColor('Shipped'),
    placedAt: 'Mar 6, 2026',
    estimatedDelivery: 'Mar 11, 2026',
    shippingAddress: '100 Broadway, New York, NY 10005',
    trackingNumber: 'OWI-TRK-441920',
    paymentMethod: 'Apple Pay',
    steps: [
      { label: 'Order Placed', date: 'Mar 6, 2026', done: true },
      { label: 'Processing', date: 'Mar 7, 2026', done: true },
      { label: 'Shipped', date: 'Mar 8, 2026', done: true },
      { label: 'Out for Delivery', date: 'Mar 10, 2026', done: false },
      { label: 'Delivered', date: 'Mar 11, 2026', done: false },
    ],
  },
  {
    id: 'ORD-3891',
    customer: {
      name: 'Sophia Chen',
      email: 'sophia.c@example.com',
      phone: '+1 (555) 432-1098',
      address: '450 Sutter St, San Francisco, CA 94108',
      city: 'San Francisco',
      postalCode: '94108',
    },
    items: [
      {
        id: '13',
        name: 'Hydrating Hyaluronic Acid Serum',
        price: 42.0,
        image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80',
        variant: '30ml Bottle',
        quantity: 2,
      },
      {
        id: '3',
        name: 'Organic Cotton T-Shirt',
        price: 34.5,
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80',
        variant: 'White',
        quantity: 1,
      },
    ],
    subtotal: 118.5,
    shipping: 0,
    tax: 9.48,
    total: 127.98,
    status: 'Delivered',
    statusColor: getStatusColor('Delivered'),
    placedAt: 'Mar 2, 2026',
    estimatedDelivery: 'Mar 7, 2026',
    shippingAddress: '450 Sutter St, San Francisco, CA 94108',
    trackingNumber: 'OWI-TRK-109384',
    paymentMethod: 'Credit Card (•••• 8821)',
    steps: [
      { label: 'Order Placed', date: 'Mar 2, 2026', done: true },
      { label: 'Processing', date: 'Mar 3, 2026', done: true },
      { label: 'Shipped', date: 'Mar 4, 2026', done: true },
      { label: 'Out for Delivery', date: 'Mar 6, 2026', done: true },
      { label: 'Delivered', date: 'Mar 7, 2026', done: true },
    ],
  },
];

export const useOrderStore = create<OrderStore>()(
  persist(
    (set, get) => ({
      orders: SEED_ORDERS,

      placeOrder: (items, subtotal, shipping, tax, total, address, customer, paymentMethod = 'Credit Card') => {
        const now = new Date();
        const estimatedDate = addDays(now, 5);
        const orderId = generateOrderId();
        const tracking = `OWI-TRK-${Math.floor(100000 + Math.random() * 900000)}`;

        const orderCustomer: OrderCustomer = {
          name: customer?.name || 'Valued Customer',
          email: customer?.email || 'customer@example.com',
          phone: customer?.phone || '+1 (555) 000-0000',
          address: address || '123 Commerce Way, Tech City, 10010',
          city: customer?.city || 'Tech City',
          postalCode: customer?.postalCode || '10010',
        };

        const order: Order = {
          id: orderId,
          customer: orderCustomer,
          items,
          subtotal,
          shipping,
          tax,
          total,
          status: 'Processing',
          statusColor: getStatusColor('Processing'),
          placedAt: formatDate(now),
          estimatedDelivery: formatDate(estimatedDate),
          shippingAddress: address,
          trackingNumber: tracking,
          paymentMethod,
          steps: [
            { label: 'Order Placed', date: formatDate(now), done: true },
            { label: 'Processing', date: formatDate(addDays(now, 1)), done: true },
            { label: 'Shipped', date: formatDate(addDays(now, 2)), done: false },
            { label: 'Out for Delivery', date: formatDate(addDays(now, 4)), done: false },
            { label: 'Delivered', date: formatDate(estimatedDate), done: false },
          ],
        };

        set((state) => ({ orders: [order, ...state.orders] }));
        return order;
      },

      updateOrderStatus: (id, status, trackingNumber) => {
        set((state) => ({
          orders: state.orders.map((o) => {
            if (o.id.toLowerCase() !== id.toLowerCase()) return o;

            const isDelivered = status === 'Delivered';
            const isShipped = status === 'Shipped' || status === 'Out for Delivery' || isDelivered;
            const isProcessing = status !== 'Pending';

            const updatedSteps = o.steps.map((step) => {
              if (step.label === 'Order Placed') return { ...step, done: true };
              if (step.label === 'Processing') return { ...step, done: isProcessing };
              if (step.label === 'Shipped') return { ...step, done: isShipped };
              if (step.label === 'Out for Delivery') return { ...step, done: status === 'Out for Delivery' || isDelivered };
              if (step.label === 'Delivered') return { ...step, done: isDelivered };
              return step;
            });

            return {
              ...o,
              status,
              statusColor: getStatusColor(status),
              trackingNumber: trackingNumber || o.trackingNumber,
              steps: updatedSteps,
            };
          }),
        }));
      },

      getOrderById: (id) => get().orders.find((o) => o.id.toLowerCase() === id.toLowerCase()) ?? null,
      getAllOrders: () => get().orders,
      resetOrders: () => set({ orders: SEED_ORDERS }),
    }),
    {
      name: `kavithas-orders-v2`,
    }
  )
);
