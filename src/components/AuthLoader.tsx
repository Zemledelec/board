"use client";

import { ReactNode, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "@/store/authSlice";

export default function AuthLoader({ children }: { children: ReactNode }) {
    const dispatch = useDispatch();
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const user = sessionStorage.getItem("user");
        if (user) {
            dispatch(login(user));
        }
        setLoaded(true);
    }, [dispatch]);

    if (!loaded) return null;

    return <>{children}</>;
}
