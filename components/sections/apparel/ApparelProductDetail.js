'use client';

import { useState, useMemo } from 'react';
import ApparelBreadcrumb from './ApparelBreadcrumb';
import ApparelOptionPicker from './ApparelOptionPicker';
import ApparelSpecsAndCta from './ApparelSpecsAndCta';
import ApparelGrid from './ApparelGrid';
import ProductGallery from '../in-stock-rods/product-detail/ProductGallery';

function buildInitialSelection(options, variants) {
	const firstAvailable =
		variants.find((v) => v.availableForSale) ?? variants[0];
	const initial = {};
	options.forEach((option) => {
		const match = firstAvailable?.selectedOptions.find(
			(so) => so.name === option.name,
		);
		initial[option.name] = match?.value ?? option.values[0];
	});
	return initial;
}

export default function ApparelProductDetail({ product, allApparel = [] }) {
	const {
		title,
		descriptionHtml,
		featuredImage,
		images,
		priceRange,
		metafields,
		options,
		variants,
	} = product;

	// Shopify returns a pseudo-option ("Title" / "Default Title") for products
	// with no real options — e.g. the one-size Snapback Hat. Filter it out.
	const realOptions = (options ?? []).filter(
		(o) =>
			!(
				o.name === 'Title' &&
				o.values.length === 1 &&
				o.values[0] === 'Default Title'
			),
	);

	const productVariants = variants?.edges?.map((e) => e.node) ?? [];

	const [selected, setSelected] = useState(() =>
		buildInitialSelection(realOptions, productVariants),
	);

	const selectedVariant = useMemo(
		() =>
			productVariants.find((v) =>
				v.selectedOptions.every((so) => selected[so.name] === so.value),
			) ?? productVariants[0],
		[selected, productVariants],
	);

	const handleSelect = (optionName, value) => {
		setSelected((prev) => ({ ...prev, [optionName]: value }));
	};

	const price =
		selectedVariant?.price?.amount ?? priceRange.minVariantPrice.amount;
	const availableForSale = selectedVariant?.availableForSale ?? false;

	const galleryImages = useMemo(() => {
		const base =
			images?.edges?.map((e) => e.node) ??
			(featuredImage ? [featuredImage] : []);
		if (selectedVariant?.image) {
			const rest = base.filter((img) => img.url !== selectedVariant.image.url);
			return [selectedVariant.image, ...rest];
		}
		return base;
	}, [images, featuredImage, selectedVariant]);

	const { short_description, ...specFields } = metafields ?? {};
	const specs = Object.entries(specFields).filter(([, value]) => value);

return (
	<div className='pb-5 lg:pb-8.75'>
		<div className='lg:min-h-[85vh] lg:flex lg:items-center'>
			<div className='mt-1 section-x-padding grid lg:grid-cols-2 lg:gap-5.5 lg:items-start w-full'>
				<div className='order-1 lg:order-2 flex flex-col'>
					<ApparelBreadcrumb title={title} />

					<p className='mt-1.25 text-[#498000] text-paragraph-sm font-[700] mb-0.5'>
						{availableForSale ? '• In stock' : '• Out of stock'}
					</p>

					<h1 className='h1-product normal-case mb-1.25'>{title}</h1>

					<h5 className='text-primary mb-2.5 lg:mb-1.25'>${Number(price).toFixed(2)}</h5>

					<div className='lg:hidden'>
						<ProductGallery key={selectedVariant?.id} images={galleryImages} title={title} />
					</div>

					{realOptions.length > 0 && (
						<ApparelOptionPicker
							options={realOptions}
							selected={selected}
							onSelect={handleSelect}
							variants={productVariants}
						/>
					)}

					<ApparelSpecsAndCta specs={specs} descriptionHtml={descriptionHtml} availableForSale={availableForSale} />
				</div>

				<div className='hidden lg:block lg:order-1 lg:sticky lg:top-[10vh] lg:self-start'>
					<ProductGallery key={selectedVariant?.id} images={galleryImages} title={title} />
				</div>
			</div>
		</div>

		{allApparel.length > 0 && (
			<div className='section-x-padding mt-5 lg:mt-8.75'>
				<h3 className='mb-2'>More Apparel</h3>
				<ApparelGrid products={allApparel} excludeHandle={product.handle} />
			</div>
		)}
	</div>
);
}
