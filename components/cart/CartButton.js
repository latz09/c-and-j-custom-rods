'use client';

import CartIcon from '@/components/ui/CartIcon';
import { useCart } from '@/components/cart/CartProvider';

// Nav cart button. Colors follow the nav (light icon on dark nav).
export default function CartButton({ isDark = false, className = '' }) {
	const { totalQuantity, openCart } = useCart();

	return (
		<button
			type='button'
			onClick={openCart}
			aria-label={`Open cart, ${totalQuantity} ${totalQuantity === 1 ? 'item' : 'items'}`}
			className={`relative inline-flex items-center p-0.5 ${
				isDark ? 'text-light' : 'text-dark'
			} ${className}`}
		>
			<CartIcon />
			{totalQuantity > 0 && (
				<span className='absolute -top-0.25 -right-0.25 min-w-1 h-1 px-0.25 rounded-full bg-primary text-white text-[0.75rem] leading-none inline-flex items-center justify-center'>
					{totalQuantity}
				</span>
			)}
		</button>
	);
}
