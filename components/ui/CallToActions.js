import { fetchContent as fc } from '@/utils/cms/fetchContent';
import { FETCH_GLOBAL_CTA_QUERY as Q } from '@/data/queries/globalCta/FETCH_GLOBAL_CTA_QUERY';
import ButtonLink from '@/components/ui/ButtonLink';

const BANNER_KEYS = {
	triple: 'tripleCtaBanner',
	product: 'productCtaBanner',
	custom: 'customCtaBanner',
};

const CallToAction = async ({ variant = 'triple' }) => {
	const data = await fc(Q);
	const banner = data?.[BANNER_KEYS[variant] ?? BANNER_KEYS.triple];

	if (!banner) return null;

	const { heading, body, ctaCustom, ctaInStock, ctaContact } = banner;

	// Old documents still store body as a single string. Treat it as one paragraph.
	const paragraphs = Array.isArray(body) ? body : body ? [body] : [];

	return (
		<section className='bg-gradient-to-t from-secondary/40 via-secondary/0 to-light/0'>
			<div className='mx-auto lg:max-w-[65rem] text-center pb-5 lg:pb-8.75 '>
				<h3 className="mb-1.5 section-x-padding" >{heading}</h3>

				<div className='flex flex-col '>
					{paragraphs.map((paragraph, i) => (
						<p key={i} className='text-paragraph-lg section-x-padding'>
							{paragraph}
						</p>
					))}
				</div>

				<div className='mt-2.5 flex flex-col items-center lg:flex-row flex-wrap justify-center gap-1'>
					{ctaCustom?.url && (
						<ButtonLink
							href={ctaCustom.url}
							variant='primary-on-light'
							event={`Global CTA - ${variant} - Custom Rod Builder`}
						>
							{ctaCustom.label}
						</ButtonLink>
					)}

					{ctaInStock?.url && (
						<ButtonLink
							href={ctaInStock.url}
							variant={variant === 'custom' ? 'primary-on-light' : 'secondary-on-light'}
							event={`Global CTA - ${variant} - In-Stock Rods`}
						>
							{ctaInStock.label}
						</ButtonLink>
					)}

					{ctaContact?.url && (
						<ButtonLink
							href={ctaContact.url}
							variant='tertiary-on-light'
							event={`Global CTA - ${variant} - Contact`}
						>
							{ctaContact.label}
						</ButtonLink>
					)}
				</div>
			</div>
		</section>
	);
};

export default CallToAction;

{
	/* <CallToAction variant="triple" />
<CallToAction variant="product" />
<CallToAction variant="custom" /> */
}