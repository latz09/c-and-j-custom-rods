// /utils/email-configuration/client-config/clientConfig.js
export const clientConfig = {
	branding: {
		name: 'C&J Custom Rods',
		// Fallback only. The live logo comes from seoSettings.emailLogo in Sanity.
		// With neither set, the email header shows the business name as text.
		logoUrl: '',
		colors: {
			background: '#FCFCFC', // page/section background behind the logo + body
			surface: '#F2F2F2', // "Submission Details" box background
			accent: '#1075BD', // Fishing Blue: top bar, eyebrow text, buttons
			text: '#161616',
			textMuted: '#6B7280',
		},
		contactInfo: {
			phone: '', // Live value comes from seoSettings.phone
			email: process.env.CLIENT_EMAIL,
		},
	},

	features: {
		// Auto-response to the person who filled out the form is a paid add-on.
		// Off by default — flip to true once the client's paid for it.
		autoResponseEmail: false,
	},

	formFields: [
		{
			name: 'name',
			label: 'Name',
			required: true,
			type: 'text',
			placeholder: 'Your name',
		},
		{
			name: 'email',
			label: 'Email',
			required: true,
			type: 'email',
			placeholder: 'you@example.com',
		},
		{
			name: 'phoneNumber',
			label: 'Phone Number',
			required: true,
			type: 'tel',
			placeholder: '(123) 456-7890',
		},
		{
			name: 'inquiryType',
			label: 'Inquiry Type',
			required: false,
			type: 'select',
			placeholder: 'Custom rod / In-stock rod / Reels / Other',
			options: [
				{ value: 'Custom rod', label: 'Custom rod' },
				{ value: 'In-stock rod', label: 'In-stock rod' },
				{ value: 'Reels', label: 'Reels' },
				{ value: 'Other', label: 'Other' },
			],
		},
		{
			name: 'message',
			label: 'How can we help?',
			required: false,
			type: 'textarea',
			placeholder: 'Tell us what you are looking for...',
		},
		// Add fields here as needed — supported types: text, email, tel, textarea, select, radio.
		// select/radio need an `options: [{ value, label }]` array.
	],

	messaging: {
		clientEmailSubject: (name) => `New Website Inquiry from ${name}`,
		autoResponseSubject: (name) => `${name}, We Received Your Message`,

		clientNotificationEyebrow: 'New Website Inquiry',
		clientNotificationHeading: 'New Contact Form Submission',
		clientNotificationIntro:
			"You have received a new message from your website's contact form.",

		autoResponseEyebrow: 'Message Received',
		autoResponseGreeting: (name) => `Thanks for reaching out, ${name}!`,
		autoResponseBody:
			"We've received your message and will be in touch within 1-2 business days.",
		autoResponseUrgentNote:
			'If you have any urgent questions, feel free to call us directly.',
		signoffLabel: 'Best regards,',
		autoResponseClosing: 'Chris and Joe<br/>C&J Custom Rods',
	},
};
