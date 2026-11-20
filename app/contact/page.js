import { buildPageMetadata as BPM } from '@/utils/seo/buildPageMetadata';
import { fetchContent as fc } from '@/utils/cms/fetchContent';
import { FETCH_CONTACT_PAGE_QUERY as Q } from '@/data/queries/pages/FETCH_CONTACT_PAGE_QUERY';
import PageContainer from '@/components/animations/PageContainer';
import ContactBusinessInfo from '@/components/sections/contact/ContactBusinessInfo';
import ContactFormPlaceholder from '@/components/sections/contact/ContactFormPlaceholder';

export async function generateMetadata() {
	return BPM({ slug: '/contact', query: Q });
}

const Contact = async () => {
	const data = await fc(Q);
	const { hero, businessInfo } = data?.page ?? {};

	const headline = hero?.headline || 'Get in touch';
	const subheadline =
		hero?.subheadline ||
		"Whether you're looking for a custom rod, have a question, or just want to say hi, drop us a message.";

	return (
		<PageContainer>
			<section className='bg-[linear-gradient(331deg,rgba(14,117,188,0)_46.37%,rgba(14,117,188,0.75)_189.03%)]'>
				{' '}
				<div className='section-x-padding pt-2 lg:pt-3 pb-5 lg:pb-8.75 grid lg:grid-cols-2 gap-3 lg:gap-5.5 lg:items-start'>
					<div className='space-y-2.5 lg:space-y-4'>
						<div className='space-y-1.25 lg:space-y-1.5'>
							<h1>{headline}</h1>
							<p className='text-callout max-w-[32rem]'>{subheadline}</p>
						</div>

						<ContactBusinessInfo data={businessInfo} />
					</div>

					<ContactFormPlaceholder />
				</div>
			</section>
		</PageContainer>
	);
};

export default Contact;

export const revalidate = 10;
