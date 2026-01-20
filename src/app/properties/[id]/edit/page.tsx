import { prisma } from "@/lib/prisma";
import EditPropertyForm from "@/components/EditPropertyForm";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function EditPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await auth();
    if (!session) {
        redirect("/login");
    }

    const { id } = await params;
    const property = await prisma.property.findUnique({
        where: { id },
    });

    if (!property) {
        notFound();
    }

    if (property.ownerId !== session.user?.id) {
        return <div className="p-10 text-center">수정 권한이 없습니다.</div>;
    }

    return <EditPropertyForm params={{ id }} property={property} />;
}
