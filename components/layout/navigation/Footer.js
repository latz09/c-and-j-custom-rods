import Link from 'next/link';
import Logo from '../../lib/Logo';
import Topography from '@/components/ui/Topography';

const currentYear = new Date().getFullYear();

const Footer = ({ businessName }) => {
	return (
		<footer className='relative overflow-hidden bg-dark py-12 z-[999999]'>
			<Topography variant="light" fade="top" opacity={1} />
			<div className='relative z-10 section-x-padding'>
				<Logo variant='stacked' className='h-auto' />
			</div>
			{/* <CopyRight businessName={businessName} /> */}
		</footer>
	);
};

export default Footer;

const CopyRight = ({ businessName = 'Your Business Name' }) => {
	return (
		<div className='text-center pb-3 mt-2 px-2  grid gap-3 text-dark'>
			<Link href='/legal/privacy-policy'>
				<span className='text-xs font-semibold'>Privacy Policy</span>
			</Link>

			<p>{`© ${currentYear} by ${businessName}`}</p>
		
		</div>
	);
};

