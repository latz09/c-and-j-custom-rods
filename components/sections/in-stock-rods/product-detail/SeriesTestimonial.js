'use client';

import { useState } from 'react';

const EXCERPT_CHAR_LIMIT = 340;

function truncateParagraphs(paragraphs, limit) {
	let remaining = limit;
	const result = [];

	for (const paragraph of paragraphs) {
		if (remaining <= 0) break;

		if (paragraph.length <= remaining) {
			result.push(paragraph);
			remaining -= paragraph.length;
		} else {
			const slice = paragraph.slice(0, remaining);
			const lastSpace = slice.lastIndexOf(' ');
			result.push(lastSpace > 0 ? slice.slice(0, lastSpace) : slice);
			remaining = 0;
		}
	}

	return result;
}

const SeriesTestimonial = ({ data, seriesName }) => {
	const { body, name } = data;
	const [expanded, setExpanded] = useState(false);

	const paragraphs = body ?? [];
	const fullLength = paragraphs.join(' ').length;
	const needsTruncation = fullLength > EXCERPT_CHAR_LIMIT;

	const displayParagraphs =
		expanded || !needsTruncation
			? paragraphs
			: truncateParagraphs(paragraphs, EXCERPT_CHAR_LIMIT);

	return (
		<div className='section-x-padding '>
			<div className='grid lg:grid-cols-2 gap-2.5 lg:gap-4 my-5 lg:my-8.75 px-1.25 py-2.5 lg:py-5 lg:px-5 3xl:px-7.5 bg-primary rounded'>
				<h2 className='text-white'>{`What customers are saying about the  ${seriesName} series`}</h2>
				<blockquote>
					<div className='space-y-1'>
						{displayParagraphs.map((paragraph, i) => {
							const isLast = i === displayParagraphs.length - 1;
							const isFirst = i === 0;

							return (
								<p key={i} className='text-paragraph-lg text-white'>
									{isFirst && '"'}
									{paragraph}
									{isLast && (expanded || !needsTruncation ? '"' : '…')}
								</p>
							);
						})}
					</div>

					{needsTruncation && (
						<button
							type='button'
							onClick={() => setExpanded((prev) => !prev)}
							className='text-white underline mt-1'
						>
							{expanded ? 'Read less' : 'Continue reading'}
						</button>
					)}

					<p className='mt-1.5 text-white text-paragraph-lg'>— {name}</p>
				</blockquote>
			</div>
		</div>
	);
};

export default SeriesTestimonial;
