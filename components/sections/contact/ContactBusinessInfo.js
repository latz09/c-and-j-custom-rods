const toTelHref = (phone) => `tel:${phone.replace(/(?!^\+)[^\d]/g, '')}`;

const ContactBusinessInfo = ({ data }) => {
	const { heading, email, phone, location, hours } = data ?? {};

	const hasInfo = [email, phone, location, hours].some(Boolean);
	if (!hasInfo) return null;

	return (
		<div className='space-y-1.25'>
			<h4>{heading || 'Business info'}</h4>

			<ul className='space-y-0.75 text-paragraph-lg'>
				{email && (
					<li>
						<a
							href={`mailto:${email}`}
							className='hover:text-primary transition-colors duration-300'
						>
							{email}
						</a>
					</li>
				)}

				{phone && (
					<li>
						<a
							href={toTelHref(phone)}
							className='hover:text-primary transition-colors duration-300'
						>
							{phone}
						</a>
					</li>
				)}

				{location && <li>{location}</li>}

				{hours && <li>{hours}</li>}
			</ul>
		</div>
	);
};

export default ContactBusinessInfo;