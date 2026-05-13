"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard } from "./ProductCard";

interface ProductSliderProps {
    products: any[];
    title: string;
}

export function ProductSlider({ products, title }: ProductSliderProps) {
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

    return (
        <section className="mx-auto max-w-[1400px] px-4 pb-24">
            <div className="flex justify-between items-end mb-12">
                <div>
                    <h2 className="text-2xl font-bold uppercase tracking-tight text-zinc-900">{title}</h2>
                </div>
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
            </div>

            <div 
                ref={scrollRef}
                className="flex overflow-x-auto snap-x snap-mandatory gap-x-4 lg:gap-x-6 pb-8 no-scrollbar scroll-smooth"
            >
                {products.map((product: any) => {
                    const thumbnail = product.featuredImage?.url || product.images?.edges?.[0]?.node?.url;
                    const hoverImage = product.images?.edges?.[1]?.node?.url || thumbnail;
                    const price = parseFloat(product.priceRange?.minVariantPrice?.amount || "0");
                    const currencyCode = product.priceRange?.minVariantPrice?.currencyCode || "INR";

                    return (
                        <div key={product.id} className="flex-none w-[180px] md:w-[240px] lg:w-[280px] snap-start">
                            <ProductCard
                                id={product.id}
                                title={product.title}
                                price={price}
                                currencyCode={currencyCode}
                                handle={product.handle}
                                thumbnail={thumbnail}
                                images={{ main: thumbnail, hover: hoverImage }}
                                defaultVariantId={product.variants?.edges?.[0]?.node?.id}
                                variants={product.variants?.edges?.map((e: any) => e.node) || []}
                                tags={product.tags}
                            />
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
