import { METAFIELD_LABELS } from '../in-stock-rods/product-detail/metafieldLabels';
import CartIcon from '@/components/ui/CartIcon';

export default function ReelSpecsAndCta({
	specs,
	descriptionHtml,
	availableForSale,
}) {
	return (
		<div>
			{specs.length > 0 && (
				<div className='space-y-1'>
					{specs.map(([key, value]) => (
						<p className='text-paragraph-sm' key={key}>
							<span className='font-[700]'>
								{METAFIELD_LABELS[key] ?? key}:
							</span>{' '}
							{value}
						</p>
					))}
				</div>
			)}

			<button
				className='mt-1 mb-2.5 lg:mb-2 py-0.75 px-1.25 bg-primary text-white rounded inline-flex items-center gap-[0.625rem]'
				type='button'
				disabled={!availableForSale}
			>
				Add to cart
				<CartIcon />
			</button>

			<div
				className='space-y-1 text-paragraph reel-description'
				dangerouslySetInnerHTML={{ __html: descriptionHtml }}
			/>
		</div>
	);
}
