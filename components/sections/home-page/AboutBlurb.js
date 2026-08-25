import ButtonLink from '@/components/ui/ButtonLink';
import SanityImage from '@/components/ui/SanityImage';

const AboutBlurb = ({ data }) => {
	const { heading, body, image, cta } = data ? data : {};

	return (
		<div className='space-y-4 section-x-padding section-y-padding'>
			<div className='grid lg:grid-cols-2 gap-1.5 lg:gap-8'>
				<h2>{heading}</h2>
				<div className='space-y-2.5'>
					<p className='text-paragraph-lg'>{body}</p>
					<ButtonLink href={cta?.url || '#'} className='mt-2'>
						{cta?.label || 'Learn More'}
					</ButtonLink>
				</div>
			</div>
			<div className='relative w-full h-[28rem] sm:h-[25rem] md:h-[24rem] lg:h-[25rem] 2xl:h-[35rem] rounded'>
				<SanityImage
					image={image}
					alt={heading || ''}
					preset='aboutBlurb'
					fill
					sizes='100vw'
					objectFit='cover'
					className='rounded'
				/>
			</div>
		</div>
	);
};

export default AboutBlurb;
