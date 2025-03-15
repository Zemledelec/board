"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "@/store/authSlice";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [error, setError] = useState("");
    const dispatch = useDispatch();
    const router = useRouter();

    const handleLogin = async () => {
        if (username.trim()) {
            try {
                //@ts-expect-error unknown type
                await dispatch(loginUser(username)).unwrap();
                router.push("/posts");
            } catch (err) {
                setError(err as string);
            }
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <h1 className="text-3xl font-bold mb-4">Login</h1>
            <Input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-64"
            />
            <Button className="w-64 mt-4 bg-blue-500 text-white" onClick={handleLogin}>
                Login
            </Button>
            {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
    );
}
