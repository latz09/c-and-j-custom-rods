import { METAFIELD_LABELS, SPEC_DISPLAY_ORDER } from './metafieldLabels';
import AddToCartButton from '@/components/ui/AddToCartButton';

export default function ProductSpecsAndCta({
	specs,
	seriesName,
	shortDescription,
	descriptionHtml,
	availableForSale,
	variantId,
}) {
	const orderedSpecs = [...specs].sort(
		([keyA], [keyB]) =>
			SPEC_DISPLAY_ORDER.indexOf(keyA) - SPEC_DISPLAY_ORDER.indexOf(keyB),
	);

	return (
		<div>
			{(seriesName || orderedSpecs.length > 0) && (
				<div className='grid grid-cols-1 lg:grid-cols-2 gap-x-2 gap-0.5 lg:gap-y-0.75'>
					{seriesName && (
						<p className='text-paragraph-sm'>
							<span className='font-[700]'>Series:</span> {seriesName}
						</p>
					)}

					{orderedSpecs.map(([key, value]) => (
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
				className='space-y-1 text-paragraph-sm'
				dangerouslySetInnerHTML={{ __html: descriptionHtml }}
			/>
		</div>
	);
}