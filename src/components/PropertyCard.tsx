import Link from "next/link";
import { MapPin } from "lucide-react";

interface PropertyCardProps {
    property: {
        id: string;
        title: string;
        price: number;
        address: string;
        region: string;
        imageUrl?: string | null;
    };
}

export default function PropertyCard({ property }: PropertyCardProps) {
    return (
        <Link href={`/properties/${property.id}`} className="group block">
            <div className="overflow-hidden rounded-lg bg-white shadow-sm transition-shadow hover:shadow-md border border-gray-100">
                <div className="aspect-w-16 aspect-h-9 relative h-48 w-full bg-gray-200"> {/* Removed overflow-hidden from here */}
                    {property.imageUrl ? (
                        <img
                            src={property.imageUrl}
                            alt={property.title}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-gray-400"> {/* Removed bg-gray-100 */}
                            <span className="text-sm">No Image</span> {/* Changed text */}
                        </div>
                    )}
                    {property.status === "SOLD" && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                            <span className="rounded-md border-2 border-white px-4 py-1 text-lg font-bold text-white">
                                거래 완료
                            </span>
                        </div>
                    )}
                    <div className="absolute top-2 left-2 rounded bg-gray-900 bg-opacity-60 px-2 py-1 text-xs font-semibold text-white">
                        {property.region}
                    </div>
                </div>
                <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-blue-600">
                        {property.title}
                    </h3>
                    <p className="mt-1 text-xl font-extrabold text-blue-600">
                        {property.price.toLocaleString()} 만원
                    </p>
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                        <MapPin className="mr-1 h-3 w-3" />
                        <span className="line-clamp-1">{property.address}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
