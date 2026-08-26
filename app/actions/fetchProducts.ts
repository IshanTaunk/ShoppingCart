'use server';

import prisma from '@/libs/prismadb';
import { transformedProducts } from '../utils/productHelper';

export const getProducts = async ()=>{
    const result = await prisma.$runCommandRaw({
        aggregate: "Product",
        pipeline: [
            {
            $limit: 20
            }
        ],
        cursor: {}
    });

    console.log(JSON.stringify(result));
    const products =
          (result).cursor?.firstBatch || [];
    const newProducts = transformedProducts(products);
    return newProducts;
}

