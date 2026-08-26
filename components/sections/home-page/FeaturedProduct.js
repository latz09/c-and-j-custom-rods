import Image from 'next/image';
import Link from 'next/link';
import ButtonLink from '@/components/ui/ButtonLink';

const CATEGORY_PATHS = {
	rods: '/shop/rods',
	reels: '/shop/reels',
	apparel: '/shop/apparel',
};

const IMAGE_HOVER_CLASSES = 'object-contain p-0.25 transition-all duration-500';

const FeaturedProduct = ({ featuredProduct, data }) => {
	const featuredProductPath = featuredProduct
		? `${CATEGORY_PATHS[data?.featuredProduct?.category] ?? '/shop/rods'}/${featuredProduct.handle}`
		: null;

	if (!featuredProduct) return null;

	const galleryImages = featuredProduct.images?.edges?.map((e) => e.node) ?? [];
	const primaryImage = featuredProduct.featuredImage ?? galleryImages[0];
	const hoverImage = galleryImages.find((img) => img.url !== primaryImage?.url);

	return (
		<div className='bg-dark'>
			<div className='section-x-padding flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-6 group'>
				<h2 className='text-light mt-3.5 lg:hidden order-1'>{data?.eyebrow}</h2>

				<Link
					href={featuredProductPath}
					className='order-2 lg:order-1 w-full lg:basis-[50%] lg:shrink-0 relative overflow-hidden flex items-center justify-center aspect-video bg-gradient-to-b from-[#c4c4c4] to-[#383838] rounded border border-light'
				>
					<div className='relative w-[100%] shrink-0 aspect-video'>
						{primaryImage?.url && (
							<Image
								src={primaryImage.url}
								alt={primaryImage.altText || featuredProduct.title}
								fill
								sizes='50vw'
								className={`${IMAGE_HOVER_CLASSES} ${hoverImage ? 'group-hover:opacity-0' : ''}`}
							/>
						)}

						{hoverImage && (
							<Image
								src={hoverImage.url}
								alt={hoverImage.altText || featuredProduct.title}
								fill
								sizes='50vw'
								className={`absolute inset-0 opacity-0 group-hover:opacity-100 ${IMAGE_HOVER_CLASSES}`}
							/>
						)}
					</div>
				</Link>

				<div className='order-3 lg:order-2 flex-1'>
					<h2 className='text-light lg:mb-3.5 hidden lg:block'>{data?.eyebrow}</h2>
					<h3 className='text-light mb-1.5'>{featuredProduct.title}</h3>
					<p className='text-light text-paragraph-lg mb-2.5'>
						{featuredProduct.metafields?.short_description ||
							featuredProduct.description}
					</p>
					<ButtonLink
						href={featuredProductPath}
						variant='primary-on-dark'
					>{`View ${featuredProduct.title}`}</ButtonLink>
				</div>
			</div>
		</div>
	);
};

export default FeaturedProduct;