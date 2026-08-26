import { ProductDocument } from "../components/products/rawTypes";

type Image = {
  color?: string | null;
  colorCode?: string | null;
  image: string;
  alt: string;
};

export const transformedProducts = (products: ProductDocument[]) => {
  const transformedProducts = products?.map(
    (product:ProductDocument) => ({
      ...product,
      id: (product._id || product.id)?.toString(),
      images: attachProductImages(
        product.images,
        product.title,
      ),
    }),
  ) as ProductDocument[];

  return transformedProducts;
};

export const attachProductImages = (
  images: Image[],
  productTitle: string,
) => {
  return images.map((image: Image, index: number) => ({
    image: image.image,
    alt: `${productTitle} - Image ${index + 1}`,
    color: image.color || null,
    colorCode: image.colorCode || null,
  }));
};