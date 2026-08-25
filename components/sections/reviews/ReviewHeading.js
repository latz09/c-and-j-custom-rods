import React from 'react';
import Topography from '@/components/ui/Topography';

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
			<div className='relative overflow-hidden text-center pt-2 pb-5 lg:pb-8.75 bg-gradient-to-t from-[#858585]/10 via-acce to-accent/0 rounded'>
				<Topography variant="light" fade="corner" />
				<div className='relative z-10 space-y-1.5'>
					{headline && <h1>{headline}</h1>}
					{subheadline && (
						<p className='text-callout'>{renderSubheadline(subheadline)}</p>
					)}
				</div>
			</div>
		</div>
	);
};

export default ReviewHeading;