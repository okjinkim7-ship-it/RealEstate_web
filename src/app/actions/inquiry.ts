"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const InquirySchema = z.object({
    content: z.string().min(1, "질문 내용을 입력해주세요."),
    propertyId: z.string(),
});

const AnswerSchema = z.object({
    answer: z.string().min(1, "답변 내용을 입력해주세요."),
    inquiryId: z.string(),
});

export async function createInquiry(prevState: any, formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) {
        return { error: "로그인이 필요합니다." };
    }

    const validatedFields = InquirySchema.safeParse({
        content: formData.get("content"),
        propertyId: formData.get("propertyId"),
    });

    if (!validatedFields.success) {
        return { error: validatedFields.error.issues[0].message };
    }

    const { content, propertyId } = validatedFields.data;

    try {
        await prisma.inquiry.create({
            data: {
                content,
                propertyId,
                userId: session.user.id,
            },
        });

        revalidatePath(`/properties/${propertyId}`);
        return { success: true };
    } catch (error) {
        console.error("Inquiry create error:", error);
        return { error: "문의 등록 중 오류가 발생했습니다." };
    }
}

export async function createAnswer(prevState: any, formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) {
        return { error: "로그인이 필요합니다." };
    }

    const validatedFields = AnswerSchema.safeParse({
        answer: formData.get("answer"),
        inquiryId: formData.get("inquiryId"),
    });

    if (!validatedFields.success) {
        return { error: validatedFields.error.issues[0].message };
    }

    const { answer, inquiryId } = validatedFields.data;

    try {
        const inquiry = await prisma.inquiry.findUnique({
            where: { id: inquiryId },
            include: { property: true },
        });

        if (!inquiry) return { error: "문의를 찾을 수 없습니다." };

        // Check if the current user is the owner of the property
        if (inquiry.property.ownerId !== session.user.id) {
            return { error: "답변 작성 권한이 없습니다." };
        }

        await prisma.inquiry.update({
            where: { id: inquiryId },
            data: { answer },
        });

        revalidatePath(`/properties/${inquiry.property.id}`);
        return { success: true };
    } catch (error) {
        console.error("Answer create error:", error);
        return { error: "답변 등록 중 오류가 발생했습니다." };
    }
}
