import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { MapPin, User, Calendar } from "lucide-react";
import { auth } from "@/auth";
import Link from "next/link";

import InquirySection from "@/components/InquirySection";

export default async function PropertyDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const session = await auth();
    const { id } = await params;

    // Fetch property with inquiries
    const property = await prisma.property.findUnique({
        where: { id },
        include: {
            owner: {
                select: {
                    name: true,
                    email: true,
                    phoneNumber: true,
                },
            },
            inquiries: {
                include: {
                    user: {
                        select: {
                            name: true,
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            }
        },
    });

    if (!property) {
        notFound();
    }

    const isOwner = session?.user?.id === property.ownerId;

    return (
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-2">
                {/* Image Section */}
                <div className="rounded-2xl overflow-hidden bg-gray-100 shadow-lg h-96 lg:h-[600px]">
                    {property.imageUrl ? (
                        <img
                            src={property.imageUrl}
                            alt={property.title}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-gray-400">
                            <span className="text-xl">이미지가 없습니다</span>
                        </div>
                    )}
                </div>

                {/* Info Section */}
                <div className="flex flex-col">
                    <div className="border-b border-gray-200 pb-6">
                        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                            {property.title}
                        </h1>
                        <div className="mt-4 flex items-center justify-between">
                            <p className="text-3xl font-bold text-blue-600">
                                {property.price.toLocaleString()} 만원
                            </p>
                            {property.status === "SOLD" && (
                                <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-0.5 text-sm font-medium text-red-800">
                                    거래 완료
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="py-6">
                        <h3 className="sr-only">Description</h3>
                        <div className="space-y-6 text-base text-gray-700 whitespace-pre-wrap">
                            {property.description}
                        </div>
                    </div>

                    <div className="mt-auto border-t border-gray-200 pt-6">
                        <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                            <div className="sm:col-span-2">
                                <dt className="flex items-center text-sm font-medium text-gray-500">
                                    <MapPin className="mr-2 h-5 w-5 text-gray-400" />
                                    주소
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900">
                                    {property.address} {property.detailAddress}
                                </dd>
                            </div>

                            <div>
                                <dt className="flex items-center text-sm font-medium text-gray-500">
                                    <User className="mr-2 h-5 w-5 text-gray-400" />
                                    등록자 정보
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900">
                                    <div>{property.owner.name || "알 수 없음"}</div>
                                    {property.owner.phoneNumber && (
                                        <div className="text-gray-500">{property.owner.phoneNumber}</div>
                                    )}
                                </dd>
                            </div>

                            <div>
                                <dt className="flex items-center text-sm font-medium text-gray-500">
                                    <Calendar className="mr-2 h-5 w-5 text-gray-400" />
                                    등록일
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900">
                                    {property.createdAt.toISOString().split("T")[0]}
                                </dd>
                            </div>
                        </dl>
                    </div>

                    <div className="mt-8 flex gap-4">
                        {isOwner && (
                            <Link
                                href={`/properties/${property.id}/edit`}
                                className="flex-1 rounded-md border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-center"
                            >
                                수정하기
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Inquiry Section */}
            <InquirySection
                propertyId={property.id}
                inquiries={property.inquiries}
                currentUserId={session?.user?.id}
                isOwner={isOwner}
            />
        </div>
    );
}
