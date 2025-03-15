"use client";

import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/store/authSlice";
import { RootState } from "@/store/store";
import { useRouter } from "next/navigation";

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
            <h1 className="text-xl font-bold">My App</h1>
            {user ? (
                <div className="flex items-center space-x-4">
                    <span>Welcome, {user.username}</span>
                    <button className="px-4 py-2 bg-red-500 rounded" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            ) : (
                <button className="px-4 py-2 bg-green-500 rounded" onClick={() => router.push("/login")}>
                    Login
                </button>
            )}
        </header>
    );
}