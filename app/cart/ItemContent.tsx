import React from 'react';
import { CartProductType } from '../products/[productId]/ProductDetails'; //-
import { formatPrice } from '../utils/formatePrice';
import Link from 'next/link';
import { truncateText } from '../utils/truncateText';
import Image from 'next/image';
import { SetQuantity } from '../components/products/SetQuantity';
import { useCart } from '@/hooks/useCart';

interface ItemContentProps {
  item: CartProductType;
}
//+
const ItemContent: React.FC<ItemContentProps> = ({
  item,
}) => {
  const {
    handleRemoveProductFromCart,
    handleCartQtyIncrease,
    handleCartQtyDecrease,
  } = useCart();
  return (
    <div
      className="grid grid-cols-5 text-xs md:text-sm gap-4 border-t-[1.5px]
     border-slate-200 py-4 items-center">
      <div className="col-span-2 justify-self-start flex">
        <Link href={`/products/${item.id}`}>
          <div className="relative w-[70px] aspect-square">
            <Image
              src={item.selectedImg.image}
              alt={item.name}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={false}
              loading="lazy"></Image>
          </div>
        </Link>
        <div className="flex flex-col justify-evenly">
          <Link href={`/products/${item.id}`}>
            {truncateText(item.name)}
          </Link>
          {item?.selectedImg?.color && (
            <div>{item.selectedImg.color}</div>
          )}
          <div className="w-[70px]">
            <button
              className="text-slate-500 underline"
              onClick={() =>
                handleRemoveProductFromCart(item)
              }>
              Remove
            </button>
          </div>
        </div>
      </div>
      <div className="justify-self-center">
        {formatPrice(item.price)}
      </div>
      <div className="justify-self-center">
        <SetQuantity
          isQtyLabelNeeded={false}
          cartProduct={item}
          handleQtyIncrease={() => {
            handleCartQtyIncrease(item);
          }}
          handleQtyDecrease={() => {
            handleCartQtyDecrease(item);
          }}
        />
      </div>
      <div className="justify-self-end font-semibold">
        {formatPrice(item?.price * (item.quantity ?? 1))}
      </div>
    </div>
  );
};

export default ItemContent;
