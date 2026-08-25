'use client';

export default function ApparelOptionPicker({ options, selected, onSelect, variants }) {
	return (
		<div className='space-y-1.5 mb-1.5'>
			{options.map((option) => (
				<div key={option.name}>
					<p className='text-paragraph-sm font-[700] mb-0.5'>{option.name}</p>
					<div className='flex flex-wrap gap-0.5'>
						{option.values.map((value) => {
							const isSelected = selected[option.name] === value;

							const isAvailable = variants.some(
								(v) =>
									v.availableForSale &&
									v.selectedOptions.every((so) =>
										so.name === option.name
											? so.value === value
											: selected[so.name] === so.value,
									),
							);

							return (
								<button
									key={value}
									type='button'
									disabled={!isAvailable}
									onClick={() => onSelect(option.name, value)}
									className={`px-1 py-0.5 rounded border text-paragraph-sm transition-colors duration-300 ${
										isSelected
											? 'border-primary text-primary font-[700]'
											: 'border-[#D2D2D2] text-dark hover:border-primary'
									} ${!isAvailable ? 'opacity-40 cursor-not-allowed line-through' : ''}`}
								>
									{value}
								</button>
							);
						})}
					</div>
				</div>
			))}
		</div>
	);
}