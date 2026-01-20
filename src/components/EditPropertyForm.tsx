"use client";

import { useActionState, useState, useEffect } from "react";
import Link from "next/link";
import { updateProperty } from "@/app/actions/property";
import AddressSearch from "@/components/AddressSearch";
import { useRouter } from "next/navigation";
import ImageUpload from "@/components/ImageUpload";

export default function EditPropertyPage({ params, property }: { params: { id: string }, property: any }) {
    // We need to bind the ID to the server action
    const updatePropertyWithId = updateProperty.bind(null, params.id);
    const [state, action, isPending] = useActionState(updatePropertyWithId, null);

    const [addressData, setAddressData] = useState<any>({
        fullAddress: property.address,
        sido: property.region,
        sigungu: "" // Optional, not stored separately usually but nice to have if parsing
    });
    const [showAddressSearch, setShowAddressSearch] = useState(false);
    const [imageUrl, setImageUrl] = useState(property.imageUrl || "");

    const handleAddressComplete = (data: any) => {
        setAddressData(data);
        setShowAddressSearch(false);
    };

    return (
        <div className="max-w-2xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">매물 수정</h1>
                <p className="mt-2 text-sm text-gray-600">
                    매물 정보를 최신 상태로 업데이트하세요.
                </p>
            </div>

            <form action={action} className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                        제목
                    </label>
                    <input
                        type="text"
                        name="title"
                        id="title"
                        required
                        defaultValue={property.title}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                    />
                </div>

                <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                        가격 (만원)
                    </label>
                    <input
                        type="number"
                        name="price"
                        id="price"
                        required
                        min="0"
                        defaultValue={property.price}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        주소
                    </label>
                    {addressData ? (
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md border border-gray-200">
                            <div>
                                <p className="text-sm font-medium text-gray-900">{addressData.fullAddress}</p>
                                <p className="text-xs text-gray-500">{addressData.sido} {addressData.sigungu}</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowAddressSearch(true)}
                                className="text-sm text-blue-600 hover:text-blue-500 font-medium"
                            >
                                변경
                            </button>
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={() => setShowAddressSearch(true)}
                            className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            주소 검색
                        </button>
                    )}
                    {addressData && (
                        <input
                            type="text"
                            name="detailAddress"
                            defaultValue={property.detailAddress || ""}
                            placeholder="상세 주소 (동, 호수 등)"
                            className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                        />
                    )}
                    <input type="hidden" name="address" value={addressData?.fullAddress || ""} />
                    <input type="hidden" name="region" value={addressData?.sido || ""} />
                </div>

                {showAddressSearch && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                        <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-4 relative">
                            <button
                                type="button"
                                onClick={() => setShowAddressSearch(false)}
                                className="absolute top-2 right-2 text-gray-400 hover:text-gray-500"
                            >
                                <span className="sr-only">닫기</span>
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            <h3 className="text-lg font-medium text-gray-900 mb-4">주소 검색</h3>
                            <AddressSearch onComplete={handleAddressComplete} />
                        </div>
                    </div>
                )}

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        상세 설명
                    </label>
                    <textarea
                        name="description"
                        id="description"
                        rows={5}
                        required
                        defaultValue={property.description}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        이미지
                    </label>
                    <ImageUpload defaultValue={imageUrl} onImageUploaded={setImageUrl} />
                    <input type="hidden" name="imageUrl" value={imageUrl} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        거래 상태
                    </label>
                    <select
                        name="status"
                        defaultValue={property.status || "AVAILABLE"}
                        className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                    >
                        <option value="AVAILABLE">판매 중</option>
                        <option value="SOLD">거래 완료</option>
                    </select>
                </div>

                {state?.error && (
                    <div className="text-sm text-red-600">{state.error}</div>
                )}

                <div className="pt-4 flex justify-end gap-4">
                    <Link
                        href={`/properties/${property.id}`}
                        className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        취소
                    </Link>
                    <button
                        type="submit"
                        disabled={isPending}
                        className="rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                    >
                        {isPending ? "저장 중..." : "저장하기"}
                    </button>
                </div>
            </form>
        </div>
    );
}
