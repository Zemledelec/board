"use client";

import { ReactNode, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/authSlice";
import { User } from "@/types";

interface AuthLoaderProps {
    children: ReactNode;
}

export default function AuthLoader({ children }: AuthLoaderProps) {
    const dispatch = useDispatch();
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        try {
            const userData = sessionStorage.getItem("user");
            if (userData) {
                const parsedUser: User = JSON.parse(userData);
                dispatch(setUser(parsedUser)); // ✅ Теперь Redux получает правильный объект
            }
        } catch (error) {
            console.error("Failed to load user:", error);
        }
        setLoaded(true);
    }, [dispatch]);

    if (!loaded) return null;

    return <>{children}</>;
}
