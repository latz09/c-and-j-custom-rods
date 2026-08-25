import Image from 'next/image';
import Link from 'next/link';
import { Arrow } from '@/components/ui/ButtonLink';

const CTA_CLASSES = 'px-0 text-dark group-hover:text-primary';

// Matches the rodSeriesCard preset's square dimensions for visual
// consistency across both grids.
const CARD_IMAGE_SIZE = 200;

const IMAGE_HOVER_CLASSES =
	'object-cover transition-all duration-500 group-hover:scale-[0.975] group-hover:rotate-6';

function seriesNameForProduct(product, seriesList) {
	const seriesTag = product.tags?.find(
		(t) => t !== 'open-water' && t !== 'ice',
	);
	return seriesList?.find((s) => s.slug === seriesTag)?.name;
}

export default function RodCard({ product, seriesList, index = 0 }) {
	const waterType = product.tags?.includes('ice')
		? 'ice'
		: product.tags?.includes('open-water')
			? 'open-water'
			: null;
	const price = Number(product.priceRange.minVariantPrice.amount);
	const displayName = product.title;
	const seriesName = seriesNameForProduct(product, seriesList);

	const galleryImages = product.images?.edges?.map((e) => e.node) ?? [];
	const primaryImage = product.featuredImage ?? galleryImages[0];
	const hoverImage = galleryImages.find((img) => img.url !== primaryImage?.url);

	return (
		<div
			className='bg-gradient-to-b from-light via-accent/0 to-accent/60 p-1.5 border border-[#D2D2D2] rounded animate-[fade-in-up_0.4s_ease-out_backwards]'
			style={{ animationDelay: `${index * 60}ms` }}
		>
			<Link href={`/shop/rods/${product.handle}`} className='group'>
				<div className='flex flex-row mb-1.25 justify-end gap-0.5 '>
					{seriesName && (
						<span className='rounded-full bg-[#D2D2D2] px-0.75 py-0.25 text-paragraph-sm font-[500] leading-[140%] text-dark'>
							{seriesName}
						</span>
					)}

					{waterType && (
						<span
							className={`rounded-full px-0.75 py-0.25 text-paragraph-sm font-[500] leading-[140%] text-dark ${
								waterType === 'ice' ? 'bg-primary/50' : 'bg-secondary/50'
							}`}
						>
							{waterType === 'ice' ? 'Ice fishing' : 'Open water'}
						</span>
					)}
				</div>
				<div className='relative w-full lg:w-[95%] mx-auto aspect-square overflow-hidden rounded mb-1 '>
					{primaryImage?.url && (
						<Image
							src={primaryImage.url}
							alt={primaryImage.altText || displayName}
							fill
							className={`${IMAGE_HOVER_CLASSES} ${hoverImage ? 'group-hover:opacity-0' : ''}`}
						/>
					)}

					{hoverImage && (
						<Image
							src={hoverImage.url}
							alt={hoverImage.altText || displayName}
							fill
							className={`absolute inset-0 opacity-0 group-hover:opacity-100 ${IMAGE_HOVER_CLASSES}`}
						/>
					)}
				</div>

				<h4>{displayName}</h4>
				<p className='mt-0.75 lg:mt-1 mb-1 lg:mb-1.5 text-paragraph-lg'>
					Starting at ${price.toFixed(2)}
				</p>

				<span
					className={`text-button inline-flex items-center justify-center rounded-sm transition-all duration-500 py-0.75
					[--aw:0.95rem] [--ag:0.62rem] sm:[--aw:1.08rem] md:[--aw:1.20956rem]
					${CTA_CLASSES}`}
				>
					<span className='inline-flex w-0 opacity-0 transition-all duration-300 ease-out group-hover:mr-[var(--ag)] group-hover:w-[var(--aw)] group-hover:opacity-100'>
						<Arrow />
					</span>

					<span className='inline-block transition-all duration-500 group-hover:italic'>
						View this rod
					</span>

					<span className='ml-[var(--ag)] inline-flex w-[var(--aw)] opacity-100 transition-all duration-300 ease-out group-hover:ml-0 group-hover:w-0 group-hover:opacity-0'>
						<Arrow />
					</span>
				</span>
			</Link>
		</div>
	);
}
