"use client";

import { useActionState, useState } from "react";
import { createInquiry, createAnswer } from "@/app/actions/inquiry";

type Inquiry = {
    id: string;
    content: string;
    answer: string | null;
    createdAt: Date;
    user: {
        name: string | null;
    };
};

type InquirySectionProps = {
    propertyId: string;
    inquiries: Inquiry[];
    currentUserId: string | undefined;
    isOwner: boolean;
};

export default function InquirySection({ propertyId, inquiries, currentUserId, isOwner }: InquirySectionProps) {
    const [inquiryState, inquiryAction, isPendingInquiry] = useActionState(createInquiry, null);
    const [answerStates, setAnswerStates] = useState<Record<string, any>>({});
    const [activeInquiryId, setActiveInquiryId] = useState<string | null>(null);

    // Helper to wrap createAnswer for specific inquiry
    const handleAnswerSubmit = async (formData: FormData) => {
        const result = await createAnswer(null, formData);
        const inquiryId = formData.get("inquiryId") as string;
        setAnswerStates(prev => ({ ...prev, [inquiryId]: result }));
        if (result?.success) {
            setActiveInquiryId(null); // Close form on success
        }
    };

    return (
        <div className="mt-12 border-t border-gray-200 pt-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">문의하기</h2>

            {/* Inquiry Form */}
            {currentUserId && !isOwner && (
                <form action={inquiryAction} className="mb-10 bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-900 mb-2">질문 작성하기</h3>
                    <input type="hidden" name="propertyId" value={propertyId} />
                    <textarea
                        name="content"
                        rows={3}
                        required
                        placeholder="매물에 대해 궁금한 점을 남겨주세요."
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border"
                    />
                    {inquiryState?.error && (
                        <p className="text-sm text-red-600 mt-2">{inquiryState.error}</p>
                    )}
                    <div className="mt-3 flex justify-end">
                        <button
                            type="submit"
                            disabled={isPendingInquiry}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                            {isPendingInquiry ? "등록 중..." : "등록하기"}
                        </button>
                    </div>
                </form>
            )}

            {/* Inquiries List */}
            <div className="space-y-8">
                {inquiries.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">아직 등록된 문의가 없습니다.</p>
                ) : (
                    inquiries.map((inquiry) => (
                        <div key={inquiry.id} className="bg-white rounded-lg border border-gray-200 p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mr-2">
                                        질문
                                    </span>
                                    <span className="font-medium text-gray-900">{inquiry.user.name || "익명"}</span>
                                    <span className="text-gray-500 text-sm ml-2">
                                        {inquiry.createdAt.toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                            <p className="text-gray-800 mb-4 whitespace-pre-wrap">{inquiry.content}</p>

                            {/* Answer Section */}
                            {inquiry.answer ? (
                                <div className="mt-4 bg-blue-50 p-4 rounded-md">
                                    <div className="flex items-center mb-2">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2">
                                            답변
                                        </span>
                                        <span className="font-medium text-gray-900">판매자</span>
                                    </div>
                                    <p className="text-gray-800 whitespace-pre-wrap">{inquiry.answer}</p>
                                </div>
                            ) : (
                                isOwner && (
                                    <div className="mt-4">
                                        {activeInquiryId === inquiry.id ? (
                                            <form action={handleAnswerSubmit} className="bg-gray-50 p-4 rounded-md">
                                                <input type="hidden" name="inquiryId" value={inquiry.id} />
                                                <textarea
                                                    name="answer"
                                                    rows={3}
                                                    required
                                                    autoFocus
                                                    placeholder="답변을 입력해주세요."
                                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                                                />
                                                {answerStates[inquiry.id]?.error && (
                                                    <p className="text-sm text-red-600 mt-2">{answerStates[inquiry.id].error}</p>
                                                )}
                                                <div className="mt-2 flex justify-end space-x-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => setActiveInquiryId(null)}
                                                        className="px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                                                    >
                                                        취소
                                                    </button>
                                                    <button
                                                        type="submit"
                                                        className="px-3 py-1.5 border border-transparent shadow-sm text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700"
                                                    >
                                                        등록
                                                    </button>
                                                </div>
                                            </form>
                                        ) : (
                                            <button
                                                onClick={() => setActiveInquiryId(inquiry.id)}
                                                className="text-sm text-blue-600 hover:text-blue-500 font-medium"
                                            >
                                                답변 달기
                                            </button>
                                        )}
                                    </div>
                                )
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
