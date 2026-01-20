"use client";

import { useActionState } from "react";
import { signUp } from "@/app/actions/auth";
import Link from "next/link";

export default function SignUpPage() {
    const [state, action, isPending] = useActionState(signUp, null);

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-6 shadow-lg sm:p-10">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900">회원가입</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        이미 계정이 있으신가요?{" "}
                        <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                            로그인하기
                        </Link>
                    </p>
                </div>

                <form action={action} className="mt-8 space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                이름
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                defaultValue={state?.name || ""}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                이메일
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                defaultValue={state?.email || ""}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                                연락처
                            </label>
                            <input
                                id="phoneNumber"
                                name="phoneNumber"
                                type="tel"
                                placeholder="010-1234-5678"
                                defaultValue={state?.phoneNumber || ""}
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
                                minLength={6}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                            />
                        </div>
                    </div>

                    {state?.error && (
                        <div className="text-sm text-red-600">{state.error}</div>
                    )}
                    {state?.success && (
                        <div className="text-sm text-green-600">회원가입 성공! 로그인해주세요.</div>
                    )}

                    <button
                        type="submit"
                        disabled={isPending}
                        className="flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                    >
                        {isPending ? "가입 중..." : "가입하기"}
                    </button>
                </form>
            </div>
        </div>
    );
}
