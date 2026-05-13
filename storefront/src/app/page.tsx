// ... imports
import { Hero } from "@/components/modules/Hero";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/modules/ProductCard";
import { Newsletter } from "@/components/modules/Newsletter";
import { WhyTGE } from "@/components/modules/WhyTGE";
import { NeedHelp } from "@/components/modules/NeedHelp";
import { CollectionSlider } from "@/components/modules/CollectionSlider";
import { ProductSlider } from "@/components/modules/ProductSlider";
import { shopifyFetch } from "@/lib/shopify";
import { getProductsQuery, getCollectionsQuery } from "@/lib/shopify/queries";

// Revalidate frequently to see changes immediately
export const revalidate = 10;

export default async function Home() {
  let products = [];
  let collections = [];

  try {
    const [productsRes, collectionsRes] = await Promise.all([
      shopifyFetch<{ products: { edges: any[] } }>({
        query: getProductsQuery,
        variables: {
          sortKey: 'CREATED_AT',
          reverse: true
        }
      }),
      shopifyFetch<{ collections: { edges: any[] } }>({
        query: getCollectionsQuery
      })
    ]);

    products = productsRes?.products?.edges?.map((edge) => edge.node) || [];
    collections = collectionsRes?.collections?.edges?.map((edge) => edge.node) || [];
  } catch (error) {
    console.error("Failed to fetch home data:", error);
  }

  // Auto-filter collections (Excluding Men and Women since they are featured in the video section)
  const displayCollections = collections.filter(c => 
    !["men", "women"].includes(c.handle)
  );

  return (
    <main className="min-h-screen bg-zinc-50 pb-20">
      <Hero
        kicker="ENGINEERED DAILYWEAR"
        heading="DAILYWEAR, REDEFINED."
        subheading="Built for long hours. Designed for repeat wear."
      />

      {/* SECTION 2: EDITORIAL CATEGORIES */}
      <section className="mx-auto max-w-[1400px] px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-animate="grid">

          {/* Men's Editorial Card */}
          <Link href="/collections/men" className="group relative h-[400px] md:h-[500px] w-full overflow-hidden rounded-[16px] bg-zinc-100 block">
            <video
              src="https://www.pexels.com/download/video/8941276/"
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-700" />

            <div className="absolute bottom-10 left-10 text-white z-10">
              <span className="block text-[10px] font-bold uppercase tracking-[0.2em] opacity-80 mb-2">
                Collections
              </span>
              <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-2">
                Men
              </h2>
              <p className="text-sm font-medium tracking-wide opacity-90">
                Refined Utility
              </p>
            </div>
          </Link>

          {/* Women's Editorial Card */}
          <Link href="/collections/women" className="group relative h-[400px] md:h-[500px] w-full overflow-hidden rounded-[16px] bg-zinc-100 block">
            <video
              src="https://www.pexels.com/download/video/7644232/"
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-700" />

            <div className="absolute bottom-10 left-10 text-white z-10">
              <span className="block text-[10px] font-bold uppercase tracking-[0.2em] opacity-80 mb-2">
                Collections
              </span>
              <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-2">
                Women
              </h2>
              <p className="text-sm font-medium tracking-wide opacity-90">
                Modern Silhouette
              </p>
            </div>
          </Link>

        </div>
      </section>

      {/* SECTION 3: SHOP BY CATEGORY - DYNAMIC SLIDER */}
      <CollectionSlider 
        title="Shop by Category" 
        collections={displayCollections} 
      />

      {/* SECTION 4: TRENDING NOW - SLIDER */}
      <ProductSlider title="Trending Now" products={products.slice(0, 10)} />

      {/* SECTION 4.5: NEW ARRIVALS - SLIDER */}
      <ProductSlider title="New Arrivals" products={products.slice(10, 20)} />

      {/* SECTION 5: FEATURED EDITORIAL */}
      <section className="mx-auto max-w-[1400px] px-4 py-32">
        <Link href="/collections/weekend-edit" className="block relative w-full h-[500px] md:h-[650px] rounded-2xl overflow-hidden group" data-animate="parallax">
          {/* Background Video for Editorial - Cropped to hide UI */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
            <style>{`
              @keyframes videoFadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
              }
              .video-fade-in {
                opacity: 0;
                animation: videoFadeIn 1s ease-out forwards;
                animation-delay: 2.5s;
              }
            `}</style>
            <iframe
              src="https://www.youtube.com/embed/pwVJizpCuDQ?autoplay=1&mute=1&controls=0&loop=1&playlist=pwVJizpCuDQ&start=10&end=67&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1&showinfo=0&fs=0&cc_load_policy=0"
              className="absolute top-1/2 left-1/2 w-[140vw] h-[78.75vw] min-h-[120vh] min-w-[213.33vh] -translate-x-1/2 -translate-y-1/2 scale-150 object-cover pointer-events-none video-fade-in"
              allow="autoplay; encrypted-media"
              title="Editorial Video"
            />
          </div>
          {/* Functional gradient for text readability without heavy aesthetic overlay */}
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/40 to-transparent transition-opacity duration-700" />

          <div className="absolute bottom-12 left-8 md:left-12 max-w-xl text-white">
            <span className="block text-xs font-bold uppercase tracking-[0.2em] mb-4 opacity-90">
              Editorial
            </span>
            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tight mb-4 text-white" data-animate="text">
              Summer Edit
            </h2>
            <p className="text-lg md:text-xl font-medium text-white/90 leading-relaxed mb-8 max-w-md">
              Effortless outlines for the season. Curated for comfort without compromising style.
            </p>
            <span className="inline-block text-sm font-bold uppercase tracking-widest border-b border-white pb-1 group-hover:text-white/80 group-hover:border-white/80 transition-all">
              View Edit
            </span>
          </div>
        </Link>
      </section>

      {/* SECTION 6: THE EDITORIAL LOOKBOOK */}
      <section className="mx-auto max-w-[1400px] px-4 py-32 border-t border-zinc-100">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-center">
          {/* Editorial Image */}
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[4px] bg-zinc-100" data-animate="parallax">
            <Image
              src="https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?q=80&w=1200&auto=format&fit=crop"
              alt="Editorial Look"
              fill
              className="object-cover grayscale hover:grayscale-0 transition-all duration-1000"
            />
          </div>

          {/* Look Details - Quiet Commerce */}
          <div className="flex flex-col gap-12">
            <div>
              <span className="text-zinc-400 font-bold uppercase tracking-[0.2em] text-xs mb-4 block">
                Editorial 001
              </span>
              <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-zinc-900 mb-6 leading-[0.9]" data-animate="text">
                The City Roamer
              </h2>
              <p className="text-zinc-500 text-lg leading-relaxed max-w-md font-medium">
                Navigating the concrete jungle requires a uniform that adapts.
                Structured layers meet technical fabrics.
              </p>
            </div>

            <div className="space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-900 border-b border-zinc-200 pb-2 max-w-[200px]">
                Shop the Look
              </h3>
            <div className="grid grid-cols-2 gap-8" data-animate="grid">
                {products.length > 0 ? (() => {
                  const jacketProducts = products.filter((p: any) => 
                    p.tags?.some((tag: string) => tag.toLowerCase().includes('jacket'))
                  );
                  const displayProducts = jacketProducts.length > 0 ? jacketProducts.slice(0, 2) : products.slice(0, 2);
                  
                  return displayProducts.map((product: any) => {
                    const img = product.featuredImage?.url || product.images?.edges?.[0]?.node?.url;
                    const price = parseFloat(product.priceRange?.minVariantPrice?.amount || "0");
                    const currency = product.priceRange?.minVariantPrice?.currencyCode || "INR";
                    const formattedPrice = new Intl.NumberFormat('en-IN', { style: 'currency', currency }).format(price);

                    return (
                      <Link key={product.id} href={`/products/${product.handle}`} className="group block">
                        <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-zinc-100 mb-4 opacity-100 group-hover:opacity-90 transition-opacity">
                          {img ? (
                            <Image src={img} alt={product.title} fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full bg-zinc-200 flex items-center justify-center text-zinc-400">No Image</div>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-zinc-900 group-hover:underline underline-offset-4 decoration-1 line-clamp-1">{product.title}</p>
                          <p className="text-xs text-zinc-400 mt-1">{formattedPrice}</p>
                        </div>
                      </Link>
                    );
                  });
                })() : (
                  <div className="col-span-2 py-10 text-center text-zinc-400 italic">
                    Add products to your store to see them here.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: SEEN ON YOU (CULTURAL GALLERY) */}
      <section className="mx-auto max-w-[1400px] px-4 py-32">
        <div className="flex flex-col items-start mb-16">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 mb-2">The Community</span>
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-zinc-900" data-animate="text">Seen on You</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8" data-animate="grid">
          {[
            { type: 'video', src: 'https://videos.pexels.com/video-files/9257197/9257197-uhd_1440_2732_25fps.mp4' },
            { type: 'video', src: 'https://www.pexels.com/download/video/32993052/' },
            { type: 'video', src: 'https://videos.pexels.com/video-files/7760660/7760660-uhd_1440_2732_25fps.mp4' },
            { type: 'video', src: 'https://videos.pexels.com/video-files/8431987/8431987-uhd_1440_2732_25fps.mp4' }
          ].map((item: any, i) => (
            <div key={i} className={`relative aspect-[3/4] overflow-hidden bg-zinc-100 group ${i % 2 === 1 ? 'md:translate-y-12' : ''}`}>
              {item.type === 'video' ? (
                <video
                  src={item.src}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <Image
                  src={item.src}
                  alt={`Community Post ${i + 1}`}
                  fill
                  className="object-cover"
                />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 8: WHY TGE */}
      <WhyTGE />

      {/* SECTION 9: NEED HELP */}
      <NeedHelp />

      {/* SECTION 10: NEWSLETTER (Moved to bottom) */}
      <Newsletter />

    </main>
  );
}
