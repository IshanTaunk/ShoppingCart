import { Product as PrismaProduct } from '@prisma/client';

export type Image = {
  color?: string | null;
  colorCode?: string | null;
  image: string;
  alt: string;
};

export type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  brand?: string | null;
  category: string;
  inStock?: boolean | null;
  images: Image[];
  reviews: Review[];
  quantity?: number | null;
  availabilityStatus?: string | null;
  stock?: number | null;
};

export type Review = {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  comment?: string | null;
  reviewerName?: string | null;
  reviewerEmail?: string | null;
  createdDate?: Date | null;
  date?: Date | null;
  user: {
    id: string;
    name: string;
    email: string;
    emailVerified?: boolean | null;
    image?: string | null;
    hashedPassword?: string | null;
    createdAt?: Date | null;
    updatedAt?: Date | null;
    role?: string;
  };
};

export type FullProduct = PrismaProduct;