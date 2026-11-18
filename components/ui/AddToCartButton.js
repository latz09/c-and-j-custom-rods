'use client';

import CartIcon from '@/components/ui/CartIcon';
import { useCart } from '@/components/cart/CartProvider';

export default function AddToCartButton({
	variantId,
	quantity = 1,
	disabled = false,
	onAddToCart,
	className = '',
}) {
	const { addLines, isPending } = useCart();

	const handleClick = async () => {
		if (onAddToCart) {
			onAddToCart({ variantId, quantity });
			return;
		}
		// addLines opens the drawer on success and surfaces errors in it.
		await addLines([{ variantId, quantity }]);
	};

	const unavailable = disabled || !variantId;

	return (
		<button
			type='button'
			onClick={handleClick}
			disabled={unavailable || isPending}
			className={`py-0.75 px-1.25 bg-primary hover:bg-dark transition duration-300 group text-white rounded inline-flex items-center gap-[0.625rem] disabled:bg-accent/80 disabled:text-primary/75 disabled:font-[700] disabled:cursor-not-allowed ${className}`}
		>
			{disabled ? 'Out of stock' : isPending ? 'Adding...' : 'Add to cart'}
			{!disabled && !isPending && (
				<CartIcon className='group-hover:text-secondary transition duration-700 group-hover:translate-x-[0.4rem]' />
			)}
		</button>
	);
}
