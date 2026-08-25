import SanityImage from '@/components/ui/SanityImage';

const OurCommitment = ({ data }) => {
	const { heading, subheading, items } = data ? data : {};
	return (
		<div className='section-x-padding pb-5 lg:pb-8.75 mb-5 lg:mb-8.75'>
			<h2>{heading}</h2>
			<p className='text-paragraph-lg mt-1.5 mb-2.5'>{subheading}</p>
			<div className='grid md:grid-cols-2 xl:grid-cols-4 gap-1.25'>
				{items?.map((item, index) => (
					<CommitmentCard key={index} item={item} />
				))}
			</div>
		</div>
	);
};

export default OurCommitment;

const CommitmentCard = ({ item }) => {
	const { icon, title, description } = item ? item : {};
	return (
		<div className='p-1.5 border border-[#d2d2d2] rounded bg-gradient-to-b from-[#c4c4c4]/80 via-[#c4c4c4]/0 to-light flex flex-col lg:min-h-[22rem] gap-3 lg:gap-5 '>
			{icon && (
				<div className='relative size-[6rem] 2xl:size-[7rem] '>
					<SanityImage
						image={icon}
						alt={title || 'Commitment icon'}
						fill
						sizes='48px'
					/>
				</div>
			)}
			<div className='space-y-1'>
				{title && (
					<h4 className='min-h-[3.75rem] flex items-end'>{title}</h4>
				)}
				{description && <p className='text-paragraph-lg'>{description}</p>}
			</div>
		</div>
	);
};
