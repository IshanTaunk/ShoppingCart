import React from "react";
import Container from "../components/Container";
import ProductsList from "../components/ProductsList";
import { products as hardCodedProducts } from "@/const/products";

interface ProductsPageProps {
    searchParams?: {
        q?: string;
    }
}

const ProductsPage:React.FC<ProductsPageProps> = () => {
    const productsWithDateObjects = hardCodedProducts.map(
    (product) => ({
      ...product,
      reviews: product.reviews.map((review) => ({
        ...review,
        user: {
          ...review.user,
          createdAt: new Date(review.user.createdAt),
          updatedAt: new Date(review.user.updatedAt),
        },
        rating: review.rating,
        createdDate: new Date(review.createdDate),
      })),
    }),
  );
    return (
        <Container>
            <div className="p-8 relative">
             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
            <ProductsList
                initialProducts={productsWithDateObjects}
            ></ProductsList>
            </div>
            </div>
        </Container>
    )
}

export default ProductsPage;