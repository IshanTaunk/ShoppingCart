import { CartProductType, SelectedImgType } from "@/app/products/[productId]/ProductDetails";
import { Product } from "./types";
import Image from "next/image";

interface ProductImageProps {
  cartProduct?: CartProductType;
  product: Product;
  handleColorSelect: (value: SelectedImgType) => void;
}

const ProductImage: React.FC<ProductImageProps> = ({
  cartProduct,
  product,
  handleColorSelect,
}) => {
    return (
        <div
      className="grid grid-cols-6
    gap-2
    h-full 
    max-h-[500px]
    min-h-[300px]
    sm:min-h-[400px]
    ">
        <div
        className="flex
      flex-col
      items-center
      justify-center
      gap-4
      cursor-pointer
      border
      h-full
      max-h-[500px]
      min-h-[300px]
      sm-min-h-[400px]">
        {product?.images.map(
          (image: SelectedImgType, index: number) => {
            return (
              <div
                key={`${image.alt} - ${index}`}
                onClick={() => handleColorSelect(image)}
                className={`relative w-[80%]
            aspect-square rounded border-teal-300 
            ${cartProduct?.selectedImg?.alt === image?.alt ? 'border-[1.5px]' : 'border: none'}`}>
                <Image
                  src={image.image}
                  alt={`${product.title} - Image ${index + 1}`}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority={false}
                  loading="lazy"
                />
              </div>
            );
          },
        )}
      </div>
        <div className="col-span-5 relative aspect-square">
        <Image
          fill
          src={cartProduct?.selectedImg?.image ?? ''}
          alt={cartProduct?.name ?? ''}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-contain max-h-[500px] min-h-[300px] sm:min-h-[400px]"
          priority={false}
          loading="lazy"
        />{' '}
      </div>
    </div>
    )
}

export default ProductImage;