import { Analytics } from '@vercel/analytics/next';


import Footer from '@/components/layout/navigation/Footer';
import { fetchSeoSettings } from '@/utils/cms/fetchSeoSettings';
import { buildOrganizationSchema } from '@/lib/seo/buildOrganizationSchema';
import JsonLd from '@/components/seo/JsonLd';
import NavigationContainer from '@/components/layout/navigation/NavigationContainer';
import './globals.css';
import { Roboto_Condensed } from 'next/font/google';

// Guide uses a single family — Roboto Condensed — for both headings and
// body copy, at weights 400 (body/paragraphs), 500 (buttons/links), and
// 600 (headings H1-H6). No italics used anywhere in the guide. Loaded
// twice so it can feed both CSS vars the config/globals reference.
const robotoCondensedHeading = Roboto_Condensed({
	subsets: ['latin'],
	weight: ['600'],
	display: 'swap',
	variable: '--font-heading',
});

const robotoCondensedBody = Roboto_Condensed({
	subsets: ['latin'],
	weight: ['400', '500'],
	display: 'swap',
	variable: '--font-body',
});

export async function generateMetadata() {
	const seo = await fetchSeoSettings();
	if (!seo) return {};

	return {
		metadataBase: new URL(seo.siteUrl),
		applicationName: seo.siteName,
		title: {
			default: seo.defaultTitle,
			template: seo.titleTemplate,
		},
		description: seo.defaultDescription,
		keywords: seo.keywords,
		icons: { icon: '/favicon.ico' },
		verification: {
			google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '',
		},
		openGraph: {
			title: seo.defaultTitle,
			description: seo.defaultDescription,
			url: seo.siteUrl,
			siteName: seo.siteName,
			images: [{ url: seo.ogImage, width: 1200, height: 630 }],
			type: 'website',
		},
		twitter: {
			card: 'summary_large_image',
			title: seo.defaultTitle,
			description: seo.defaultDescription,
			...(seo.twitterHandle && { creator: seo.twitterHandle }),
			images: [seo.ogImage],
		},
	};
}

export default async function RootLayout({ children }) {
	const seo = await fetchSeoSettings(); // same cached call — no extra Sanity hit
	const schema = buildOrganizationSchema(seo);

	return (
		<html lang='en'>
			<body
				className={`min-h-screen ${robotoCondensedHeading.variable} ${robotoCondensedBody.variable}`}
			>
				{schema && <JsonLd data={schema} />}
				<NavigationContainer />
				{children}
				<Analytics />
				<Footer businessName={seo?.siteName} />
				
				{/* {(await draftMode()).isEnabled && <VisualEditingClient />} */}
			</body>
		</html>
	);
}