"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { shopifyFetch } from "@/lib/shopify";
import { getOrderQuery } from "@/lib/shopify/queries";
import { Button } from "@/components/ui/Button";
import { ChevronLeft, Check, Package, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

export default function OrderDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const { addItem } = useCart();
    
    const [order, setOrder] = useState<any>(null);
    const [customerEmail, setCustomerEmail] = useState<string>("");
    const [isLoading, setIsLoading] = useState(true);
    const [isAddingToCart, setIsAddingToCart] = useState(false);

    useEffect(() => {
        const fetchOrder = async () => {
            const token = localStorage.getItem("shopify_customer_token");
            if (!token) {
                router.push("/login");
                return;
            }

            try {
                const decodedId = decodeURIComponent(params.id as string);
                
                const res = await shopifyFetch<any>({
                    query: getOrderQuery,
                    variables: {
                        customerAccessToken: token,
                        orderId: `name:${decodedId}`
                    },
                    cache: 'no-store'
                });

                if (res?.customer) {
                    setCustomerEmail(res.customer.email);
                    const orderData = res.customer.orders?.edges?.[0]?.node;
                    if (orderData) {
                        setOrder(orderData);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch order details", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrder();
    }, [params.id, router]);

    const handleBuyAgain = async () => {
        if (!order) return;
        setIsAddingToCart(true);

        const itemsToAdd = order.lineItems.edges
            .filter((edge: any) => edge.node.variant?.availableForSale)
            .map((edge: any) => ({
                variantId: edge.node.variant.id,
                quantity: edge.node.quantity
            }));

        if (itemsToAdd.length === 0) {
            toast.error("No items from this order are currently in stock.");
            setIsAddingToCart(false);
            return;
        }

        try {
            // Add items sequentially to avoid cart conflicts
            for (const item of itemsToAdd) {
                await addItem(item);
            }
            toast.success("Items added to your cart!");
        } catch (error) {
            console.error("Buy again failed", error);
            toast.error("Failed to add some items to cart.");
        } finally {
            setIsAddingToCart(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#fbfbfb]">
                <div className="w-8 h-8 border-2 border-zinc-200 border-t-zinc-800 rounded-full animate-spin" />
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen pt-40 text-center bg-[#fbfbfb]">
                <h2 className="text-xl font-bold text-zinc-900 mb-4">Order Not Found</h2>
                <Button asChild variant="link">
                    <Link href="/account">Back to Account</Link>
                </Button>
            </div>
        );
    }

    const orderDate = new Date(order.processedAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric' });

    return (
        <div className="min-h-screen bg-[#fbfbfb] pt-32 pb-20 px-4 md:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
                    <div className="flex items-center gap-4">
                        <Link href="/account" className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
                            <ChevronLeft className="w-6 h-6" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-zinc-900">Order {order.name}</h1>
                            <p className="text-sm text-zinc-500">Confirmed {orderDate} from order {order.name}</p>
                        </div>
                    </div>
                    <Button 
                        onClick={handleBuyAgain}
                        disabled={isAddingToCart}
                        variant="outline" 
                        className="rounded-xl border-zinc-200 text-sm font-semibold h-11 px-6 hover:bg-zinc-50 flex items-center gap-2"
                    >
                        {isAddingToCart && <Loader2 className="w-4 h-4 animate-spin" />}
                        {isAddingToCart ? "Adding..." : "Buy again"}
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left Column */}
                    <div className="lg:col-span-7 space-y-6">
                        {/* Confirmed Card */}
                        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
                            <div className="flex gap-4">
                                <div className="mt-1">
                                    <Check className="w-5 h-5 text-zinc-500" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-zinc-900 mb-1">Confirmed</h3>
                                    <p className="text-sm text-zinc-600 mb-1">We&apos;re preparing these items for shipping.</p>
                                    <p className="text-xs text-zinc-400">{orderDate}</p>
                                </div>
                            </div>
                        </div>

                        {/* Order Details Grid */}
                        <div className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                                <div>
                                    <h4 className="font-bold text-zinc-900 mb-4 text-sm">Contact information</h4>
                                    <p className="text-sm text-zinc-600">{customerEmail}</p>
                                </div>
                                <div>
                                    <h4 className="font-bold text-zinc-900 mb-4 text-sm">Payment</h4>
                                    <p className="text-sm text-zinc-600 mb-1">Manual</p>
                                    <p className="text-sm text-zinc-400">
                                        {new Intl.NumberFormat('en-IN', { style: 'currency', currency: order.totalPrice.currencyCode }).format(order.totalPrice.amount)} {order.totalPrice.currencyCode}
                                    </p>
                                    <p className="text-sm text-zinc-400">{orderDate}</p>
                                </div>
                                <div>
                                    <h4 className="font-bold text-zinc-900 mb-4 text-sm">Shipping address</h4>
                                    {order.shippingAddress ? (
                                        <div className="text-sm text-zinc-600 space-y-0.5">
                                            <p>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                                            <p>{order.shippingAddress.address1}</p>
                                            {order.shippingAddress.address2 && <p>{order.shippingAddress.address2}</p>}
                                            <p>{order.shippingAddress.zip} {order.shippingAddress.city} {order.shippingAddress.province}</p>
                                            <p>{order.shippingAddress.country}</p>
                                        </div>
                                    ) : <p className="text-sm text-zinc-400 italic">No address provided</p>}
                                </div>
                                <div>
                                    <h4 className="font-bold text-zinc-900 mb-4 text-sm">Billing address</h4>
                                    {order.billingAddress ? (
                                        <div className="text-sm text-zinc-600 space-y-0.5">
                                            <p>{order.billingAddress.firstName} {order.billingAddress.lastName}</p>
                                            <p>{order.billingAddress.address1}</p>
                                            <p>{order.billingAddress.zip} {order.billingAddress.city} {order.billingAddress.province}</p>
                                            <p>{order.billingAddress.country}</p>
                                        </div>
                                    ) : (
                                        <div className="text-sm text-zinc-600 space-y-0.5">
                                            <p>{order.shippingAddress?.firstName} {order.shippingAddress?.lastName}</p>
                                            <p>{order.shippingAddress?.address1}</p>
                                            <p>{order.shippingAddress?.zip} {order.shippingAddress?.city} {order.shippingAddress?.province}</p>
                                            <p>{order.shippingAddress?.country}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column (Summary) */}
                    <div className="lg:col-span-5 bg-white p-8 rounded-2xl border border-zinc-200 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
                        <div className="space-y-6 mb-8">
                            {order.lineItems.edges.map((item: any, index: number) => (
                                <div key={item.node.variant?.id || index} className="flex gap-4">
                                    <div className="relative w-[72px] h-20 bg-zinc-50 rounded-xl border border-zinc-100 shrink-0">
                                        {item.node.variant?.image?.url ? (
                                            <Image src={item.node.variant.image.url} alt={item.node.title} fill className="object-cover rounded-xl" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-zinc-200">
                                                <Package className="w-8 h-8" />
                                            </div>
                                        )}
                                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-zinc-900 rounded-full flex items-center justify-center text-[11px] font-bold text-white border-2 border-white">
                                            {item.node.quantity}
                                        </div>
                                    </div>
                                    <div className="flex-1 flex justify-between items-center min-w-0">
                                        <div>
                                            <h4 className="font-bold text-sm text-zinc-900 truncate">{item.node.title}</h4>
                                            {item.node.variant?.title !== "Default Title" && (
                                                <p className="text-xs text-zinc-400 mt-0.5">{item.node.variant?.title}</p>
                                            )}
                                        </div>
                                        <p className="font-bold text-sm text-zinc-900">
                                            {new Intl.NumberFormat('en-IN', {
                                                style: 'currency',
                                                currency: item.node.originalTotalPrice.currencyCode
                                            }).format(item.node.originalTotalPrice.amount)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-3 pt-6 border-t border-zinc-100">
                            <div className="flex justify-between text-sm">
                                <span className="text-zinc-600 font-medium">Subtotal · {order.lineItems.edges.length} items</span>
                                <span className="text-zinc-900 font-bold">
                                    {new Intl.NumberFormat('en-IN', { style: 'currency', currency: order.subtotalPrice.currencyCode }).format(order.subtotalPrice.amount)}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-zinc-600 font-medium">Shipping</span>
                                <span className="text-zinc-900 font-bold">
                                    {parseFloat(order.totalShippingPrice.amount) === 0 ? "Free" : new Intl.NumberFormat('en-IN', { style: 'currency', currency: order.totalShippingPrice.currencyCode }).format(order.totalShippingPrice.amount)}
                                </span>
                            </div>
                            <div className="flex justify-between items-end pt-4 mt-2">
                                <span className="text-lg font-bold text-zinc-900">Total</span>
                                <div className="text-right flex items-baseline gap-2">
                                    <span className="text-xs font-medium text-zinc-400 uppercase tracking-widest">{order.totalPrice.currencyCode}</span>
                                    <span className="text-2xl font-black text-zinc-900">
                                        {new Intl.NumberFormat('en-IN', { style: 'currency', currency: order.totalPrice.currencyCode }).format(order.totalPrice.amount)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
