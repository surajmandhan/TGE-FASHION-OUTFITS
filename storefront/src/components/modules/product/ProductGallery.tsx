"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils/cn";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ProductGalleryProps {
    images: string[];
    className?: string;
}

export function ProductGallery({ images, className }: ProductGalleryProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    if (!images || images.length === 0) return null;

    const nextImage = () => {
        setActiveIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = ((e.pageX - left - window.scrollX) / width) * 100;
        const y = ((e.pageY - top - window.scrollY) / height) * 100;
        setMousePos({ x, y });
    };

    return (
        <div className={cn("flex flex-col gap-6", className)}>
            {/* Main Image Viewport (Click to Open Zoom View) */}
            <div 
                className="relative aspect-[4/5] w-[90%] mx-auto overflow-hidden rounded-2xl bg-zinc-50 group cursor-zoom-in"
                onClick={() => setIsLightboxOpen(true)}
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className="relative w-full h-full"
                    >
                        <Image
                            src={images[activeIndex]}
                            alt={`Product image ${activeIndex + 1}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 50vw"
                            priority
                        />
                    </motion.div>
                </AnimatePresence>

                {/* Navigation Arrows */}
                {images.length > 1 && (
                    <>
                        <button 
                            onClick={(e) => { e.stopPropagation(); prevImage(); }}
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/40 backdrop-blur-md flex items-center justify-center text-zinc-900 shadow-sm transition-all duration-300 hover:bg-white hover:scale-110 active:scale-95 z-10"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button 
                            onClick={(e) => { e.stopPropagation(); nextImage(); }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/40 backdrop-blur-md flex items-center justify-center text-zinc-900 shadow-sm transition-all duration-300 hover:bg-white hover:scale-110 active:scale-95 z-10"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </>
                )}

                {/* Image Counter Overlay */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-black/10 backdrop-blur-md text-[10px] font-bold text-white uppercase tracking-widest pointer-events-none">
                    {activeIndex + 1} / {images.length}
                </div>
            </div>

            {/* Thumbnail Navigation */}
            {images.length > 1 && (
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                    {images.map((src, index) => (
                        <button
                            key={index}
                            onClick={() => setActiveIndex(index)}
                            className={cn(
                                "relative aspect-square rounded-lg overflow-hidden bg-zinc-50 border-2 transition-all duration-300",
                                activeIndex === index ? "border-zinc-900 ring-2 ring-zinc-900/10" : "border-transparent opacity-60 hover:opacity-100"
                            )}
                        >
                            <Image
                                src={src}
                                alt={`Thumbnail ${index + 1}`}
                                fill
                                className="object-cover"
                                sizes="100px"
                            />
                        </button>
                    ))}
                </div>
            )}

            {/* Full Screen Lightbox with Zooming */}
            <AnimatePresence>
                {isLightboxOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center p-4 md:p-12"
                    >
                        <button 
                            onClick={() => setIsLightboxOpen(false)}
                            className="absolute top-8 right-8 p-3 rounded-full hover:bg-zinc-100 transition-colors z-20"
                        >
                            <X className="w-8 h-8 text-zinc-900" />
                        </button>

                        <div className="relative w-full max-w-5xl h-full flex items-center justify-center">
                             {/* Lightbox Main Image with Hover Zoom */}
                            <div 
                                className="relative w-full h-full overflow-hidden cursor-crosshair"
                                onMouseMove={handleMouseMove}
                                onMouseEnter={() => setIsHovered(true)}
                                onMouseLeave={() => setIsHovered(false)}
                            >
                                <Image
                                    src={images[activeIndex]}
                                    alt="Product Preview"
                                    fill
                                    className={cn(
                                        "object-contain transition-transform duration-200 ease-out",
                                        isHovered ? "scale-[2.5]" : "scale-100"
                                    )}
                                    style={isHovered ? {
                                        transformOrigin: `${mousePos.x}% ${mousePos.y}%`
                                    } : {}}
                                    priority
                                />
                            </div>

                             {/* Lightbox Navigation */}
                            {images.length > 1 && (
                                <>
                                    <button 
                                        onClick={prevImage}
                                        className="absolute left-0 top-1/2 -translate-y-1/2 p-4 text-zinc-400 hover:text-zinc-900 transition-colors z-20"
                                    >
                                        <ChevronLeft className="w-12 h-12" />
                                    </button>
                                    <button 
                                        onClick={nextImage}
                                        className="absolute right-0 top-1/2 -translate-y-1/2 p-4 text-zinc-400 hover:text-zinc-900 transition-colors z-20"
                                    >
                                        <ChevronRight className="w-12 h-12" />
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Lightbox Thumbnails */}
                        <div className="flex gap-4 mt-8 overflow-x-auto no-scrollbar max-w-full pb-4">
                            {images.map((src, index) => (
                                <button
                                    key={index}
                                    onClick={() => setActiveIndex(index)}
                                    className={cn(
                                        "relative w-20 h-20 shrink-0 rounded-lg overflow-hidden border-2 transition-all",
                                        activeIndex === index ? "border-zinc-900" : "border-transparent opacity-50"
                                    )}
                                >
                                    <Image src={src} alt="Thumb" fill className="object-cover" />
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
