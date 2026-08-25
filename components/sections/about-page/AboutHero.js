import SanityImage from '@/components/ui/SanityImage';

const AboutHero = ({ data }) => {
	const { headline, subheadline, image } = data ? data : {};

	return (
        <section className="bg-dark">
		<div className=' section-x-padding space-y-2.5 pb-5 lg:pb-8.75'>
			<div className=' pt-2'>
				<div className='text-center space-y-1.25'>
					<h1 className='text-light'>{headline}</h1>
					<p className='text-callout text-light'>{subheadline}</p>
				</div>
			</div>
			<div className='relative w-full h-[26rem] sm:h-[27rem] md:h-[26rem] lg:h-[30rem] 2xl:h-[37rem] rounded '>
				<SanityImage
					image={image}
					alt={headline || ''}
					preset='aboutBlurb'
					fill
					sizes='100vw'
					objectFit='cover'
					className='rounded'
				/>
			</div>
		</div></section>
	);
};

export default AboutHero;
