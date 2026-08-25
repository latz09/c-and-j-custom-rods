'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Arrow } from '@/components/ui/ButtonLink';

const CTA_CLASSES = 'px-0 text-dark group-hover:text-primary';
const CARD_IMAGE_HEIGHT = 'h-[250px]';
const CYCLE_INTERVAL_MS = 2800;

function getDisplayImages(product) {
	const variants = product.variants?.edges?.map((e) => e.node) ?? [];
	const seenColors = new Set();
	const colorImages = [];

	variants.forEach((v) => {
		const color = v.selectedOptions?.find((so) => so.name === 'Color')?.value;
		if (color && !seenColors.has(color) && v.image?.url) {
			seenColors.add(color);
			colorImages.push(v.image);
		}
	});

	// Only cycle if there's genuinely more than one color — the Hoodie
	// (size-only) and Hat (no options) fall straight back to the single
	// featured image, no rotation logic engaged at all.
	if (colorImages.length > 1) return colorImages;
	return product.featuredImage ? [product.featuredImage] : [];
}

export default function ApparelCard({ product, index = 0 }) {
	const price = Number(product.priceRange.minVariantPrice.amount);
	const displayName = product.title;
	const images = getDisplayImages(product);
	const canCycle = images.length > 1;

	const [activeIndex, setActiveIndex] = useState(0);

	useEffect(() => {
		if (!canCycle) return;

		const interval = setInterval(() => {
			setActiveIndex((prev) => (prev + 1) % images.length);
		}, CYCLE_INTERVAL_MS);

		return () => clearInterval(interval);
	}, [canCycle, images.length]);

	return (
		<div
			className='h-full bg-gradient-to-b from-light via-accent/0 to-accent/60 p-1.5 border border-[#D2D2D2] rounded animate-[fade-in-up_0.4s_ease-out_backwards]'
			style={{ animationDelay: `${index * 60}ms` }}
		>
			<Link
				href={`/shop/apparel/${product.handle}`}
				className='group flex h-full flex-col'
			>
				<div
					className={`relative ${CARD_IMAGE_HEIGHT} flex items-center justify-center overflow-hidden rounded mb-2.5`}
				>
					{images.map((img, i) => (
						<Image
							key={img.url}
							src={img.url}
							alt={img.altText || displayName}
							fill
							className={`absolute inset-0 object-contain transition-all duration-[800ms] ease-in-out group-hover:scale-[0.975] group-hover:rotate-6 ${
								i === activeIndex ? 'opacity-100' : 'opacity-0'
							}`}
						/>
					))}
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
