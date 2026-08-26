
import { MongoDateDocument, ProductDocument, ProductImageDocument, ReviewDocument, ReviewUserDocument } from "./rawTypes";
import { Product, Review, Image } from "./types";

export const toProduct = (
  product: ProductDocument,
): Product => ({
  id: product._id,
  title: product.title,
  description: product.description,
  category: product.category,
  brand: product.brand,
  price: product.price,
  stock: product.stock,
  availabilityStatus: product.availabilityStatus,
  inStock:
    product.stock != null ? product.stock > 0 : undefined,
  images: product.images.map(toImage),
  reviews: product.reviews.map(toReview),
});

const toImage = (
  image: ProductImageDocument,
): Image => ({
  image: image.image,
  alt: image.alt,
});

const toReview = (
  review: ReviewDocument,
): Review => ({
  id: review.id,
  userId: review.userId,
  productId: review.productId,
  rating: review.rating,
  comment: review.comment,
  reviewerName: review.reviewerName,
  reviewerEmail: review.reviewerEmail,
  date: toDate(review.date),
  createdDate: toDate(review.createdDate),
  user: toUser(review.user),
});

const toUser = (
  user: ReviewUserDocument,
): Review["user"] => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: toDate(user.createdAt),
  updatedAt: toDate(user.updatedAt),
});

const toDate = (
  date?: MongoDateDocument | null,
): Date | undefined => {
  if (!date) return undefined;
  return new Date(date.$date);
};