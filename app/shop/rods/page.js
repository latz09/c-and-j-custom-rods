import { buildPageMetadata as BPM } from '@/utils/seo/buildPageMetadata';
import { fetchContent as fc } from '@/utils/cms/fetchContent';
import { getProductsByTagQuery } from '@/utils/shopify/getProductsByTagQuery';
import { getProductsByCollection } from '@/utils/shopify/getProductsByCollection';
import { FETCH_IN_STOCK_RODS_PAGE_QUERY as Q } from '@/data/queries/pages/FETCH_IN_STOCK_RODS_PAGE_QUERY';
import { FETCH_ALL_RODSERIES_QUERY as SERIES_Q } from '@/data/queries/rodSeries/FETCH_ALL_RODSERIES_QUERY';
import PageContainer from '@/components/animations/PageContainer';
import InStockRodHero from '@/components/sections/in-stock-rods/InStockRodHero';
import RodsBySeriesSection from '@/components/sections/in-stock-rods/RodsBySeriesSection';
import AllRodsSection from '@/components/sections/in-stock-rods/AllRodsSection';
import CallToAction from '@/components/ui/CallToActions';

export async function generateMetadata() {
	return BPM({ slug: '/shop/rods', query: Q });
}

const InStockRods = async () => {
	const [data, seriesList] = await Promise.all([fc(Q), fc(SERIES_Q)]);
	const { hero, bySeries, fullGrid, season } = data?.page || {};

	const [seriesWithProducts, allRods] = await Promise.all([
		Promise.all(
			(seriesList ?? []).map(async (series) => {
				const products = await getProductsByTagQuery(
					`tag:'${series.applicationType}' AND tag:'${series.slug}'`,
				);
				return { ...series, products };
			}),
		),
		getProductsByCollection('in-stock-rods'),
	]);

	return (
		<PageContainer>
			<InStockRodHero data={hero} />
			<RodsBySeriesSection
				heading={bySeries?.heading}
				subheading={bySeries?.subheading}
				series={seriesWithProducts}
				season={season}
			/>
			<AllRodsSection
				heading={fullGrid?.heading}
				subheading={fullGrid?.subheading}
				products={allRods}
				seriesList={seriesList ?? []}
				season={season}
			/>
			<CallToAction variant='product' />
		</PageContainer>
	);
};
export default InStockRods;

export const revalidate = 10;