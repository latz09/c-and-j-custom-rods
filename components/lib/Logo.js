import VerticalLogo from '@/public/images/custom-fishing-rods.svg';
import StackedLogo from '@/public/images/custom-ice-fishing-rods.svg';
import Link from 'next/link';

const logos = {
	vertical: VerticalLogo,
	stacked: StackedLogo,
};

const Logo = ({ className, url, variant = 'vertical' }) => {
	const LogoComponent = logos[variant] || VerticalLogo;

	return (
		<Link href={url || '/'} className='z-[9999] block h-'>
			<LogoComponent className={className} />
		</Link>
	);
};

export default Logo;