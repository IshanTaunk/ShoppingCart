import { Product, Image } from "@/app/components/products/types";
import { products } from "@/const/products";
import ProductDetails from "./ProductDetails";
import getProductById from "@/app/actions/getProductsById";

export interface ProductPageProps {
  params: Promise<{ productId: string }>;
}

const ProductPage = async ({params}: ProductPageProps)=>{
    const { productId } = await params;
    const hardcodedProduct = products.find(
        (p) => p.id === productId,
    );
    let product: Product | null = null;
    if (hardcodedProduct) {
    product = {
      ...hardcodedProduct,
      reviews: hardcodedProduct.reviews.map((review) => ({
        ...review,
        createdDate: new Date(review.createdDate),
        user: {
          ...review.user,
          createdAt: review.user.createdAt
            ? new Date(review.user.createdAt)
            : null,
          updatedAt: review.user.updatedAt
            ? new Date(review.user.updatedAt)
            : null,
        },
      })),
    };
    }else {
    // Fetch from API if not in hardcoded products
    try {
      product = await getProductById(productId);      
    } catch (error) {
      return (
        <div>
          <h1>Product Not Found</h1>
          <p>The requested product could not be found.</p>
        </div>
      );
    }
  }

  if (!product) {
    return (
      <div>
        <h1>Product Not Found</h1>
        <p>The requested product could not be found.</p>
      </div>
    );
  }

    const productWithDate = {
    id: product.id,
    category: product.category,
    title: product.title,
    description: product.description,
    brand: product?.brand ?? null,
    price: product.price,
    stock: product?.stock ?? null,
    inStock: product?.inStock ?? null,
    quantity: product?.quantity ?? null,
    availabilityStatus: product?.availabilityStatus ?? '',
    images:
      product?.images?.map((image: Image) => ({
        ...image,
        color: image?.color ?? null,
        colorCode: image?.colorCode ?? null,
      })) || [],
    reviews: product.reviews.map((review) => ({
      ...review,
      id: review.id || '',
      userId: review.userId || '',
      productId: review.productId || '',
      rating: review.rating || 0,
      createdAt: review.createdDate
        ? new Date(review.createdDate)
        : new Date(),
      date: review.createdDate
        ? new Date(review.createdDate)
        : new Date(),
      createdDate: review.createdDate
        ? new Date(review.createdDate)
        : new Date(),
      comment: review?.comment ?? null,
      reviewerName: review.user?.name || null,
      reviewerEmail: review.user?.email || null,
      user: {
        id: review.user?.id || '',
        name: review.user?.name || '',
        email: review.user?.email || '',
        emailVerified: review.user?.emailVerified || null,
        image: review.user?.image || null,
        hashedPassword: review.user?.hashedPassword || null,
        role: review.user?.role || '',
        createdAt: review.user?.createdAt
          ? new Date(review.user.createdAt)
          : null,
        updatedAt: review.user?.updatedAt
          ? new Date(review.user.updatedAt)
          : null,
      },
    })),
  };
    return <div className="p-8">
        {product && (
            <ProductDetails product={productWithDate} />
          )}
        <div className="flex flex-col mt-20 gap-4">

        </div>
    </div>
};

export default ProductPage;
