import ButtonLink from '@/components/ui/ButtonLink';
import SanityImage from '@/components/ui/SanityImage';

const Hero = ({ data }) => {
	const {
		headline,
		subheadline,
		backgroundImage,
		rodImage,
		ctaPrimary,
		ctaSecondary,
	} = data ? data : {};

	return (
		<div className='relative -mt-[10svh] w-full h-[126svh] lg:h-[113vh] overflow-hidden'>
			{/* Background image */}
			{backgroundImage?.asset && (
				<SanityImage
					image={backgroundImage}
					alt=''
					preset='heroBackground'
					fill
					priority
					sizes='100vw'
					// className="-translate-y-10"
				/>
			)}

			{/* Overlay */}
			<div className='absolute inset-0 z-10 bg-gradient-to-t from-light/0 via-light/0 to-light ' />

			{/* Bottom darken strip — full width, breaks out of section-x-padding */}
			<div className='absolute bottom-0 left-0 right-0 z-10 h-[10rem] bg-gradient-to-b from-dark/0 to-dark ' />

			<div className='section-x-padding absolute inset-0 z-20 flex flex-col pt-[calc(10vh+2.5rem)] lg:pt-[calc(10vh+3.25rem)]  max-h-[100vh]  '>
				{headline && <h1 className='md:max-w-[85rem]'>{headline}</h1>}
				{subheadline && (
					<p className='text-subheading mt-1.5 lg:mt-2.5 mb-2.5'>{subheadline}</p>
				)}
				<div className='flex flex-col items-start  lg:flex-row gap-1'>
					{ctaPrimary?.url && (
						<ButtonLink
							href={ctaPrimary.url}
							variant='primary-on-light'
							event='Hero Primary'
						>
							{ctaPrimary.label}
						</ButtonLink>
					)}
					{ctaSecondary?.url && (
						<ButtonLink
							href={ctaSecondary.url}
							variant='secondary-on-light'
							event='Hero Secondary'
						>
							{ctaSecondary.label}
						</ButtonLink>
					)}
				</div>

				{/* {rodImage?.asset && (
					<SanityImage
						image={rodImage}
						alt=''
						preset='heroForeground'
						priority
						objectFit='contain'
						sizes='(max-width: 768px) 70vw, 40vw'
						className='mt-1 -rotate-[40deg] w-[50%] bottom-[16rem] sm:bottom-[15rem] md:bottom-[15rem] lg:bottom-[16rem]  xl:bottom-[11rem] 2xl:-bottom-[4rem]   md:-translate-x-1.25 lg:w-[40%]  absolute'
					/>
				)} */}
			</div>
		</div>
	);
};

export default Hero;