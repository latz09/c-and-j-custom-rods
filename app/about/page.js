import { buildPageMetadata as BPM } from '@/utils/seo/buildPageMetadata';
import { fetchContent as fc } from '@/utils/cms/fetchContent';
import { FETCH_ABOUT_PAGE_QUERY as Q } from '@/data/queries/pages/FETCH_ABOUT_PAGE_QUERY';
import PageContainer from '@/components/animations/PageContainer';
import AboutHero from '@/components/sections/about-page/AboutHero';
import OurStory from '@/components/sections/about-page/OurStory';
import SuccessOnWater from '@/components/sections/about-page/SuccessOnWater';
import OurCommitment from '@/components/sections/about-page/OurCommitment';
import CallToAction from '@/components/ui/CallToActions';

export async function generateMetadata() {
	return BPM({ slug: '/about', query: Q });
}

const About = async () => {
	const data = await fc(Q);
	const { hero, story, successGallery, commitment } = data ? data : {};

	return (
		<PageContainer>
			<AboutHero data={hero} />
			<OurStory data={story} />
			<SuccessOnWater data={successGallery} />
			<OurCommitment data={commitment} />
			<CallToAction variant='triple' />
		</PageContainer>
	);
};

export default About;

export const revalidate = 10;
