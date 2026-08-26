import { buildPageMetadata as BPM } from '@/utils/seo/buildPageMetadata';
import { fetchContent as fc } from '@/utils/cms/fetchContent';
import { getProductsByCollection } from '@/utils/shopify/getProductsByCollection';
import { FETCH_APPAREL_PAGE_QUERY as Q } from '@/data/queries/pages/FETCH_APPAREL_PAGE_QUERY';
import PageContainer from '@/components/animations/PageContainer';
import ApparelHero from '@/components/sections/apparel/ApparelHero';
import ApparelGrid from '@/components/sections/apparel/ApparelGrid';
import CallToAction from '@/components/ui/CallToActions';

export async function generateMetadata() {
	return BPM({ slug: '/shop/apparel', query: Q });
}

const ApparelHub = async () => {
	const [data, products] = await Promise.all([
		fc(Q),
		getProductsByCollection('apparel'),
	]);

	return (
		<PageContainer>
			<ApparelHero data={data?.hero} />
			<h2 className='section-x-padding'>{data?.gridHeading}</h2>
			<ApparelGrid
				products={products}
				className='grid md:grid-cols-2 lg:grid-cols-3  gap-2 section-x-padding py-2.5 lg:py-3.5'
			/>
			<div className='mt-5 lg:mt-8.75'>
				<CallToAction variant='triple' />
			</div>
		</PageContainer>
	);
};

export default ApparelHub;

export const revalidate = 10;
