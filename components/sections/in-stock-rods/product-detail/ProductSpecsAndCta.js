import { METAFIELD_LABELS } from './metafieldLabels';
import CartIcon from '@/components/ui/CartIcon';

export default function ProductSpecsAndCta({ specs, shortDescription, descriptionHtml, availableForSale }) {
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

			<button
				className='mt-1 mb-2.5 lg:mb-2 py-0.75 px-1.25 bg-primary text-white rounded inline-flex items-center gap-[0.625rem]'
				type='button'
				disabled={!availableForSale}
			>
				Add to cart
				<CartIcon />
			</button>

			{shortDescription && <p className='text-paragraph-lg mb-1'>{shortDescription}c</p>}

			<div className='space-y-1 text-paragraph' dangerouslySetInnerHTML={{ __html: descriptionHtml }} />
		</div>
	);
}