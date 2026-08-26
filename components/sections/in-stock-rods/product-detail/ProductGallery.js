'use client';

import { useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';

const isGlowImage = (img) => img?.altText?.toLowerCase().includes('glow');

export default function ProductGallery({ images, title }) {
	const [activeIndex, setActiveIndex] = useState(0);
	const activeImage = images[activeIndex];

	if (images.length === 0) return null;

	const goTo = (i) => {
		if (i < 0 || i >= images.length) return;
		setActiveIndex(i);
	};

	const handleDragEnd = (e, info) => {
		const swipeThreshold = 50;
		if (info.offset.x < -swipeThreshold) goTo(activeIndex + 1);
		else if (info.offset.x > swipeThreshold) goTo(activeIndex - 1);
	};

	const activeIsGlow = isGlowImage(activeImage);

	return (
		<div>
			<div
				className={`relative h-[24rem] 3xl:h-[32rem] border border-[#D2D2D2] rounded p-2 overflow-hidden transition-colors duration-500 ${
					activeIsGlow
						? 'bg-gradient-to-b from-dark via-dark to-dark/90 border-dark/0'
						: 'bg-gradient-to-b from-light via-accent/0 to-accent/60 '
				}`}
			>
				<AnimatePresence mode='sync' initial={false}>
					{activeImage && (
						<motion.div
							key={activeIndex}
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.45, ease: 'easeOut' }}
							drag={images.length > 1 ? 'x' : false}
							dragConstraints={{ left: 0, right: 0 }}
							dragElastic={0.2}
							onDragEnd={handleDragEnd}
							className='absolute inset-0 lg:cursor-default cursor-grab active:cursor-grabbing'
						>
							<Image
								src={activeImage.url}
								alt={activeImage.altText || title}
								fill
								className='object-contain pointer-events-none'
								sizes='(min-width: 1024px) 50vw, 100vw'
							/>
						</motion.div>
					)}
				</AnimatePresence>
			</div>

			{images.length > 1 && (
				<>
					{/* Mobile: progress-bar strip, one segment per image, still tappable */}
					<div className='flex lg:hidden gap-0.5 mt-1 mb-2.5'>
						{images.map((img, i) => (
							<button
								key={i}
								type='button'
								onClick={() => goTo(i)}
								aria-current={i === activeIndex}
								aria-label={`View image ${i + 1} of ${images.length}`}
								className={`flex-1 h-[3px] rounded-full transition-colors duration-300 ${
									i === activeIndex ? 'bg-primary' : 'bg-[#D2D2D2]'
								}`}
							/>
						))}
					</div>

					{/* Desktop: 4-col thumbnail grid */}
					<div className='hidden lg:grid grid-cols-4 gap-1 mt-1'>
						{images.map((img, i) => {
							const glow = isGlowImage(img);

							return (
								<button
									key={i}
									type='button'
									onClick={() => goTo(i)}
									aria-current={i === activeIndex}
									className={`group relative h-[6.5rem] max-h-[6.5rem] 3xl:h-[8.25rem] 3xl:max-h-[8.25rem] rounded p-1 border transition-colors duration-300 ${
										i === activeIndex ? 'border-primary' : 'border-[#D2D2D2]'
									} ${
										glow
											? 'bg-black'
											: 'bg-gradient-to-b from-light via-accent/0 to-accent/60'
									}`}
								>
									<Image
										src={img.url}
										alt={img.altText || title}
										fill
										className='object-contain'
										sizes='112px'
									/>
								</button>
							);
						})}
					</div>
				</>
			)}
		</div>
	);
}