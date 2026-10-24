import { IconType } from "react-icons";
import { ProductDocument } from "../components/products/rawTypes";
import {
  FaShoppingBag,
  FaLaptop,
  FaTshirt,
  FaMobileAlt,  
  FaMobile,
  FaSun,
  FaTabletAlt,
  FaCar,
  FaGem,
} from 'react-icons/fa';
import { GiLipstick, GiSofa } from 'react-icons/gi';

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

export type Category = {
  label: string;
  icon: IconType;
};

export const desiredCategories: Category[] = [
  { label: 'all', icon: FaShoppingBag },
  { label: 'beauty', icon: GiLipstick },
  { label: 'furniture', icon: GiSofa },
  { label: 'accessories', icon: FaMobileAlt },
  { label: 'home-decoration', icon: GiSofa },
  { label: 'laptops', icon: FaLaptop },
  { label: 'mens', icon: FaTshirt },
  { label: 'smartphones', icon: FaMobile },
  { label: 'sunglasses', icon: FaSun },
  { label: 'tablets', icon: FaTabletAlt },
  { label: 'womens', icon: FaGem },
];
