import SanityImage from '@/components/ui/SanityImage';

const OurStory = ({ data }) => {
	const { heading, photo, body } = data ? data : {};

	return (
		<div className='bg-dark '>
			<div className='section-x-padding space-y-2.5 pb-5 lg:pb-8.75 grid lg:grid-cols-2 gap-1.25 lg:gap-6 2xl:gap-8'>
				<div className='space-y-1.25'>
					<h2 className='text-light'>{heading}</h2>
					<div className='space-y-1.25'>
						{body?.map((paragraph, index) => (
							<p
								key={index}
								className={`text-light ${
									index === 0
										? 'text-paragraph-lg'
										: 'text-paragraph-sm lg:ml-5.5'
								}`}
							>
								{paragraph}
							</p>
						))}
					</div>
				</div>
				<div className='relative w-full aspect-[81/89]'>
					<SanityImage
						image={photo}
						alt={heading || ''}
						preset='ourStoryPhoto'
						fill
						sizes='(min-width: 1024px) 50vw, 100vw'
						objectFit='cover'
					/>
				</div>
			</div>
		</div>
	);
};

export default OurStory;
