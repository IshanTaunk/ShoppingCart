export interface ProductDocument {
  _id: string;
  id?: string;
  title: string;
  description: string;
  category: string;
  brand: string;
  price: number;
  stock: number;
  availabilityStatus: string;
  images: ProductImageDocument[];
  reviews: ReviewDocument[];
}

export interface ProductImageDocument {
  image: string;
  alt: string;
}

export interface ReviewDocument {
  rating: number;
  comment: string;
  date: MongoDateDocument;
  reviewerName: string;
  reviewerEmail: string;
  id: string;
  userId: string;
  productId: string;
  user: ReviewUserDocument;
  createdDate: MongoDateDocument;
}

export interface ReviewUserDocument {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: MongoDateDocument;
  updatedAt: MongoDateDocument;
}

export interface MongoDateDocument {
  $date: string;
}