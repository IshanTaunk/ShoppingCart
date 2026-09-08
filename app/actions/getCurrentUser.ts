import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import prisma from "@/libs/prismadb";
import { notFound } from "next/navigation";

export async function getSession() {
  return await getServerSession(authOptions);
}

export async function getCurrentUser() {
    try {
        const session = await getSession();
        if (!session?.user?.email) {
            return null;
        }
        const currentUser = await prisma.user.findUnique({
            where: {
                email: session.user.email as string,
            },
            include: {
                orders: true,
            },
        });
        if (!currentUser) {
            notFound();
        }
        return {
            ...currentUser,
            createdAt:
                currentUser.createdAt?.toISOString() ??
                new Date().toISOString(),
            updatedAt:
                currentUser.updatedAt?.toISOString() ??
                new Date().toISOString(),
            emailVerified:
                currentUser.emailVerified?.toISOString() || null,
            };
    }catch(err: unknown){
        console.error('Error getting current user:', err);
        return null;
    }
}