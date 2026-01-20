"use client";

import { useActionState } from "react";
import { authenticate } from "@/app/actions/authenticate";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
    const [errorMessage, dispatch, isPending] = useActionState(authenticate, undefined);
    const router = useRouter();

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-6 shadow-lg sm:p-10">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900">로그인</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        계정이 없으신가요?{" "}
                        <Link href="/signup" className="font-medium text-blue-600 hover:text-blue-500">
                            회원가입하기
                        </Link>
                    </p>
                </div>

                <form action={dispatch} className="mt-8 space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                이메일
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                비밀번호
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                            />
                        </div>
                    </div>

                    {errorMessage && (
                        <div className="text-sm text-red-600">{errorMessage}</div>
                    )}

                    <button
                        type="submit"
                        disabled={isPending}
                        className="flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                    >
                        {isPending ? "로그인 중..." : "로그인"}
                    </button>
                </form>
            </div>
        </div>
    );
}
