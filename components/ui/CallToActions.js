import { fetchContent as fc } from '@/utils/cms/fetchContent';
import { FETCH_GLOBAL_CTA_QUERY as Q } from '@/data/queries/globalCta/FETCH_GLOBAL_CTA_QUERY';
import ButtonLink from '@/components/ui/ButtonLink';

const CallToAction = async ({ variant = 'triple' }) => {
	const data = await fc(Q);
	const banner = variant === 'product' ? data?.productCtaBanner : data?.tripleCtaBanner;

	if (!banner) return null;

	const { heading, body, ctaCustom, ctaInStock, ctaContact } = banner;

	return (
		<section className='bg-gradient-to-t from-secondary/40 via-secondary/0 to-light/0'>
			<div className='mx-auto lg:max-w-[65rem] text-center pb-5 lg:pb-8.75 '>
				<h3 className="mb-1.5 section-x-padding" >{heading}</h3>
				<p className='text-paragraph-lg section-x-padding'>{body}</p>

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
							variant='secondary-on-light'
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
<CallToAction variant="product" /> */
}