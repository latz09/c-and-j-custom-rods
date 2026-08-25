import SanityImage from '@/components/ui/SanityImage';
import Link from 'next/link';

const RodSeriesHero = ({ data }) => {
	const { applicationType, description, heroImage, name, slug } = data;
	return (
		<div className='section-x-padding  mt-1 lg:mt-2 mb-5 '>
			<div className="px-1.25 lg:px-4 bg-gradient-to-t from-accent/50 via-accent/0 to-accent/0 rounded  pb-2.5 lg:pb-5">
				<Link
					href='/shop/rods'
					className='text-dark text-paragraph-sm font-[500] hover:text-primary transition duration-300'
				>
					In stock rods /
				</Link>
				<div className=' grid lg:grid-cols-2 gap-1.5 lg:gap-5.5 mt-1'>
					<div className='order-2 lg:order-1 space-y-1.25 lg:space-y-1.5'>
						<h1>{name}</h1>
						<p className='text-paragraph-lg'>{description}</p>
					</div>
					<div className='order-1 lg:order-2 '>
						{heroImage && (
							<SanityImage
								image={heroImage}
								alt={name || ''}
								preset='inStockRodHero'
								objectFit='contain'
								className='rounded'
							/>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default RodSeriesHero;
