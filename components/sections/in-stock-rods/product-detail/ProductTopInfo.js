import ProductBreadcrumb from "./ProductBreadCrumb";

export default function ProductTopInfo({ seriesInfo, seriesTag, title, price, availableForSale }) {
	return (
		<div>
			<ProductBreadcrumb seriesInfo={seriesInfo} seriesTag={seriesTag} title={title} />

			<p className='mt-1.25 text-[#498000] text-paragraph-sm font-[700] mb-0.5'>{availableForSale ? '• In stock' : '• Out of stock'}</p>

			<h1 className='h1-product normal-case mb-1.25'>{title}</h1>

			<h5 className='text-primary mb-2.5 lg:mb-1.25'>${Number(price).toFixed(2)}</h5>
		</div>
	);
}