"use client";

import {useEffect} from "react";
import {useRouter} from "next/navigation";
import {useSelector} from "react-redux";
import {RootState} from "@/store/store";

export default function Home() {
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    const router = useRouter();

    useEffect(() => {
        if (isAuthenticated) {
            router.push("/posts");
        } else {
            router.push("/login");
        }
    }, [isAuthenticated, router]);

    return <p className="text-center mt-10">Redirecting...</p>;
}