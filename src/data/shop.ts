import { Product, Category } from '@/types/shop';

export const categories: Category[] = [
  {
    id: 'apparel',
    name: 'Apparel',
    description: 'T-shirts, hoodies, and more',
    image: '/images/shop/categories/apparel.jpg'
  },
  {
    id: 'accessories',
    name: 'Accessories',
    description: 'Caps, bags, and other accessories',
    image: '/images/shop/categories/accessories.jpg'
  },
  {
    id: 'collectibles',
    name: 'Collectibles',
    description: 'Limited edition items and collectibles',
    image: '/images/shop/categories/collectibles.jpg'
  }
];

export const products: Product[] = [
  {
    id: 'classic-tee-black',
    name: 'Classic Logo T-Shirt',
    description: 'Premium cotton t-shirt with our iconic logo',
    price: 29.99,
    images: [
      '/images/shop/products/classic-tee-1.jpg',
      '/images/shop/products/classic-tee-2.jpg',
      '/images/shop/products/classic-tee-3.jpg'
    ],
    category: 'apparel',
    features: [
      '100% Premium Cotton',
      'Comfortable fit',
      'Durable print',
      'Available in multiple sizes'
    ],
    specifications: {
      material: '100% Cotton',
      fit: 'Regular fit',
      care: 'Machine wash cold'
    },
    stock: 100
  },
  {
    id: 'premium-hoodie',
    name: 'Premium Pullover Hoodie',
    description: 'Cozy and stylish hoodie perfect for any occasion',
    price: 59.99,
    images: [
      '/images/shop/products/hoodie-1.jpg',
      '/images/shop/products/hoodie-2.jpg'
    ],
    category: 'apparel',
    features: [
      'Heavyweight fleece',
      'Kangaroo pocket',
      'Ribbed cuffs and hem',
      'Double-lined hood'
    ],
    specifications: {
      material: '80% Cotton, 20% Polyester',
      fit: 'Regular fit',
      care: 'Machine wash cold'
    },
    stock: 75
  },
  {
    id: 'snapback-cap',
    name: 'Classic Snapback Cap',
    description: 'Adjustable snapback cap with embroidered logo',
    price: 24.99,
    images: [
      '/images/shop/products/cap-1.jpg',
      '/images/shop/products/cap-2.jpg'
    ],
    category: 'accessories',
    features: [
      'Structured 6-panel design',
      'Embroidered logo',
      'Adjustable snapback closure',
      'Flat brim'
    ],
    specifications: {
      material: '100% Cotton Twill',
      size: 'One size fits most',
      care: 'Spot clean only'
    },
    stock: 50
  },
  {
    id: 'backpack',
    name: 'Urban Explorer Backpack',
    description: 'Spacious backpack with laptop compartment',
    price: 79.99,
    images: [
      '/images/shop/products/backpack-1.jpg',
      '/images/shop/products/backpack-2.jpg'
    ],
    category: 'accessories',
    features: [
      'Laptop compartment (fits up to 15")',
      'Water-resistant material',
      'Multiple pockets',
      'Padded straps'
    ],
    specifications: {
      material: 'Polyester',
      capacity: '25L',
      dimensions: '18" x 12" x 6"'
    },
    stock: 30
  },
  {
    id: 'limited-poster',
    name: 'Limited Edition Art Print',
    description: 'Numbered art print, limited to 100 pieces',
    price: 49.99,
    images: [
      '/images/shop/products/poster-1.jpg',
      '/images/shop/products/poster-2.jpg'
    ],
    category: 'collectibles',
    features: [
      'Numbered edition',
      'Museum-quality print',
      'Signed by the artist',
      'Certificate of authenticity'
    ],
    specifications: {
      material: 'Fine art paper',
      size: '24" x 36"',
      edition: 'Limited to 100'
    },
    stock: 100
  },
  {
    id: 'enamel-pin',
    name: 'Collector\'s Enamel Pin',
    description: 'High-quality enamel pin with our signature design',
    price: 12.99,
    images: [
      '/images/shop/products/pin-1.jpg',
      '/images/shop/products/pin-2.jpg'
    ],
    category: 'collectibles',
    features: [
      'Hard enamel',
      'Gold plated',
      'Butterfly clutch backing',
      'Exclusive design'
    ],
    specifications: {
      material: 'Hard enamel, gold plating',
      size: '1.5 inches',
      backing: 'Butterfly clutch'
    },
    stock: 200
  }
]; 