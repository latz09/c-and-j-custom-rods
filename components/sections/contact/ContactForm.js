const baseInputClasses =
	'w-full px-1.25 py-1  rounded bg-light text-paragraph-sm focus:outline-none focus:border-secondary transition-all duration-300';

// One field, any type. This is the whole reason ContactForm.js used to need
// editing for one-off fields — now a new field is a clientConfig.js entry,
// not a JSX change.
const renderField = (field, formData, handleInputChange) => {
	const value = formData[field.name] ?? '';

	switch (field.type) {
		case 'textarea':
			return (
				<textarea
					id={field.name}
					name={field.name}
					value={value}
					onChange={handleInputChange}
					required={field.required}
					placeholder={field.placeholder}
					rows={field.rows || 5}
					className={`${baseInputClasses} resize-none`}
				/>
			);

		case 'select':
			return (
				<select
					id={field.name}
					name={field.name}
					value={value}
					onChange={handleInputChange}
					required={field.required}
					className={baseInputClasses}
				>
					<option value=''>
						{field.placeholder || `Select ${field.label.toLowerCase()}`}
					</option>
					{field.options?.map((option) => (
						<option key={option.value} value={option.value}>
							{option.label}
						</option>
					))}
				</select>
			);

		case 'radio':
			return (
				<div className='flex flex-wrap gap-0.75'>
					{field.options?.map((option) => {
						const isSelected = value === option.value;
						return (
							<label
								key={option.value}
								className={`flex items-center gap-0.5 px-1 py-0.5 border rounded text-caption cursor-pointer transition-colors duration-200 ${
									isSelected
										? 'border-secondary bg-secondary/10'
										: 'border-dark/20 hover:border-dark/40'
								}`}
							>
								<input
									type='radio'
									name={field.name}
									value={option.value}
									checked={isSelected}
									onChange={handleInputChange}
									required={field.required}
									className='accent-secondary'
								/>
								{option.label}
							</label>
						);
					})}
				</div>
			);

		default:
			// text, email, tel — and anything else a plain <input type="..."> already knows how to be
			return (
				<input
					type={field.type}
					id={field.name}
					name={field.name}
					value={value}
					onChange={handleInputChange}
					required={field.required}
					placeholder={field.placeholder}
					className={baseInputClasses}
				/>
			);
	}
};

const ContactForm = ({
	fields,
	formData,
	handleInputChange,
	handleSubmit,
	isLoading,
	error,
	success,
}) => {
	return (
		<form
			onSubmit={handleSubmit}
			className='p-2.5 rounded bg-accent'
		>
			<div className='mb-1.5'>
				<h4>Fill out the form</h4>
				
			</div>

			<div className='space-y-1.25 mb-1.5'>
				{fields.map((field) => (
					<div key={field.name}>
						<label
							htmlFor={field.name}
							className='text-caption  block mb-0.5'
						>
							{field.label}
							{field.required && '*'}
						</label>
						{renderField(field, formData, handleInputChange)}
					</div>
				))}
			</div>

			<button
				type='submit'
				disabled={isLoading}
				className=' bg-primary text-button text-white py-0.75 px-1.25 rounded border border-primary hover:opacity-90 active:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300'
			>
				{isLoading ? 'Sending...' : 'Send Message'}
			</button>

			{error && (
				<p className='mt-1 p-1 rounded border border-dark/20 text-caption text-dark/70 bg-white'>
					{error}
				</p>
			)}
			{success && (
				<p className='mt-1 p-1 rounded border border-secondary text-caption text-primary bg-white'>
					{success}
				</p>
			)}
		</form>
	);
};

export default ContactForm;
