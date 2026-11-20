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
	updateCartLinesAction,
	removeCartLinesAction,
} from '@/app/actions/cart';
import { addBuildToCart } from '@/app/actions/builder';

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

	// config: the builder picks. The server validates and prices it, then adds both build lines.
	const addBuild = useCallback(
		(config) => run(() => addBuildToCart(config), { openOnSuccess: true }),
		[run],
	);

	const updateLine = useCallback(
		(lineId, quantity) => run(() => updateCartLineAction(lineId, quantity)),
		[run],
	);

	// Same quantity on several lines at once (a custom build's two lines).
	const updateLines = useCallback(
		(lineIds, quantity) => run(() => updateCartLinesAction(lineIds, quantity)),
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
			addBuild,
			updateLine,
			updateLines,
			removeLines,
		}),
		[cart, isOpen, isPending, error, openCart, closeCart, addLines, addBuild, updateLine, updateLines, removeLines],
	);

	return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
	const ctx = useContext(CartContext);
	if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
	return ctx;
}
