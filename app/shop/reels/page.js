// /shop/reels/page.js

import { buildPageMetadata as BPM } from '@/utils/seo/buildPageMetadata';
import { fetchContent as fc } from '@/utils/cms/fetchContent';
import { getProductsByCollection } from '@/utils/shopify/getProductsByCollection';
import { FETCH_REELS_PAGE_QUERY as Q } from '@/data/queries/pages/FETCH_REELS_PAGE_QUERY';
import PageContainer from '@/components/animations/PageContainer';
import ReelsHero from '@/components/sections/reels/ReelsHero';
import ReelCard from '@/components/sections/reels/ReelCard';

export async function generateMetadata() {
	return BPM({ slug: '/shop/reels', query: Q });
}

const ReelsHub = async () => {
	const [data, products] = await Promise.all([
		fc(Q),
		getProductsByCollection('reels'),
	]);

	return (
		<PageContainer>
			<ReelsHero data={data?.hero} />
			<div>
        <h2 className="section-x-padding">{data?.gridHeading}</h2>
				<section className='grid md:grid-cols-2 gap-2 section-x-padding py-2.5 lg:py-3.5'>
					{products.map((product, index) => (
						<ReelCard key={product.id} product={product} index={index} />
					))}
				</section>
			</div>
		</PageContainer>
	);
};

export default ReelsHub;

export const revalidate = 10;
