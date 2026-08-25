import SanityImage from "@/components/ui/SanityImage";

const ReviewsContainer = ({ data }) => {
	return (
		<div className="mb-5 lg:mb-8.75">
			{data?.map((review) => (
				<Review key={review._id} review={review} />
			))}
		</div>
	);
};

export default ReviewsContainer;

const Review = ({ review }) => {
	const { name, photo, pullQuote, body } = review;

	return (
		<div className='section-x-padding'>
			<div className='py-5 grid gap-2.5 lg:flex lg:gap-5 border-b border-primary/50'>
				{photo && (
					<SanityImage
	image={photo}
	alt={name ? `Photo of ${name}` : ''}
	preset='reviewPhoto'
	className='w-full h-auto lg:w-[25.64294rem] lg:h-[30.43556rem] shrink-0 rounded-lg'
/>
				)}
				<div className='space-y-1.5'>
					{pullQuote && <h3>{`"${pullQuote}"`}</h3>}
					{name && <p className='text-callout'>{`- Angler ${name}`}</p>}
					<div className='space-y-1.25'>
						{body?.map((paragraph, i) => (
							<p className='text-paragraph-lg' key={i}>
								{paragraph}
							</p>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};