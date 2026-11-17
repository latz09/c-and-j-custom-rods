// Placeholder until the contact form backend is built.
// Swap this for <SubmitContactForm /> once /api/submitContactForm exists.

const ContactFormPlaceholder = ({ email }) => {
	return (
		<div className='bg-[#D4D4D4] rounded p-2 lg:p-2.5 min-h-[28rem] lg:min-h-[39rem] flex flex-col'>
			<h4>Fill out the form</h4>

			<div className='flex-1 grid place-items-center text-center'>
				<p className='text-paragraph text-dark/70 max-w-[22rem]'>
					Form coming soon.
					{email && (
						<>
							{' '}
							In the meantime, email us at{' '}
							<a
								href={`mailto:${email}`}
								className='text-primary font-[700] hover:text-dark transition-colors duration-300'
							>
								{email}
							</a>
							.
						</>
					)}
				</p>
			</div>
		</div>
	);
};

export default ContactFormPlaceholder;