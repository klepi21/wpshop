'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { productService } from '@/services/products';
import { toast } from 'react-hot-toast';
import { useCart } from '@/context/CartContext';
import { motion } from 'framer-motion';

// ... rest of your existing product page code 