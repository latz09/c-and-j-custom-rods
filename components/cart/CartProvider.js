'use client';

import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
	useTransition,
} from 'react';
import {
	getCartAction,
	addToCartAction,
	updateCartLineAction,
	removeCartLinesAction,
} from '@/app/actions/cart';

const CartContext = createContext(null);

export function CartProvider({ children }) {
	const [cart, setCart] = useState(null);
	const [isOpen, setIsOpen] = useState(false);
	const [error, setError] = useState(null);
	const [isPending, startTransition] = useTransition();

	// Load the existing cart once on mount.
	useEffect(() => {
		let active = true;
		getCartAction().then((res) => {
			if (active && res.cart) setCart(res.cart);
		});
		return () => {
			active = false;
		};
	}, []);

	const openCart = useCallback(() => setIsOpen(true), []);
	const closeCart = useCallback(() => setIsOpen(false), []);

	// Runs a server action, stores the returned cart, reports success.
	const run = useCallback(
		(action, { openOnSuccess = false } = {}) =>
			new Promise((resolve) => {
				startTransition(async () => {
					setError(null);
					const res = await action();
					if (res.error) {
						setError(res.error);
						resolve(false);
						return;
					}
					setCart(res.cart);
					if (openOnSuccess) setIsOpen(true);
					resolve(true);
				});
			}),
		[],
	);

	// lines: [{ variantId, quantity?, attributes? }]
	const addLines = useCallback(
		(lines) => run(() => addToCartAction(lines), { openOnSuccess: true }),
		[run],
	);

	const updateLine = useCallback(
		(lineId, quantity) => run(() => updateCartLineAction(lineId, quantity)),
		[run],
	);

	const removeLines = useCallback(
		(lineIds) => run(() => removeCartLinesAction(lineIds)),
		[run],
	);

	const value = useMemo(
		() => ({
			cart,
			lines: cart?.lines?.nodes || [],
			totalQuantity: cart?.totalQuantity || 0,
			isOpen,
			isPending,
			error,
			openCart,
			closeCart,
			addLines,
			updateLine,
			removeLines,
		}),
		[cart, isOpen, isPending, error, openCart, closeCart, addLines, updateLine, removeLines],
	);

	return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
	const ctx = useContext(CartContext);
	if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
	return ctx;
}
