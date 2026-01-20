"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const SignUpSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string()
        .min(8, "비밀번호는 최소 8자 이상이어야 합니다.")
        .refine((val) => (val.match(/[a-zA-Z]/g) || []).length >= 4, {
            message: "비밀번호에는 영문자가 4자 이상 포함되어야 합니다.",
        })
        .refine((val) => /[!@#$%^&*(),.?":{}|<>]/.test(val), {
            message: "비밀번호에는 특수문자가 1자 이상 포함되어야 합니다.",
        }),
    phoneNumber: z.string().optional(),
});

export async function signUp(prevState: any, formData: FormData) {
    const validatedFields = SignUpSchema.safeParse(
        Object.fromEntries(formData.entries())
    );

    if (!validatedFields.success) {
        // Return the first error message
        return {
            error: validatedFields.error.issues[0].message,
            name: formData.get("name") as string,
            email: formData.get("email") as string,
            phoneNumber: formData.get("phoneNumber") as string,
        };
    }

    const { name, email, password, phoneNumber } = validatedFields.data;

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return {
                error: "이미 존재하는 이메일입니다.",
                name,
                email,
                phoneNumber,
            };
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                phoneNumber,
            },
        });

        return { success: true };
    } catch (error) {
        return {
            error: "회원가입 중 오류가 발생했습니다.",
            name,
            email,
            phoneNumber,
        };
    }
}
