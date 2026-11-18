'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/components/cart/CartProvider';
import { formatMoney, getProductUrl, visibleAttributes } from '@/lib/cart/cartHelpers';

export default function CartLineItem({ line }) {
	const { updateLine, removeLines, closeCart, isPending } = useCart();
	const { merchandise: variant, quantity, cost } = line;
	const product = variant?.product;
	const image = variant?.image;
	const url = getProductUrl(product);

	// Single-variant products show "Default Title"; hide it.
	const options = (variant?.selectedOptions || []).filter(
		(o) => o.value !== 'Default Title',
	);
	const attributes = visibleAttributes(line.attributes);
	const discounts = line.discountAllocations || [];

	return (
		<li className='flex gap-1 py-1 border-b border-dark/10'>
			<div className='relative w-6 h-6 shrink-0 bg-light'>
				{image?.url && (
					<Image
						src={image.url}
						alt={image.altText || product?.title || ''}
						fill
						sizes='96px'
						className='object-cover'
					/>
				)}
			</div>

			<div className='flex-1 min-w-0'>
				{url ? (
					<Link
						href={url}
						onClick={closeCart}
						className='block font-[500] hover:underline'
					>
						{product?.title}
					</Link>
				) : (
					<p className='font-[500]'>{product?.title}</p>
				)}

				{options.length > 0 && (
					<p className='text-paragraph-sm'>
						{options.map((o) => o.value).join(' / ')}
					</p>
				)}

				{attributes.map((a) => (
					<p key={a.key} className='text-paragraph-sm'>
						{a.key}: {a.value}
					</p>
				))}

				{discounts.map((d, i) => (
					<p key={i} className='text-paragraph-sm'>
						{d.title || d.code || 'Discount'}: -{formatMoney(d.discountedAmount)}
					</p>
				))}

				<div className='flex items-center justify-between mt-0.5'>
					<div className='inline-flex items-center gap-0.5'>
						<button
							type='button'
							aria-label='Decrease quantity'
							disabled={isPending}
							onClick={() => updateLine(line.id, quantity - 1)}
							className='w-1.5 h-1.5 border border-dark/30 rounded disabled:opacity-50'
						>
							-
						</button>
						<span aria-live='polite'>{quantity}</span>
						<button
							type='button'
							aria-label='Increase quantity'
							disabled={isPending}
							onClick={() => updateLine(line.id, quantity + 1)}
							className='w-1.5 h-1.5 border border-dark/30 rounded disabled:opacity-50'
						>
							+
						</button>
					</div>

					<span>{formatMoney(cost?.totalAmount)}</span>
				</div>

				<button
					type='button'
					disabled={isPending}
					onClick={() => removeLines([line.id])}
					className='mt-0.5 text-paragraph-sm underline disabled:opacity-50'
				>
					Remove
				</button>
			</div>
		</li>
	);
}
