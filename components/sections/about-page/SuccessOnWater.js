// /components/SuccessOnWater.js
'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import SanityImage from '@/components/ui/SanityImage';

const SuccessOnWater = ({ data }) => {
	const { heading, images } = data ? data : {};

	const containerRef = useRef(null);
	const trackRef = useRef(null);
	const [offset, setOffset] = useState(0);
	const [step, setStep] = useState(0);
	const [maxOffset, setMaxOffset] = useState(0);

	const measure = useCallback(() => {
		const container = containerRef.current;
		const track = trackRef.current;
		if (!container || !track || track.children.length === 0) return;

		const card = track.children[0];
		const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
		const cardWidth = card.getBoundingClientRect().width + gap;
		const max = Math.max(0, track.scrollWidth - container.clientWidth);

		setStep(cardWidth);
		setMaxOffset(max);
		setOffset((o) => Math.min(o, max));
	}, []);

	useEffect(() => {
		measure();
		const ro = new ResizeObserver(measure);
		if (containerRef.current) ro.observe(containerRef.current);
		return () => ro.disconnect();
	}, [measure, images?.length]);

	if (!images?.length) return null;

	const canPrev = offset > 1;
	const canNext = offset < maxOffset - 1;

	const pages = step > 0 ? Math.round(maxOffset / step) + 1 : 1;
	const activePage =
		step > 0 ? Math.min(pages - 1, Math.max(0, Math.round(offset / step))) : 0;

	const prev = () => setOffset((o) => Math.max(0, o - step));
	const next = () => setOffset((o) => Math.min(maxOffset, o + step));

	const onDragEnd = (_, info) => {
		if (step === 0) return;
		const projected = offset - info.offset.x - info.velocity.x * 0.2;
		const snapped = Math.max(
			0,
			Math.min(maxOffset, Math.round(projected / step) * step),
		);
		setOffset(snapped);
	};

	return (
		<div className='section-x-padding section-y-padding space-y-3.5'>
			<h2>{heading}</h2>

			<div className='space-y-1 lg:space-y-1.5'>
				<div className='md:mr-[calc(-50vw+50%)]'>
					<div ref={containerRef} className='overflow-hidden'>
						<motion.div
							ref={trackRef}
							className='flex gap-1.25'
							drag={maxOffset > 0 ? 'x' : false}
							dragConstraints={{ left: -maxOffset, right: 0 }}
							dragElastic={0.1}
							dragMomentum={false}
							onDragEnd={onDragEnd}
							animate={{ x: -offset }}
							transition={{ type: 'spring', stiffness: 300, damping: 40 }}
						>
							{images.map((image, index) => (
								<WaterImageItem key={index} image={image} index={index} />
							))}
							<div className='w-0 md:w-5 shrink-0' aria-hidden='true' />
						</motion.div>
					</div>
				</div>

				<div className='flex items-center justify-between gap-0.5 lg:gap-1'>
					<Progress count={pages} active={activePage} />
				</div>
			</div>
		</div>
	);
};

export default SuccessOnWater;

const WaterImageItem = ({ image, index }) => {
	return (
		<div className='relative shrink-0 w-[23.5rem] h-[31.34675rem] aspect-[376/501.55] rounded overflow-hidden select-none'>
			<SanityImage
				image={image}
				alt={`Success on the water image ${index + 1}`}
				preset='galleryCarousel'
				fill
				sizes='23.5rem'
				draggable={false}
			/>
		</div>
	);
};

const Progress = ({ count, active }) => {
	if (count <= 1) return <span />;
	return (
		<div className='flex items-center gap-0.75 w-full' aria-hidden='true'>
			{Array.from({ length: count }).map((_, i) => (
				<span
					key={i}
					className={`h-[4px] flex-1 rounded-full transition-all duration-300 ${
						i === active ? 'bg-primary' : 'bg-primary/50'
					}`}
				/>
			))}
		</div>
	);
};
