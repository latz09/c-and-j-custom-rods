import ApparelCard from "./ApparelCard";

export default function ApparelGrid({
	products,
	excludeHandle,
	className = 'grid md:grid-cols-2 gap-1.75 lg:gap-1.5 px-0 py-2.25',
}) {
	const visibleProducts = excludeHandle
		? products.filter((p) => p.handle !== excludeHandle)
		: products;

	if (visibleProducts.length === 0) return null;

	return (
		<section className={className}>
			{visibleProducts.map((product, index) => (
				<ApparelCard key={product.id} product={product} index={index} />
			))}
		</section>
	);
}