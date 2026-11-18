'use client';

import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useCart } from '@/components/cart/CartProvider';
import CartLineItem from '@/components/cart/CartLineItem';
import { formatMoney, groupCartLines } from '@/lib/cart/cartHelpers';

const EASE = [0.25, 0.46, 0.45, 0.94];

export default function CartDrawer() {
	const { cart, lines, totalQuantity, isOpen, isPending, error, closeCart } = useCart();
	const groups = groupCartLines(lines);

	// Lock page scroll and close on Escape while open.
	useEffect(() => {
		if (!isOpen) return;
		const onKey = (e) => e.key === 'Escape' && closeCart();
		document.addEventListener('keydown', onKey);
		const prev = document.body.style.overflow;
		document.body.style.overflow = 'hidden';
		return () => {
			document.removeEventListener('keydown', onKey);
			document.body.style.overflow = prev;
		};
	}, [isOpen, closeCart]);

	return (
		<AnimatePresence>
			{isOpen && (
				<>
					<motion.div
						key='cart-overlay'
						className='fixed inset-0 bg-dark/50 z-[9998]'
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.3, ease: EASE }}
						onClick={closeCart}
					/>

					<motion.aside
						key='cart-panel'
						role='dialog'
						aria-modal='true'
						aria-label='Shopping cart'
						className='fixed top-0 right-0 h-full w-full max-w-[28rem] bg-white z-[9999] flex flex-col'
						initial={{ x: '100%' }}
						animate={{ x: '0%' }}
						exit={{ x: '100%' }}
						transition={{ duration: 0.4, ease: EASE }}
					>
						<header className='flex items-center justify-between px-1.25 py-1 border-b border-dark/10'>
							<h5>Cart ({totalQuantity})</h5>
							<button type='button' onClick={closeCart} aria-label='Close cart'>
								Close
							</button>
						</header>

						<div className='flex-1 overflow-y-auto px-1.25'>
							{groups.length === 0 ? (
								<div className='py-2'>
									<p>Your cart is empty.</p>
									<Link href='/shop/rods' onClick={closeCart} className='underline'>
										Keep shopping
									</Link>
								</div>
							) : (
								<ul>
									{groups.map((group) =>
										// Multi-line groups are custom builds; Phase 7 renders them as one item.
										group.lines.map((line) => (
											<CartLineItem key={line.id} line={line} />
										)),
									)}
								</ul>
							)}
						</div>

						{groups.length > 0 && (
							<footer className='px-1.25 py-1 border-t border-dark/10'>
								{error && (
									<p role='alert' className='mb-0.5 text-paragraph-sm'>
										{error}
									</p>
								)}
								<div className='flex items-center justify-between mb-0.5'>
									<span>Subtotal</span>
									<span>{formatMoney(cart?.cost?.subtotalAmount)}</span>
								</div>
								<p className='mb-1 text-paragraph-sm'>
									Shipping and taxes calculated at checkout.
								</p>
								<a
									href={cart?.checkoutUrl}
									aria-disabled={isPending}
									className='block text-center py-0.75 px-1.25 bg-primary hover:bg-dark transition duration-300 text-white rounded'
								>
									Checkout
								</a>
							</footer>
						)}
					</motion.aside>
				</>
			)}
		</AnimatePresence>
	);
}
