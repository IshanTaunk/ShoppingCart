'use client';

import { CartProductType } from '@/app/products/[productId]/ProductDetails';

interface SetQtyProps {
  isQtyLabelNeeded?: boolean;
  cartProduct?: CartProductType;
  handleQtyIncrease?: () => void;
  handleQtyDecrease?: () => void;
}

const btnStyle =
  'border-[1.2px] border-slate-300 px-2 rounded';

export const SetQuantity: React.FC<SetQtyProps> = ({
  isQtyLabelNeeded,
  cartProduct,
  handleQtyIncrease,
  handleQtyDecrease,
}) => {
  return (
    <div className="flex gap-8 items-center pt-3 pb-3">
      {isQtyLabelNeeded ? (
        <span className="font-semibold">QUANTITY:</span>
      ) : null}
      <div className="flex gap-4 items-center text-base">
        <button
          onClick={handleQtyDecrease}
          disabled={
            !cartProduct?.quantity ||
            cartProduct.quantity <= 1
          }
          className={btnStyle}>
          -
        </button>
        <div>
          {cartProduct && cartProduct?.quantity !== 0
            ? cartProduct.quantity
            : 1}
        </div>
        <button
          onClick={handleQtyIncrease}
          className={btnStyle}>
          +
        </button>
      </div>
    </div>
  );
};
