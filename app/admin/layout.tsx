import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
    title: "Obsidian Cyber Admin | fLINK Portfolio CMS",
    description: "Production telemetry and content management system for developer portfolio.",
};

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-[#13131b] text-zinc-100 flex flex-col antialiased selection:bg-rose-500 selection:text-white">
            {children}
        </div>
    );
}
