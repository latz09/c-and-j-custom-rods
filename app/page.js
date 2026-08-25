import { buildPageMetadata as BPM } from '@/utils/seo/buildPageMetadata';
import { fetchContent as fc } from '@/utils/cms/fetchContent';
import { getProductByHandle } from '@/utils/shopify/getProductByHandle';
import { FETCH_HOME_PAGE_QUERY as Q } from '@/data/queries/pages/FETCH_HOME_PAGE_QUERY';
import PageContainer from '@/components/animations/PageContainer';
import Hero from '@/components/sections/home-page/Hero';
import FeaturedProduct from '@/components/sections/home-page/FeaturedProduct';
import Collections from '@/components/sections/home-page/Collections';
import AboutBlurb from '@/components/sections/home-page/AboutBlurb';
import CallToAction from '@/components/ui/CallToActions';

export async function generateMetadata() {
	return BPM({ slug: '/', query: Q });
}

const Home = async () => {
	const data = await fc(Q);

	const { hero, shopCollections, aboutBlurb } = data ? data : {};

	const featuredProduct = data?.featuredProduct?.productHandle
		? await getProductByHandle(data.featuredProduct.productHandle)
		: null;

	return (
		<PageContainer>
			<Hero data={hero} />
			<div className='bg-dark space-y-5 lg:space-y-8.75 lg:pt-8.75 pb-5 lg:pb-8.75'>
				<FeaturedProduct
					featuredProduct={featuredProduct}
					data={data.featuredProduct}
				/>
				<Collections data={shopCollections} />
			</div>
			<AboutBlurb data={aboutBlurb} />
			<CallToAction variant='triple' />
		</PageContainer>
	);
};

export default Home;

export const revalidate = 10;
