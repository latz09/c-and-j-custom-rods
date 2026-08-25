'use client';

import { useState } from 'react';
import Link from 'next/link';
import SanityImage from '@/components/ui/SanityImage';
import { Arrow } from '@/components/ui/ButtonLink';

const TOGGLE_OPTIONS = [
	{ type: 'open-water', label: 'Open water series' },
	{ type: 'ice', label: 'Ice fishing series' },
];

// TEMP: series with no Shopify products yet won't show "coming soon" /
// "out of stock" messaging — treated as if stock exists. Flip to false
// once the catalog's filled in.
const HIDE_EMPTY_STOCK_MESSAGING = true;

function startingPrice(products) {
	const available = products.filter((p) => p.availableForSale);
	const pool = available.length ? available : products;
	if (!pool.length) return null;
	return Math.min(
		...pool.map((p) => Number(p.priceRange.minVariantPrice.amount)),
	);
}

function WaterTypeToggle({ activeType, setActiveType }) {
	return (
		<div className='flex'>
			{TOGGLE_OPTIONS.map((opt) => {
				const active = activeType === opt.type;
				const isIce = opt.type === 'ice';
				const activeBg = isIce ? 'bg-primary' : 'bg-secondary';
				const activeText = isIce ? 'text-white' : '';

				return (
					<button
						key={opt.type}
						type='button'
						onClick={() => setActiveType(opt.type)}
						aria-pressed={active}
						className={`py-1 px-1.5 rounded transition-colors duration-300 ${active ? activeBg : ''}`}
					>
						<h6
							className={`transition-colors duration-300 ${active ? activeText : ''}`}
						>
							{opt.label}
						</h6>
					</button>
				);
			})}
		</div>
	);
}

function SeriesCard({ series: s, index }) {
	const CTA_CLASSES = 'px-1.25 bg-primary text-light group-hover:bg-dark';

	const price = startingPrice(s.products);
	const hasStock = s.products.some((p) => p.availableForSale);
	const isComingSoon = !HIDE_EMPTY_STOCK_MESSAGING && s.products.length === 0;

	let ctaLabel = `Shop ${s.name}`;
	if (isComingSoon) ctaLabel = 'Coming soon';
	else if (!hasStock && s.products.length > 0) ctaLabel = `View ${s.name}`;

	return (
		<div
			className='bg-gradient-to-b from-light via-accent/0 to-accent/60 p-2 border border-[#D2D2D2] rounded animate-[fade-in-up_0.4s_ease-out_backwards]'
			style={{ animationDelay: `${index * 60}ms` }}
		>
			<Link href={`/shop/rods/${s.slug}`} className='group'>
				<div className='flex flex-col items-end gap-0.5'>
					<span
						className={`rounded-full px-0.75 py-0.25 text-paragraph-sm font-[700] leading-[140%] text-dark ${
							s.applicationType === 'ice' ? 'bg-primary/50' : 'bg-secondary/50'
						}`}
					>
						{s.applicationType === 'ice' ? 'Ice fishing' : 'Open water'}
					</span>

					{isComingSoon && (
						<span className='rounded-full bg-[#D2D2D2] px-0.75 py-0.25 text-paragraph-sm font-[700] leading-[140%] text-dark'>
							Coming soon
						</span>
					)}

					{!isComingSoon && !hasStock && s.products.length > 0 && (
						<span className='rounded-full bg-[#D2D2D2] px-0.75 py-0.25 text-paragraph-sm font-[700] leading-[140%] text-dark'>
							Out of stock
						</span>
					)}
				</div>

				<div className='lg:w-[50%] mx-auto overflow-hidden rounded'>
					<SanityImage
						image={s.previewImage}
						alt={s.name}
						preset='rodSeriesHero'
						className='w-full h-auto rounded transition-transform duration-500 group-hover:scale-[0.975] group-hover:rotate-6'
					/>
				</div>

				<h4>{s.name}</h4>
				<p className='mt-0.75 lg:mt-1 mb-1 lg:mb-1.5 text-paragraph-lg'>
					{price != null
						? `Starting at $${price.toFixed(2)}`
						: 'Starting at $229.99'}
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
						{ctaLabel}
					</span>

					<span className='ml-[var(--ag)] inline-flex w-[var(--aw)] opacity-100 transition-all duration-300 ease-out group-hover:ml-0 group-hover:w-0 group-hover:opacity-0'>
						<Arrow />
					</span>
				</span>
			</Link>
		</div>
	);
}
export default function RodsBySeriesSection({ heading, subheading, series }) {
	const [activeType, setActiveType] = useState('open-water');

	const filtered = series.filter((s) => s.applicationType === activeType);

	return (
		<section id='by-series' className='section-x-padding scroll-mt-1.5'>
			<h2>{heading || 'In-stock rods by series'}</h2>
			<p className='text-paragraph-lg mt-2 mb-2.5 lg:mt-1 lg:mb-2.5'>
				{subheading ||
					'Select open water or ice fishing to view its respective series.'}
			</p>

			<WaterTypeToggle activeType={activeType} setActiveType={setActiveType} />

			<div className='grid lg:grid-cols-2 gap-1.5 mt-1.5 lg:mt-1.25'>
				{filtered.map((s, index) => (
					<SeriesCard key={s.slug} series={s} index={index} />
				))}
			</div>

			{filtered.length === 0 && (
				<p>
					No {activeType === 'open-water' ? 'open water' : 'ice fishing'} series
					yet.
				</p>
			)}
		</section>
	);
}
