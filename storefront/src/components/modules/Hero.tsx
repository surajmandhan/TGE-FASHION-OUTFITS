import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

interface HeroProps {
    heading?: string;
    subheading?: string;
    kicker?: string;
    ctaText?: string;
    ctaLink?: string;
    imageUrl?: string;
}

export function Hero({
    heading = "THE NEW UNIFORM",
    subheading = "Essential. Deliberate. Forever.",
    kicker = "Engineered Dailywear",
    ctaText = "Shop Collection",
    ctaLink = "/collections",
    imageUrl = "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=2674&auto=format&fit=crop"
}: HeroProps) {
    return (
        <section className="relative h-[65vh] md:h-[75vh] w-full bg-zinc-950 overflow-hidden flex items-center justify-center rounded-b-[32px] mb-4">

            {/* Background Typography (Layer 0) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl px-4 z-0 pointer-events-none opacity-[0.03]">
                <Image
                    src="/logo-main-white.svg"
                    alt="TGE Background"
                    width={1000}
                    height={300}
                    className="w-full h-auto brightness-0"
                    priority
                />
            </div>

            {/* Background Video (Layer 1) - Cropped to hide YouTube UI */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none" data-animate="parallax">
                <style>{`
                    @keyframes videoFadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                    .video-fade-in {
                        opacity: 0;
                        animation: videoFadeIn 1s ease-out forwards;
                        animation-delay: 2s;
                    }
                `}</style>
                <iframe
                    src="https://www.youtube.com/embed/1ap0baidLVo?autoplay=1&mute=1&controls=0&loop=1&playlist=1ap0baidLVo&end=38&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1&showinfo=0&fs=0&cc_load_policy=0"
                    className="absolute top-1/2 left-1/2 w-[140vw] h-[78.75vw] min-h-[120vh] min-w-[213.33vh] -translate-x-1/2 -translate-y-1/2 scale-150 object-cover pointer-events-none video-fade-in"
                    allow="autoplay; encrypted-media"
                    title="Hero Video"
                />
            </div>

            {/* Premium Overlay (Layer 2) - Darker Gradient for Contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 z-10 pointer-events-none" />

            {/* Main Content (Layer 3) */}
            <div className="relative z-20 flex flex-col items-center justify-center text-center px-4 max-w-4xl mx-auto mt-12">

                {/* Kicker Micro-line */}
                {kicker && (
                    <span className="block text-xs font-bold uppercase tracking-[0.3em] text-white/80 mb-6" data-animate="text">
                        {kicker}
                    </span>
                )}

                {/* Headline: Mask & Skew Reveal - Slightly Reduced Size */}
                <h1 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tight leading-[0.9] mb-8" data-animate="text">
                    {heading}
                </h1>

                {/* Subheadline: Staggered Reveal */}
                {subheading && (
                    <p className="text-sm md:text-base tracking-wide font-medium text-white/90 mb-10 max-w-md mx-auto leading-relaxed">
                        {subheading}
                    </p>
                )}

                {/* CTAs: Reveal Only */}
                <div className="flex flex-col sm:flex-row items-center gap-6 md:gap-8">
                    <Button
                        asChild
                        href={ctaLink}
                        size="lg"
                        className="rounded-full h-12 px-8 text-sm font-bold bg-white text-zinc-900 hover:bg-zinc-100 border-none min-w-[160px]"
                        data-animate="button"
                    >
                        <span>{ctaText}</span>
                    </Button>

                    <Button
                        asChild
                        href="/about"
                        variant="link"
                        className="text-white hover:text-white/80 p-0 h-auto font-medium text-sm underline decoration-1 underline-offset-4 decoration-white/50 hover:decoration-white"
                        data-animate="button"
                    >
                        <span>About Us</span>
                    </Button>
                </div>
            </div>
        </section>
    );
}
