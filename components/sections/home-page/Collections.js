import { Arrow } from '@/components/ui/ButtonLink';
import Image from 'next/image';
import Link from 'next/link';

const Collections = ({ data }) => {
	const { heading, items } = data ? data : {};
	return (
		<div className='section-x-padding'>
			<h2 className='text-light mb-2'>{heading}</h2>
			<div className='grid grid-cols-1  md:grid-cols-2 2xl:grid-cols-4 gap-1.5 lg:gap-1.25'>
				{items?.map((item) => (
					<CollectionItem key={item.label} item={item} />
				))}
			</div>
		</div>
	);
};

export default Collections;

const CollectionItem = ({ item }) => {
	const { image, label, url } = item ? item : {};
	const imageUrl = image?.asset?.url;

	return (
		<Link
			href={url || '#'}
			className='group block [--aw:0.95rem] [--ag:0.62rem] sm:[--aw:1.08rem] md:[--aw:1.20956rem]'
		>
			<div className='bg-gradient-to-b from-[#c4c4c4] to-[#1f1f1f] border border-light rounded overflow-hidden flex flex-col items-center p-1 space-y-1.5'>
				{imageUrl && (
					<div className='relative w-full h-[15rem] md:h-[17rem] rounded'>
						<Image
							src={imageUrl}
							alt={label || ''}
							fill
							className='object-contain rounded transition-transform duration-500 ease-out group-hover:scale-[1.15] group-hover:z-10 relative'
						/>
					</div>
				)}
				<div className='flex justify-between items-center w-full text-light'>
					<h4 className='transition-all duration-500 text-light line-height-0'>
						{label}
					</h4>

					<Arrow className='scale-150 lg:scale-125' />
				</div>
			</div>
		</Link>
	);
};
