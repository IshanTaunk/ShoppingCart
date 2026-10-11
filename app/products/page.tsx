import Container from "../components/Container";
import ProductsList from "../components/ProductsList";
import { products as hardCodedProducts } from "@/const/products";
import { getProducts } from "../actions/fetchProducts";
import { toProduct } from "../components/products/decode";
import { Product } from "../components/products/types";

const toDate = (value: string | Date | null | undefined) => {
  if (value === null || value === undefined) return value;
  return new Date(value);
};

const ProductsPage = async () => {
  const category = 'all';
  const response = await getProducts({category});

  const decodedProduct = response.map((el) => toProduct(el));
    const mergedProducts = [...decodedProduct,...hardCodedProducts] as Product[];
    const productsWithDateObjects: Product[] = mergedProducts.map(
    (product) => ({
      ...product,
      reviews: product.reviews.map((review) => ({
        ...review,
        user: {
          ...review.user,
          createdAt: toDate(review.user.createdAt),
          updatedAt: toDate(review.user.updatedAt),
        },
        rating: review.rating,
        createdDate: toDate(review.createdDate),
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