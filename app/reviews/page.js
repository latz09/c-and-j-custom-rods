import { buildPageMetadata as BPM } from '@/utils/seo/buildPageMetadata';
import { fetchContent as fc } from '@/utils/cms/fetchContent';
import { FETCH_REVIEWS_PAGE_QUERY as Q } from '@/data/queries/pages/FETCH_REVIEWS_PAGE_QUERY';
import PageContainer from '@/components/animations/PageContainer';
import ReviewHeading from '@/components/sections/reviews/ReviewHeading';
import ReviewsContainer from '@/components/sections/reviews/ReviewsContainer';
import CallToAction from '@/components/ui/CallToActions';

export async function generateMetadata() {
	return BPM({ slug: '/reviews', query: Q });
}

const Reviews = async () => {
	const data = await fc(Q);
	const { hero, testimonials } = data?.page || {};

	return (
		<PageContainer>
			<ReviewHeading data={hero} />
			<ReviewsContainer data={data.testimonials} />
			<CallToAction variant='triple' />
		</PageContainer>
	);
};

export default Reviews;

export const revalidate = 10;
