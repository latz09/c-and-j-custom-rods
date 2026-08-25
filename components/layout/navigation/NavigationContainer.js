import StickyNav from './StickyNav';
import { fetchContent as fc } from '@/utils/cms/fetchContent';
import { FETCH_NAVIGATION_QUERY as Q } from '@/data/queries/navigation/FETCH_NAVIGATION_QUERY';

const NavigationContainer = async () => {
	const data = await fc(Q);
	const navlinks = data?.navLinks || [];
	const logoUrl = data?.logo?.asset?.url || null;

	return <StickyNav navLinks={navlinks} logoUrl={logoUrl} />;
};

export default NavigationContainer;

export const revalidate = 10;