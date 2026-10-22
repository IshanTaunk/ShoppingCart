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

interface ProductsPageProps {
  searchParams?: Promise<{
    category?: string;
    q?: string;
    priceMin?: string;
    priceMax?: string;
    aiCategory?: string;
  }>;
}

const ProductsPage:React.FC<ProductsPageProps> = async ({
  searchParams
}) => {
  const resolvedSearchParams = await searchParams;
  const category = resolvedSearchParams && resolvedSearchParams.category
      ? resolvedSearchParams.category
      : 'all';
  const query =
    resolvedSearchParams && resolvedSearchParams.q
      ? resolvedSearchParams.q
      : null;
  const priceMin = resolvedSearchParams?.priceMin
    ? parseFloat(resolvedSearchParams.priceMin)
    : undefined;
  const priceMax = resolvedSearchParams?.priceMax
    ? parseFloat(resolvedSearchParams.priceMax)
    : undefined;
  const aiCategory = resolvedSearchParams?.aiCategory || undefined;
  const skip = 0;
  const limit = 100;
  let response;
  if(query){
    response = await getProducts({
      query,
      limit,
      skip,
      priceMin,
      priceMax,
      aiCategory});
  }else{
      response = await getProducts({
        category,
        limit,
        skip
      });
  }

  const decodedProduct = response.map((el) => toProduct(el));
  const mergedProducts = [...decodedProduct] as Product[];
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