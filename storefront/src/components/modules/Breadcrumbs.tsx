"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface BreadcrumbItem {
    label: string;
    href?: string;
    active?: boolean;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
    className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
    return (
        <nav aria-label="Breadcrumb" className={cn("flex mb-8", className)}>
            <ol className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                <li className="flex items-center">
                    <Link href="/" className="hover:text-zinc-900 transition-colors flex items-center gap-1.5">
                        <Home className="w-3 h-3" />
                        <span>Home</span>
                    </Link>
                </li>
                {items.map((item, index) => (
                    <li key={index} className="flex items-center">
                        <ChevronRight className="w-3 h-3 mx-1 text-zinc-300" />
                        {item.active ? (
                            <span className="text-zinc-900">{item.label}</span>
                        ) : (
                            <Link 
                                href={item.href || "#"} 
                                className="hover:text-zinc-900 transition-colors"
                            >
                                {item.label}
                            </Link>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}
