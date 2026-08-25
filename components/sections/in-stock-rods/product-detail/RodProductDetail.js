import ProductTopInfo from './ProductTopInfo';
import ProductGallery from './ProductGallery';
import ProductSpecsAndCta from './ProductSpecsAndCta';
import SeriesTestimonial from './SeriesTestimonial';

const RodProductDetail = ({
	product,
	testimonial,
	seriesInfo,
	seriesTag,
	ctaBanner,
}) => {
	const {
		title,
		description,
		descriptionHtml,
		tags,
		availableForSale,
		featuredImage,
		images,
		priceRange,
		metafields,
		variants,
	} = product;

	const price = priceRange.minVariantPrice.amount;
	const { short_description: shortDescription, ...specFields } =
		metafields ?? {};
	const specs = Object.entries(specFields).filter(([, value]) => value);

	const galleryImages =
		images?.edges?.map((e) => e.node) ?? (featuredImage ? [featuredImage] : []);
	const productVariants = variants?.edges?.map((e) => e.node) ?? [];

	return (
		<div className='pb-5 lg:pb-8.75'>
			<div className='mt-1 lg:mt-2 section-x-padding grid lg:grid-cols-2 lg:gap-5.5 lg:items-start'>
				<div className='order-1 lg:order-2 flex flex-col'>
					<ProductTopInfo
						seriesInfo={seriesInfo}
						seriesTag={seriesTag}
						title={title}
						price={price}
						availableForSale={availableForSale}
					/>

					<div className='lg:hidden'>
						<ProductGallery images={galleryImages} title={title} />
					</div>

					<ProductSpecsAndCta
						specs={specs}
						shortDescription={shortDescription}
						descriptionHtml={descriptionHtml}
						availableForSale={availableForSale}
					/>
				</div>

				<div className='hidden lg:block lg:order-1 lg:sticky lg:top-[13vh] lg:self-start'>
					<ProductGallery images={galleryImages} title={title} />
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

			{testimonial && (
	<SeriesTestimonial data={testimonial} seriesName={seriesInfo?.name ?? seriesTag} />
)}
{/* 
			{ctaBanner && (
				<div>
					<h3>{ctaBanner.heading}</h3>
				</div>
			)} */}
		</div>
	);
};

export default RodProductDetail;