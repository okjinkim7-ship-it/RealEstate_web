import Link from "next/link";
import { auth, signOut } from "@/auth";

export default async function Navbar() {
    const session = await auth();

    return (
        <nav className="bg-white shadow">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 justify-between">
                    <div className="flex">
                        <Link href="/" className="flex flex-shrink-0 items-center font-bold text-xl text-blue-600">
                            부동산마켓
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        {session ? (
                            <>
                                <Link href="/properties/new" className="text-gray-700 hover:text-blue-600 font-medium">
                                    매물 등록
                                </Link>
                                <div className="text-sm text-gray-500">
                                    {session.user?.name}님
                                </div>
                                <form
                                    action={async () => {
                                        "use server";
                                        await signOut();
                                    }}
                                >
                                    <button type="submit" className="text-sm font-medium text-red-600 hover:text-red-500">
                                        로그아웃
                                    </button>
                                </form>
                            </>
                        ) : (
                            <>
                                <Link href="/login" className="text-gray-700 hover:text-blue-600 font-medium">
                                    로그인
                                </Link>
                                <Link href="/signup" className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700">
                                    회원가입
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
