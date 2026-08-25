import Image from 'next/image';

export default function ReelImage({ image, title }) {
	if (!image) return null;

	return (
		<div className='relative h-[24rem] 3xl:h-[32rem] border border-[#D2D2D2] rounded bg-gradient-to-b from-light via-accent/0 to-accent/60 p-2 overflow-hidden'>
			<Image
				src={image.url}
				alt={image.altText || title}
				fill
				className='object-contain'
				sizes='(min-width: 1024px) 50vw, 100vw'
			/>
		</div>
	);
}