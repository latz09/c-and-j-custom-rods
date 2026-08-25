'use client';

import { useState } from 'react';
import RodCard from './RodCard';

const FILTERS = [
	{ key: 'all', label: 'ALL' },
	{ key: 'ice', label: 'Ice rods' },
	{ key: 'open-water', label: 'Open water' },
];

function FilterToggle({ filter, setFilter }) {
	return (
		<div className='flex flex-col lg:flex-row lg:items-center gap-1.5 lg:gap-1 mt-2 mb-2.5 lg:mb-3.5'>
			<span>Filter by fishing type:</span>
			<div className='flex gap-1'>
				{FILTERS.map((f) => {
					const active = filter === f.key;

					return (
						<button
							key={f.key}
							type='button'
							onClick={() => setFilter(f.key)}
							aria-pressed={active}
							className={`rounded px-1.25 py-0.75 border transition-colors duration-300 ${
								active ? 'bg-primary border-primary text-white' : 'bg-primary/0 border-dark'
							}`}
						>
							{f.label}
						</button>
					);
				})}
			</div>
		</div>
	);
}

export default function AllRodsSection({
	heading,
	subheading,
	products,
	seriesList,
}) {
	const [filter, setFilter] = useState('all');
	const filtered =
		filter === 'all'
			? products
			: products.filter((p) => p.tags?.includes(filter));

	return (
		<section id='all-rods' className='section-x-padding mt-5 mb-5 lg:mb-8.75 scroll-mt-3'>
			<h2>{heading || 'Our in-stock rods'}</h2>
		

			<FilterToggle filter={filter} setFilter={setFilter} />

			<div className='grid md:grid-cols-2 lg:grid-cols-3 gap-1.5 mt-1.5 lg:mt-1.25'>
				{filtered.map((p, index) => (
					// AllRodsSection.jsx
					<RodCard
						key={p.id}
						product={p}
						seriesList={seriesList}
						index={index}
					/>
				))}
			</div>

			{filtered.length === 0 && <p>No rods match this filter yet.</p>}
		</section>
	);
}
