import Link from 'next/link';

export default function ReelBreadcrumb({ title }) {
	return (
		<nav>
			<Link
				href='/shop/reels'
				className='text-dark text-paragraph-sm font-[500] hover:text-primary transition duration-300'
			>
				Reels /
			</Link>{' '}
			<span className='text-dark text-paragraph-sm font-[500]'>{title}</span>
		</nav>
	);
}