"use client";

import "@/app/globals.css";

import {Provider} from "react-redux";
import {store} from "@/store/store";
import AuthLoader from "@/components/AuthLoader";
import {ReactNode} from "react";

interface RootLayoutProps {
    children: ReactNode;
}

export default function RootLayout({children}: RootLayoutProps) {
    return (
        <html lang="en">
        <body>
        <Provider store={store}>
            <AuthLoader>{children}</AuthLoader>
        </Provider>
        </body>
        </html>
    );
}