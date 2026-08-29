'use client';

import {
  CartProductType,
  Horizontal,
  SelectedImgType,
} from '@/app/products/[productId]/ProductDetails';

interface SetColorProps {
  images: SelectedImgType[];
  cartProduct?: CartProductType;
  handleColorSelect: (value: SelectedImgType) => void;
}
const SetColor: React.FC<SetColorProps> = ({
  images,
  cartProduct,
  handleColorSelect,
}) => {
  return (
    <>
      <div className="flex gap-4 items-center pt-3 pb-3">
        <span className="font-semibold">COLOR:</span>
        <div className="flex gap-1">
          {images?.map((image, index) => {
            return (
              image?.color && (
                <div
                  key={`${image?.color}-${index}`}
                  onClick={() => handleColorSelect(image)}
                  className={`h-7 w-7 rounded-full
                         border-teal-300 
                         flex items-center
                         justify-center 
                        ${cartProduct?.selectedImg?.color === image?.color ? 'border-[1.5px]' : 'border-none'}`}>
                  <div
                    style={{
                      background:
                        image?.colorCode ?? 'none',
                    }}
                    className="h-5 w-5 rounded-full border-[1.2px] border-slate-300 cursor-pointer"></div>
                </div>
              )
            );
          })}
        </div>
      </div>
      <Horizontal />
    </>
  );
};

export default SetColor;
