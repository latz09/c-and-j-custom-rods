import SanityImage from '@/components/ui/SanityImage';
import Topography from '@/components/ui/Topography';

const ReelsHero = ({ data }) => {
	const { heading, body, image } = data ? data : {};
	return (
		<div className='section-x-padding mt-1 lg:mt-2 mb-5'>
			<div className="relative overflow-hidden lg:px-4 bg-gradient-to-t from-[#858585]/10 to-accent/0 rounded pb-2.5 lg:pb-5">
				<Topography variant="light" fade={true} />
				<div className="relative z-10">
					<div className='grid lg:grid-cols-2 gap-1.5 lg:gap-5.5 mt-1'>
						<div className='order-2 lg:order-1 space-y-1.25 lg:space-y-1.5 px-1.25 lg:px-0'>
							<h1>{heading}</h1>
							<p className='text-paragraph-lg'>{body}</p>
						</div>
						<div className='order-1 lg:order-2'>
							{image && (
								<SanityImage
									image={image}
									alt={heading || ''}
									preset='inStockRodHero'
									objectFit='contain'
									className='rounded'
								/>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ReelsHero;