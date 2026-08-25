import ReelTopInfo from './ReelTopInfo';
import ReelImage from './ReelImage';
import ReelSpecsAndCta from './ReelSpecAndCta';
import ReelGrid from './ReelGrid';

const ReelProductDetail = ({ product, allReels = [] }) => {
	const {
		title,
		descriptionHtml,
		availableForSale,
		featuredImage,
		priceRange,
		metafields,
		variants,
	} = product;

	const price = priceRange.minVariantPrice.amount;
	const { short_description, ...specFields } = metafields ?? {};
	const specs = Object.entries(specFields).filter(([, value]) => value);

	const productVariants = variants?.edges?.map((e) => e.node) ?? [];

	return (
		<div className='pb-5 lg:pb-8.75'>
			<div className='mt-1 lg:mt-2 section-x-padding grid lg:grid-cols-2 lg:gap-5.5 lg:items-start'>
				<div className='order-1 lg:order-2 flex flex-col'>
					<ReelTopInfo
						title={title}
						price={price}
						availableForSale={availableForSale}
					/>

					<div className='mb-2 lg:hidden'>
						<ReelImage image={featuredImage} title={title} />
					</div>

					<ReelSpecsAndCta
						specs={specs}
						descriptionHtml={descriptionHtml}
						availableForSale={availableForSale}
					/>
				</div>

				<div className='hidden lg:block lg:order-1 lg:sticky lg:top-[10vh] lg:self-start'>
					<ReelImage image={featuredImage} title={title} />
				</div>
			</div>

			{productVariants.length > 1 && (
				<div>
					{productVariants.map((v) => (
						<div key={v.id}>
							<p>{v.title}</p>
							<p>${v.price.amount}</p>
							<p>{v.availableForSale ? 'Available' : 'Sold out'}</p>
						</div>
					))}
				</div>
			)}

			{allReels.length > 0 && (
				<div className='section-x-padding mt-5 lg:mt-8.75'>
					<h3 className='mb-2'>More Reels</h3>
					<ReelGrid products={allReels} excludeHandle={product.handle} />
				</div>
			)}
		</div>
	);
};

export default ReelProductDetail;