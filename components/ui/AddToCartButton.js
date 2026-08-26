'use client';

import CartIcon from '@/components/ui/CartIcon';

export default function AddToCartButton({
	variantId,
	quantity = 1,
	disabled = false,
	onAddToCart,
	className = '',
}) {
	const handleClick = () => {
		if (onAddToCart) {
			onAddToCart({ variantId, quantity });
			return;
		}

		console.log('Add to cart (not yet wired):', { variantId, quantity });
	};

	return (
		<button
			type='button'
			onClick={handleClick}
			disabled={disabled}
			className={`py-0.75 px-1.25 bg-primary hover:bg-dark transition duration-300 group text-white rounded inline-flex items-center gap-[0.625rem] disabled:bg-accent/80 disabled:text-primary/75 disabled:font-[700] disabled:cursor-not-allowed ${className}`}
		>
			{disabled ? 'Out of stock' : 'Add to cart'}
			{!disabled && (
				<CartIcon className='group-hover:text-secondary transition duration-700 group-hover:translate-x-[0.4rem]' />
			)}
		</button>
	);
}