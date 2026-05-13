"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { shopifyFetch } from "@/lib/shopify";
import { getProductsQuery } from "@/lib/shopify/queries";
import { ProductGrid } from "@/components/modules/ProductGrid";
import { Search as SearchIcon, Loader2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function SearchResultsContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [query, setQuery] = useState(searchParams.get("q") || "");
    const [results, setResults] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchResults = async (searchQuery: string) => {
        setIsLoading(true);
        try {
            const res = await shopifyFetch<any>({
                query: getProductsQuery,
                variables: {
                    query: `title:${searchQuery}*`,
                    first: 50
                },
                cache: 'no-store'
            });

            const products = res?.products?.edges?.map((edge: any) => {
                const node = edge.node;
                return {
                    ...node,
                    thumbnail: node.featuredImage?.url,
                    images: node.images?.edges?.map((e: any) => e.node) || [],
                    price: parseFloat(node.priceRange?.minVariantPrice?.amount || "0"),
                    variants: node.variants?.edges?.map((e: any) => e.node) || []
                };
            }) || [];
            setResults(products);
        } catch (error) {
            console.error("Search fetch failed", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const q = searchParams.get("q");
        if (q) {
            setQuery(q);
            fetchResults(q);
        } else {
            setIsLoading(false);
        }
    }, [searchParams]);

    // Live Search Logic
    useEffect(() => {
        if (!query.trim()) return;
        
        const debounce = setTimeout(() => {
            fetchResults(query);
            // Update URL without full reload to keep it in sync
            const newUrl = `/search?q=${encodeURIComponent(query.trim())}`;
            window.history.replaceState({ ...window.history.state, as: newUrl, url: newUrl }, '', newUrl);
        }, 400);

        return () => clearTimeout(debounce);
    }, [query]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            fetchResults(query);
        }
    };

    return (
        <div className="min-h-screen bg-[#fbfbfb] pt-32 pb-20 px-4 md:px-8">
            <div className="max-w-[1400px] mx-auto">
                
                {/* Sticky Minimalist Search Bar */}
                <div className="sticky top-0 z-30 mb-12 bg-[#fbfbfb]/90 backdrop-blur-md -mx-4 px-4 md:-mx-8 md:px-8 pt-8 pb-4">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-200 pb-6">
                        <div className="flex-1 max-w-2xl">
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-2 block">Scouring the Archives</span>
                            <form onSubmit={handleSearch} className="relative">
                                <input 
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search..."
                                    className="w-full bg-transparent text-3xl md:text-5xl font-black uppercase tracking-tight text-zinc-900 outline-none placeholder:text-zinc-100"
                                />
                                {query && (
                                    <button 
                                        type="button" 
                                        onClick={() => setQuery("")}
                                        className="absolute right-0 top-1/2 -translate-y-1/2 p-2 hover:bg-zinc-100 rounded-full transition-colors"
                                    >
                                        <X className="w-6 h-6 text-zinc-300" />
                                    </button>
                                )}
                            </form>
                        </div>
                        <div className="flex flex-row md:flex-col items-center md:items-end gap-2 md:gap-1 shrink-0">
                            <span className="text-2xl md:text-3xl font-black text-zinc-900">{results.length}</span>
                            <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">Results</span>
                        </div>
                    </div>
                </div>

                {/* Results Grid */}
                <div className="relative">
                    <AnimatePresence mode="wait">
                        {isLoading ? (
                            <motion.div 
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="py-40 flex flex-col items-center justify-center"
                            >
                                <div className="w-12 h-12 border-2 border-zinc-100 border-t-zinc-900 rounded-full animate-spin mb-6" />
                                <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">Syncing with TGE Archives...</p>
                            </motion.div>
                        ) : results.length > 0 ? (
                            <motion.div
                                key="results"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <ProductGrid products={results} />
                            </motion.div>
                        ) : (
                            <motion.div 
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="py-40 text-center"
                            >
                                <h2 className="text-2xl font-bold text-zinc-900 mb-4 uppercase tracking-tight">Zero Matches</h2>
                                <p className="text-zinc-500 max-w-sm mx-auto text-sm font-medium leading-relaxed">
                                    Your search for <span className="text-zinc-900 font-bold">&quot;{query}&quot;</span> didn&apos;t return any products. 
                                    Try adjusting your keywords or exploring our latest drops.
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-[#fbfbfb]">
                <div className="w-8 h-8 border-2 border-zinc-100 border-t-zinc-900 rounded-full animate-spin" />
            </div>
        }>
            <SearchResultsContent />
        </Suspense>
    );
}
