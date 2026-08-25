import Link from 'next/link';

export default function ApparelBreadcrumb({ title }) {
	return (
		<nav>
			<Link
				href='/shop/apparel'
				className='text-dark text-paragraph-sm font-[500] hover:text-primary transition duration-300'
			>
				Apparel /
			</Link>{' '}
			<span className='text-dark text-paragraph-sm font-[500]'>{title}</span>
		</nav>
	);
}