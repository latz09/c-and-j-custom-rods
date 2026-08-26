import { METAFIELD_LABELS } from '../in-stock-rods/product-detail/metafieldLabels';
import AddToCartButton from '@/components/ui/AddToCartButton';

export default function ReelSpecsAndCta({
	specs,
	shortDescription,
	descriptionHtml,
	availableForSale,
	variantId,
}) {
	return (
		<div>
			{specs.length > 0 && (
				<div className='grid grid-cols-1 lg:grid-cols-2 gap-x-2 gap-0.5 lg:gap-y-0.75'>
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

			<AddToCartButton
				variantId={variantId}
				disabled={!availableForSale}
				className='mt-1.5 mb-2.5 lg:mb-2'
			/>

			{shortDescription && (
				<p className='text-paragraph-lg mb-1'>{shortDescription}</p>
			)}

			<div
				className='space-y-1 text-paragraph-sm reel-description'
				dangerouslySetInnerHTML={{ __html: descriptionHtml }}
			/>
		</div>
	);
}