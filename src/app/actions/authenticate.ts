"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        const credentials = Object.fromEntries(formData);
        await signIn("credentials", { ...credentials, redirectTo: "/" });
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return "이메일 또는 비밀번호가 올바르지 않습니다.";
                default:
                    return "알 수 없는 오류가 발생했습니다.";
            }
        }
        throw error;
    }
}
