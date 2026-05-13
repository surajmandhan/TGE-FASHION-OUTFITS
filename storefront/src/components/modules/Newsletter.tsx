"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { toast } from "sonner";
import { Mail } from "lucide-react";

export function Newsletter() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            setEmail("");
            toast.success("Subscribed successfully!", {
                description: "You've been added to our newsletter."
            });
        }, 1000);
    };

    return (
        <section className="mx-auto max-w-[1400px] px-6 py-20 border-t border-zinc-100">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">
                <div className="max-w-md text-center lg:text-left">
                    <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-zinc-50 border border-zinc-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        <span className="text-[10px] uppercase tracking-widest font-bold text-zinc-500">Intel & Updates</span>
                    </div>

                    <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-zinc-900 mb-4">
                        Join the Inner Circle
                    </h2>

                    <p className="text-zinc-500 text-sm leading-relaxed max-w-sm font-medium">
                        Secure access to new drops, archive sales, and design notes. No spam. Pure signal.
                    </p>
                </div>

                <div className="w-full max-w-md">
                    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full">
                        <div className="relative flex-1">
                            <input
                                id="newsletter-email"
                                name="email"
                                type="email"
                                placeholder="ENTER YOUR EMAIL"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full h-12 bg-zinc-50 border border-zinc-200 rounded-lg px-6 placeholder:text-zinc-400 text-zinc-900 font-bold text-xs uppercase tracking-wider focus:border-zinc-900 focus:bg-white focus:outline-none transition-all duration-300"
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="h-12 rounded-lg bg-zinc-900 hover:bg-black text-white font-bold text-[11px] uppercase tracking-widest px-8 transition-all active:scale-95"
                        >
                            {loading ? "AUTHENTICATING..." : "INITIATE"}
                        </Button>
                    </form>
                    <p className="text-zinc-400 text-[10px] uppercase tracking-wider mt-4 font-medium text-center sm:text-left">
                        By joining, you acknowledge our data policies.
                    </p>
                </div>
            </div>
        </section>
    );
}
