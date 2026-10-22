'use client';

import React from "react";
import NullData from "../NullData";
import { Product } from "./types";
import Image from "next/image";
import { truncateText } from "@/app/utils/truncateText";
import { formatPrice } from "@/app/utils/formatePrice";

interface ProductCardProps<TData>{
    data: TData;
}

const ProductCard:React.FC<ProductCardProps<Product>> = ({data}) => {
    const imageSrc = data?.images?.[0]?.image || "/placeholder.png";

    return !data ? (
    <NullData title="No product data available" />
    ) :  (
        <div
      className="col-span-1 cursor-pointer border-[1.2px]
     border-slate-200
     bg-slate-50 rounded-sm p-1 transition 
     hover:scale-105 text-center text-sm"
    // onClick={() => router.push(`products/${data.id}`)}
    >
        <div className="flex flex-col items-center w-full gap-1">
            <div className="aspect-square overflow-hidden relative w-full">
                <Image
                    fill
                    src={imageSrc}
                    alt={data?.title}
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
            </div>

            <div className="mt-4 font-bold">
                {truncateText(data?.title)}
            </div>
            {data?.brand && (
            <div className="text-sm sm:text-[0.75rem]">
                {truncateText(data?.brand)}
            </div>
            )}
            <div className="font-semibold">
            {formatPrice(data?.price)}
            </div>
        </div>
    </div>
    ) 
}

export default ProductCard;