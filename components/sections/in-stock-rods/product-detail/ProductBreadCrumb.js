import Link from 'next/link';

export default function ProductBreadcrumb({ seriesInfo, seriesTag, title }) {
	return (
		<nav>
			<Link
				href='/shop/rods'
				className='text-dark text-paragraph-sm font-[500] hover:text-primary transition duration-300'
			>
				In stock rods /
			</Link>{' '}
			<Link
				href={`/shop/rods/${seriesTag}`}
				className='text-dark text-paragraph-sm font-[500] hover:text-primary transition duration-300'
			>
				{seriesInfo?.name ?? seriesTag} /
			</Link>{' '}
			<span className='text-dark text-paragraph-sm font-[500]'>{title}</span>
		</nav>
	);
}