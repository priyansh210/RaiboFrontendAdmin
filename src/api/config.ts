/**
 * API configuration settings for RAIBO furniture shop
 */

// Base API URL - Updated to use your hosted backend
export const API_BASE_URL = import.meta.env.VITE_APP_BACKEND_URL;

// API endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    REGISTER: '/api/v1/auth/register',
    LOGIN: '/api/v1/auth/login',
    REFRESH: '/api/v1/auth/refresh',
    GOOGLE_LOGIN: '/api/v1/auth/login/google-auth',
  },
  
  // Products
  PRODUCTS: {
    CREATE: '/api/v1/product/seller',
    SEARCH: '/api/v1/search',
    GET_ALL: '/api/v1/product',
    GET_BY_ID: '/api/v1/product', // Will append /:id
    GET_BY_ID_FOR_SELLER: '/api/v1/product/seller',
    UPDATE: '/api/v1/product/seller',
    DELETE: '/api/v1/product/seller', // Will append /:id
    LIKE: '/api/v1/product/like', // Will append /:id
    COMMENT: '/api/v1/comment', // Will append /:id
    ADMIN: {
      PENDING: '/api/v1/product/admin/pending',
      APPROVE: '/api/v1/product/admin/approve', // Will append /:id
      REJECT: '/api/v1/product/admin/reject', // Will append /:id
    },
  },
  
  // Cart
  CART: {
    GET: '/api/v1/cart/',
    ADD: '/api/v1/cart/add', // Will append /:buyer_id/add
    REMOVE: '/api/v1/cart/remove', // Will append /:buyer_id/remove
    UPDATE: '/api/v1/cart/update-quantity',
    DELETE: '/api/v1/cart/', // Will append /:buyer_id
  },
  
  // Orders
  ORDERS: {
    CREATE: '/api/v1/order/',
    GET_BY_ID: '/api/v1/order', // Will append /:id
    GET_ALL: '/api/v1/order',
  },
  
  // Payment Methods
  PAYMENT_METHODS: {
    CREATE: '/api/v1/payment-methods',
    GET_ALL: '/api/v1/payment-methods',
    GET_BY_ID: '/api/v1/payment-methods', // Will append /:id
    UPDATE: '/api/v1/payment-methods/update', // Will append /:id
    DELETE: '/api/v1/payment-methods', // Will append /:id
  },

  PAYMENT: {
    INITIATE: '/api/v1/payments',
  },
  
  // Address
  ADDRESS: {
    CREATE: '/api/v1/address',
    GET_ALL: '/api/v1/address',
    GET_BY_ID: '/api/v1/address', // Will append /:id
    UPDATE: '/api/v1/address', // Will append /:id
    DELETE: '/api/v1/address', // Will append /:id
  },
  
  // Images
  IMAGES: {
    UPLOAD: '/api/v1/image/upload',
    GET_BY_ID: '/api/v1/image', // Will append /:imageId
    DELETE: '/api/v1/image/delete', // Will append /:imageId
    MULTIPLE: '/api/v1/image/multiple',
  },
  
  // Categories
  CATEGORIES: {
    CREATE: '/api/v1/category',
    GET_ALL: '/api/v1/category',
  },
  
  // Companies
  COMPANIES: {
    CREATE: '/api/v1/company',
    GET_ALL: '/api/v1/company',
    GET_BY_ID: '/api/v1/company', // Will append /:id
    UPDATE: '/api/v1/company', // Will append /:id
    DELETE: '/api/v1/company', // Will append /:id
  },

  // RaiBoard
  BOARDS: {
    CREATE: '/api/v1/board',
    GET_ALL: '/api/v1/board',
    GET_BY_ID: '/api/v1/board', // Will append /:id
    UPDATE: '/api/v1/board', // Will append /:id
    DELETE: '/api/v1/board',
    ADD_PRODUCT: '/api/v1/board/addProduct'  // Will append /:id
  },

  ROOMS: {
    CREATE: '/api/v1/room',
    PRODUCT: '/api/v1/room/product',
    GET_ALL: '/api/v1/room',
    GET_BY_ID: '/api/v1/room', // Will append /:id
    UPDATE: '/api/v1/room', // Will append /:id
    DELETE: '/api/v1/room', // Will append /:id
  },
};

// Local storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'raibo_auth_token',
  USER: 'raibo_user',
  CART: 'raibo_cart',
};

// API request timeouts
export const REQUEST_TIMEOUT = 15000; // 15 seconds

// Simulated delay for mock API
export const SIMULATED_DELAY = 1000; // 1 second

// Common headers
export const getAuthHeaders = () => {
  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

export const getFormDataHeaders = () => {
  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  return {
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};
