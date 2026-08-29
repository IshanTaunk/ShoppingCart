'use server';
import prisma from '@/libs/prismadb';
import { FullProduct } from '../components/products/types';

export default async function getProductById(
    productId: string,
): Promise<FullProduct | null>{
    try {
        const product = await prisma.product.findUnique({
            where: {
                id: productId,
            }
        });

        console.log('cache productId Key', product);

        if (!product) return null;

        return product;
    } catch (err) {
        console.error('❌ Prisma error:', err);
        throw new Error(
            err instanceof Error ? err.message : String(err),
        );
    }
}