'use client';

import Image from 'next/image';
import { useCart } from '@/components/cart/CartProvider';
import { formatMoney, visibleAttributes } from '@/lib/cart/cartHelpers';

// One custom rod build: the Custom Rod Build line plus the optional Build Options line.
// Both carry the same specs and quantity, so show one item, and change both lines together.
export default function CartBuildItem({ lines }) {
	const { updateLines, removeLines, isPending } = useCart();

	const baseLine =
		lines.find((l) => l.merchandise?.product?.handle === 'custom-rod-build') || lines[0];
	const quantity = baseLine.quantity;
	const lineIds = lines.map((l) => l.id);
	const image = baseLine.merchandise?.image;
	const specs = visibleAttributes(baseLine.attributes);
	const series = specs.find((a) => a.key === 'Series')?.value;
	const rows = specs.filter((a) => a.key !== 'Series');

	const totalAmount = lines.reduce((sum, l) => sum + Number(l.cost?.totalAmount?.amount || 0), 0);
	const currencyCode = baseLine.cost?.totalAmount?.currencyCode;

	return (
		<li className='flex gap-1 py-1 border-b border-dark/10'>
			<div className='relative w-6 h-6 shrink-0 bg-light'>
				{image?.url && (
					<Image
						src={image.url}
						alt={image.altText || series || 'Custom rod'}
						fill
						sizes='96px'
						className='object-cover'
					/>
				)}
			</div>

			<div className='flex-1 min-w-0'>
				<p className='font-[500]'>Custom {series || 'Rod'}</p>

				{rows.map((a) => (
					<p key={a.key} className='text-paragraph'>
						{a.key}: {a.value}
					</p>
				))}

				<div className='flex items-center justify-between mt-0.5'>
					<div className='inline-flex items-center gap-0.5'>
						<button
							type='button'
							aria-label='Decrease quantity'
							disabled={isPending}
							onClick={() => updateLines(lineIds, quantity - 1)}
							className='w-1.5 h-1.5 border border-dark/30 rounded disabled:opacity-50'
						>
							-
						</button>
						<span aria-live='polite'>{quantity}</span>
						<button
							type='button'
							aria-label='Increase quantity'
							disabled={isPending}
							onClick={() => updateLines(lineIds, quantity + 1)}
							className='w-1.5 h-1.5 border border-dark/30 rounded disabled:opacity-50'
						>
							+
						</button>
					</div>

					<span>{formatMoney({ amount: totalAmount, currencyCode })}</span>
				</div>

				<button
					type='button'
					disabled={isPending}
					onClick={() => removeLines(lineIds)}
					className='mt-0.5 text-paragraph underline disabled:opacity-50'
				>
					Remove
				</button>
			</div>
		</li>
	);
}
