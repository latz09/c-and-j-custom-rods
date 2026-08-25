import React from 'react';

const ReviewHeading = ({ data }) => {
	const { headline, subheadline } = data ? data : {};

	const renderSubheadline = (text) => {
		return text
			.split('.')
			.map((sentence) => sentence.trim())
			.filter(Boolean)
			.map((sentence, i) => (
				<React.Fragment key={i}>
					{sentence}.
					<br />
				</React.Fragment>
			));
	};

	return (
		<div className='section-x-padding'>
			<div className='text-center pt-2 space-y-1.5 pb-5 lg:pb-8.75 border-b '>
				{headline && <h1>{headline}</h1>}
				{subheadline && (
					<p className='text-callout'>{renderSubheadline(subheadline)}</p>
				)}
			</div>
		</div>
	);
};

export default ReviewHeading;
