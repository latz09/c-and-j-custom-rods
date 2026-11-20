import Link from 'next/link';
import SanityImage from '@/components/ui/SanityImage';
import { Arrow } from '@/components/ui/ButtonLink';
import { formatPrice } from './formatPrice';

const WATER_TYPE_BADGE = { ice: 'Ice fishing', 'open-water': 'Open water' };

// Same shell, badge, image and CTA treatment as the in-stock RodCard / series card.
const CARD_CLASSES =
	'flex flex-col h-full bg-gradient-to-b from-light via-accent/0 to-accent/60 p-1.5 border border-accent rounded animate-[fade-in-up_0.4s_ease-out_backwards]';

const SeriesCard = ({ series, comingSoonLabel, index = 0 }) => {
	const {
		name,
		slug,
		applicationType,
		builderStatus,
		builderCardBlurb,
		image,
		startingPrice,
	} = series;
	const isLive = builderStatus === 'live';

	const content = (
		<>
			<div className='flex justify-end mb-1.25'>
				<span
					className={`rounded-full px-0.75 py-0.25 text-caption font-[500] text-dark ${
						applicationType === 'ice' ? 'bg-primary/30' : 'bg-secondary/50'
					}`}
				>
					{WATER_TYPE_BADGE[applicationType]}
				</span>
			</div>

			<div className='mx-auto w-full max-w-[22.23rem] aspect-square mb-1'>
				<SanityImage
					image={image}
					alt={name}
					preset='rodSeriesCard'
					sizes='(min-width: 1024px) 356px, 100vw'
					className='w-full h-full object-contain transition-all duration-500 group-hover:scale-[0.975] group-hover:-rotate-[2.16deg]'
				/>
			</div>

			<h5>{name}</h5>
			{isLive ? (
				startingPrice != null && (
					<p className='mt-0.75  text-paragraph-lg'>
						Starting at {formatPrice(startingPrice)}
					</p>
				)
			) : (
				<p className='mt-0.75 text-paragraph-lg '>
					{comingSoonLabel || 'Coming soon!'}
				</p>
			)}
			{builderCardBlurb && (
				<p className='mt-0.75 text-paragraph-sm'>{builderCardBlurb}</p>
			)}

			{isLive && (
				<div className='mt-auto pt-1'>
					<span
						className='text-button inline-flex items-center justify-end rounded-sm transition-all duration-500 py-0.75 px-0 text-dark group-hover:text-primary
          [--aw:0.95rem] [--ag:0.62rem] sm:[--aw:1.08rem] md:[--aw:1.20956rem]'
					>
						<span className='inline-flex w-0 opacity-0 transition-all duration-300 ease-out group-hover:mr-[var(--ag)] group-hover:w-[var(--aw)] group-hover:opacity-100'>
							<Arrow />
						</span>
						<span className='inline-block transition-all duration-500 group-hover:italic'>
							Start building
						</span>
						<span className='ml-[var(--ag)] inline-flex w-[var(--aw)] opacity-100 transition-all duration-300 ease-out group-hover:ml-0 group-hover:w-0 group-hover:opacity-0'>
							<Arrow />
						</span>
					</span>
				</div>
			)}
		</>
	);

	const style = { animationDelay: `${index * 60}ms` };

	// Coming-soon cards have no link (Alyssa Q4).
	return isLive ? (
		<Link
			href={`/shop/custom/${slug}`}
			className={`group ${CARD_CLASSES}`}
			style={style}
		>
			{content}
		</Link>
	) : (
		<div className={CARD_CLASSES} style={style}>
			{content}
		</div>
	);
};

export default SeriesCard;
