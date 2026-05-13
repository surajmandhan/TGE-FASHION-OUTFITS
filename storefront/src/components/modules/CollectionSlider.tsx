"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface CollectionSliderProps {
    collections: any[];
    title: string;
}

export function CollectionSlider({ collections, title }: CollectionSliderProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: "left" | "right") => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollTo = direction === "left" 
                ? scrollLeft - clientWidth / 2 
                : scrollLeft + clientWidth / 2;
            
            scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
        }
    };

    if (collections.length === 0) return null;

    // Only show slider if more than 4 items, otherwise grid is fine but user asked for slideable if > 4
    const isSlider = collections.length > 4;

    return (
        <section className="mx-auto max-w-[1400px] px-4 py-24 border-t border-zinc-100">
            <div className="flex justify-between items-end mb-12">
                <div>
                    <h2 className="text-2xl font-bold uppercase tracking-tight text-zinc-900">{title}</h2>
                </div>
                {isSlider && (
                    <div className="flex gap-2">
                        <button 
                            onClick={() => scroll("left")}
                            className="p-2 rounded-full border border-zinc-200 hover:bg-zinc-900 hover:text-white transition-colors"
                            aria-label="Previous"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button 
                            onClick={() => scroll("right")}
                            className="p-2 rounded-full border border-zinc-200 hover:bg-zinc-900 hover:text-white transition-colors"
                            aria-label="Next"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                )}
            </div>

            <div 
                ref={scrollRef}
                className={`flex ${isSlider ? 'overflow-x-auto snap-x snap-mandatory no-scrollbar scroll-smooth' : 'grid grid-cols-2 md:grid-cols-4'} gap-6 lg:gap-8 pb-8`}
            >
                {collections.map((cat: any) => (
                    <Link 
                        key={cat.id} 
                        href={`/collections/${cat.handle}`} 
                        className={`group block text-center ${isSlider ? 'flex-none w-[150px] md:w-[240px] lg:w-[280px] snap-start' : 'w-full'}`}
                    >
                        <div className="relative aspect-square overflow-hidden bg-zinc-100 mb-6 rounded-full border border-zinc-100 group-hover:border-zinc-300 transition-colors">
                            <Image
                                src={cat.image?.url || "https://images.unsplash.com/photo-1584917033904-493bb3ce3af1?q=80&w=800&auto=format&fit=crop"}
                                alt={cat.title}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-zinc-900 text-sm md:text-base font-bold uppercase tracking-widest group-hover:underline underline-offset-8 decoration-1">
                                {cat.title}
                            </span>
                            <span className="text-[10px] text-zinc-400 mt-2 font-bold uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity">
                                Explore
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
