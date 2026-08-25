import Image from 'next/image';
import Link from 'next/link';
import { Arrow } from '@/components/ui/ButtonLink';

const CTA_CLASSES = 'px-0 text-dark group-hover:text-primary';
const CARD_IMAGE_HEIGHT = 'h-[250px]';

export default function ApparelCard({ product, index = 0 }) {
	const price = Number(product.priceRange.minVariantPrice.amount);
	const displayName = product.title;

	return (
		<div
			className='h-full bg-gradient-to-b from-light via-accent/0 to-accent/60 p-1.5 border border-[#D2D2D2] rounded animate-[fade-in-up_0.4s_ease-out_backwards]'
			style={{ animationDelay: `${index * 60}ms` }}
		>
			<Link href={`/shop/apparel/${product.handle}`} className='group flex h-full flex-col'>
				<div className={`relative ${CARD_IMAGE_HEIGHT} flex items-center justify-center overflow-hidden rounded mb-2.5`}>
					{product.featuredImage?.url && (
						<Image
							src={product.featuredImage.url}
							alt={product.featuredImage.altText || displayName}
							fill
							className='object-contain transition-transform duration-500 group-hover:scale-[1.2] group-hover:-rotate-6'
						/>
					)}
				</div>

				<div className='flex flex-1 flex-col'>
					<h4>{displayName}</h4>
					<p className='mt-0.75 lg:mt-1 mb-1 lg:mb-1.5 text-paragraph-lg'>
						Starting at ${price.toFixed(2)}
					</p>

					<span
						className={`text-button mt-auto inline-flex items-center justify-start rounded-sm transition-all duration-500 py-0.75
						[--aw:0.95rem] [--ag:0.62rem] sm:[--aw:1.08rem] md:[--aw:1.20956rem]
						${CTA_CLASSES}`}
					>
						<span className='inline-flex w-0 opacity-0 transition-all duration-300 ease-out group-hover:mr-[var(--ag)] group-hover:w-[var(--aw)] group-hover:opacity-100'>
							<Arrow />
						</span>

						<span className='inline-block transition-all duration-500 group-hover:italic '>
							View this item
						</span>

						<span className='ml-[var(--ag)] inline-flex w-[var(--aw)] opacity-100 transition-all duration-300 ease-out group-hover:ml-0 group-hover:w-0 group-hover:opacity-0'>
							<Arrow />
						</span>
					</span>
				</div>
			</Link>
		</div>
	);
}