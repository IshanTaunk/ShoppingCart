'use client';

import React from "react";
import { Product } from "./products/types";
import Link from "next/link";
import ProductCard from "./products/ProductCard";

interface ProductsListProps{
    initialProducts: Product[];
}

const ProductsList:React.FC<ProductsListProps> = ({initialProducts}) => {

    return (
        <>
            {initialProducts.map((product:Product)=>(
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                >
                    <ProductCard data={product} />
                </Link>
            ))}
        </>
    )
}

export default ProductsList;