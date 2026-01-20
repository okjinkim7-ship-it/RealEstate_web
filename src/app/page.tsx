import { prisma } from "@/lib/prisma";
import PropertyCard from "@/components/PropertyCard";
import Link from "next/link";
import { clsx } from "clsx";

const REGION_MAPPING: Record<string, string> = {
  "서울": "서울",
  "경기": "경기",
  "인천": "인천",
  "부산": "부산",
  "대구": "대구",
  "광주": "광주",
  "대전": "대전",
  "울산": "울산",
  "세종": "세종",
  "강원": "강원",
  "충북": "충북",
  "충남": "충남",
  "전북": "전북",
  "전남": "전남",
  "경북": "경북",
  "경남": "경남",
  "제주": "제주"
};

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ region?: string }>;
}) {
  const { region: selectedRegion = "전체" } = await searchParams;

  const where = selectedRegion !== "전체" && REGION_MAPPING[selectedRegion]
    ? { region: { contains: REGION_MAPPING[selectedRegion] } }
    : {};

  const properties = await prisma.property.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
          내가 찾던 <span className="text-blue-600">완벽한 공간</span>
        </h1>
        <p className="mt-4 text-xl text-gray-500">
          전국 어디서나 원하는 매물을 쉽고 빠르게 찾아보세요.
        </p>
      </div>

      {/* Region Filter */}
      <div className="mb-10 overflow-x-auto">
        <div className="flex space-x-2 pb-2 justify-center min-w-max px-4">
          <Link
            href="/"
            className={clsx(
              "rounded-full px-4 py-2 text-sm font-medium transition-colors",
              selectedRegion === "전체"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
            )}
          >
            전체
          </Link>
          {Object.keys(REGION_MAPPING).map((regionKey) => (
            <Link
              key={regionKey}
              href={`/?region=${regionKey}`}
              className={clsx(
                "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                selectedRegion === regionKey
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              )}
            >
              {regionKey}
            </Link>
          ))}
        </div>
      </div>

      {/* Property Grid */}
      {properties.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="rounded-full bg-gray-100 p-6 mb-4">
            <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-gray-900">등록된 매물이 없습니다.</h3>
          <p className="mt-2 text-gray-500">다른 지역을 선택하거나 첫 번째 매물을 등록해보세요!</p>
          <Link href="/properties/new" className="mt-6 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
            매물 등록하기
          </Link>
        </div>
      )}
    </div>
  );
}
