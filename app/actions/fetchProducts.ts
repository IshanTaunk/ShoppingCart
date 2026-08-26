'use server';

import prisma from '@/libs/prismadb';
import { transformedProducts } from '../utils/productHelper';

type AggregateCommandResult = {
    cursor?: {
        firstBatch?: unknown;
    };
};

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

    const { cursor } = result as AggregateCommandResult;
    const products = Array.isArray(cursor?.firstBatch)
        ? cursor.firstBatch
        : [];
    const newProducts = transformedProducts(products);
    return newProducts;
}

