import { METAFIELD_LABELS } from '../in-stock-rods/product-detail/metafieldLabels';
import AddToCartButton from '@/components/ui/AddToCartButton';

export default function ApparelSpecsAndCta({ specs, descriptionHtml, availableForSale, variantId }) {
	return (
		<div>
			{specs.length > 0 && (
				<div className='space-y-1'>
					{specs.map(([key, value]) => (
						<p className='text-paragraph-sm' key={key}>
							<span className='font-[700]'>{METAFIELD_LABELS[key] ?? key}:</span> {value}
						</p>
					))}
				</div>
			)}

			<AddToCartButton
				variantId={variantId}
				disabled={!availableForSale}
				className='mt-0.75 mb-2.5 lg:mb-2'
			/>

			<div className='space-y-1 text-paragraph' dangerouslySetInnerHTML={{ __html: descriptionHtml }} />
		</div>
	);
}