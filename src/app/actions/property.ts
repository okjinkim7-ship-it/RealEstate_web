"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const PropertySchema = z.object({
    title: z.string().min(3),
    description: z.string().min(10),
    price: z.coerce.number().min(0),
    address: z.string(),
    detailAddress: z.string().optional(),
    region: z.string(),
    imageUrl: z.string().optional(),
});

export async function createProperty(prevState: any, formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) {
        return { error: "로그인이 필요합니다." };
    }

    const validatedFields = PropertySchema.safeParse(
        Object.fromEntries(formData.entries())
    );

    if (!validatedFields.success) {
        return {
            error: "입력값이 올바르지 않습니다.",
        };
    }

    const { title, description, price, address, detailAddress, region, imageUrl } = validatedFields.data;

    try {
        await prisma.property.create({
            data: {
                title,
                description,
                price,
                address,
                detailAddress,
                region,
                imageUrl,
                ownerId: session.user.id,
            },
        });
    } catch (error) {
        return {
            error: "매물 등록 중 오류가 발생했습니다.",
        };
    }

    revalidatePath("/");
    redirect("/");
}

export async function updateProperty(id: string, prevState: any, formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) {
        return { error: "로그인이 필요합니다." };
    }

    const validatedFields = PropertySchema.safeParse(
        Object.fromEntries(formData.entries())
    );

    if (!validatedFields.success) {
        return {
            error: "입력값이 올바르지 않습니다.",
        };
    }

    const { title, description, price, address, detailAddress, region, imageUrl } = validatedFields.data;

    try {
        const property = await prisma.property.findUnique({
            where: { id },
        });

        if (!property) return { error: "매물을 찾을 수 없습니다." };
        if (property.ownerId !== session.user.id) return { error: "수정 권한이 없습니다." };

        await prisma.property.update({
            where: { id },
            data: {
                title,
                description,
                price,
                address,
                detailAddress,
                region,
                imageUrl,
            },
        });
    } catch (error) {
        return {
            error: "매물 수정 중 오류가 발생했습니다.",
        };
    }

    revalidatePath("/");
    revalidatePath(`/properties/${id}`);
    redirect(`/properties/${id}`);
}
