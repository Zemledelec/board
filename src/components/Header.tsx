"use client";

import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/store/authSlice";
import { RootState } from "@/store/store";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Header() {
    const dispatch = useDispatch();
    const router = useRouter();
    const user = useSelector((state: RootState) => state.auth.user);

    const handleLogout = () => {
        dispatch(logout());
        router.push("/login");
    };

    return (
        <header className="p-4 bg-gray-800 text-white flex justify-between">
            <h1 className="text-xl font-bold">Board App</h1>
            {user ? (
                <div className="flex items-center space-x-4">
                    <span>Welcome, {user.username}</span>
                    <Button className="px-4 py-2 bg-red-500 rounded cursor-pointer" onClick={handleLogout}>
                        Logout
                    </Button>
                </div>
            ) : (
                <Button className="px-4 py-2 bg-green-500 rounded" onClick={() => router.push("/login")}>
                    Login
                </Button>
            )}
        </header>
    );
}