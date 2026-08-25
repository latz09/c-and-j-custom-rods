import { notFound } from 'next/navigation';
import { fetchContent as fc } from '@/utils/cms/fetchContent';
import { getProductByHandle } from '@/utils/shopify/getProductByHandle';
import { getProductsByTagQuery } from '@/utils/shopify/getProductsByTagQuery';
import { FETCH_SERIES_LANDING_PAGE_QUERY as SERIES_Q } from '@/data/queries/pages/FETCH_SERIES_LANDING_PAGE_QUERY';
import { FETCH_PRODUCT_TESTIMONIAL_QUERY as TQ } from '@/data/queries/testimonials/FETCH_PRODUCT_TESTIMONIAL_QUERY';
import { FETCH_GLOBAL_CTA_QUERY as CQ } from '@/data/queries/globalCta/FETCH_GLOBAL_CTA_QUERY';
import PageContainer from '@/components/animations/PageContainer';
import RodSeriesHero from '@/components/sections/in-stock-rods/RodSeriesHero';
import RodCard from '@/components/sections/in-stock-rods/RodCard';
import CallToAction from '@/components/ui/CallToActions';
import { Link } from 'react-email';
import RodProductDetail from '@/components/sections/in-stock-rods/product-detail/RodProductDetail';

async function resolveSlug(slug) {
	const [series, product] = await Promise.all([
		fc(SERIES_Q, { slug }),
		getProductByHandle(slug),
	]);
	return { series, product };
}

export async function generateMetadata({ params }) {
	const { slug } = await params;
	const { series, product } = await resolveSlug(slug);
	return { title: series?.name ?? product?.title ?? 'Not Found' };
}

const RodsSlugPage = async ({ params }) => {
	const { slug } = await params;
	const { series, product } = await resolveSlug(slug);

	// ----- SERIES LANDING BRANCH -----
	if (series) {
		const tagQuery = `tag:'${series.applicationType}' AND tag:'${series.slug}'`;
		const products = await getProductsByTagQuery(tagQuery);

		return (
			<PageContainer>
				<RodSeriesHero data={series} />

				<div className='section-x-padding space-y-2.5 lg:space-y-3.5'>
					<h2>{`Rods in the ${series.name} Series`}</h2>
					<div className='  grid md:grid-cols-2 lg:grid-cols-3 gap-1.5 mt-1.5 lg:mt-1.25'>
						{products.map((p, index) => (
							<RodCard key={p.id} product={p} index={index} />
						))}
					</div>
				</div>

				{products.length === 0 && <p>No rods in this series yet.</p>}
				<div className='mt-5 lg:mt-8.75'>
					<CallToAction variant='product' />
				</div>
			</PageContainer>
		);
	}

	// ----- PRODUCT DETAIL BRANCH -----
	if (product) {
		const seriesTag =
			product.tags.find((t) => t !== 'open-water' && t !== 'ice') ?? '';

		const [testimonialData, ctaData, seriesInfo] = await Promise.all([
			fc(TQ, { seriesTag }),
			fc(CQ),
			fc(SERIES_Q, { slug: seriesTag }),
		]);

		const testimonial = testimonialData?.matched || testimonialData?.default;
		const ctaBanner = ctaData?.productCtaBanner;

		return (
			<PageContainer>
				<RodProductDetail
					product={product}
					testimonial={testimonial}
					seriesInfo={seriesInfo}
					seriesTag={seriesTag}
					ctaBanner={ctaBanner}
				/>
        <CallToAction variant='product' />
			</PageContainer>
		);
	}

	notFound();
};

export default RodsSlugPage;
export const revalidate = 10;
