import ButtonLink from '@/components/ui/ButtonLink';
import SanityImage from '@/components/ui/SanityImage';

const InStockRodHero = ({ data }) => {
	const { headline, subheadline, image, ctaSeries, ctaAllRods } = data
		? data
		: {};

	return (
		<div className='section-x-padding pb-5 lg:pb-8.75 grid place-items-center lg:place-items-start text-center lg:text-start  lg:grid-cols-2 gap-2 mt-3 lg:mt-2'>
			<div className='space-y-1.25 lg:space-y-2.5'>
				{headline && <h1>{headline}</h1>}

				{subheadline && <p className='text-subheading'>{subheadline}</p>}
				<div className=' flex flex-col lg:flex-row gap-1 items-center lg:items-start'>
					<ButtonLink
						direction='down'
						href={`/shop/rods/${ctaSeries?.url}`}
						variant='primary-on-light'
					>
						{ctaSeries?.label}
					</ButtonLink>
					<ButtonLink
						direction='down'
						href={`/shop/rods/${ctaAllRods?.url}`}
						variant='secondary-on-light'
					>
						{ctaAllRods?.label}
					</ButtonLink>
				</div>
			</div>
			<div>
				{image && (
					<SanityImage
						image={image}
						alt={headline || ''}
						preset='inStockRodHero'
						objectFit='contain'
					/>
				)}
			</div>
		</div>
	);
};

export default InStockRodHero;
