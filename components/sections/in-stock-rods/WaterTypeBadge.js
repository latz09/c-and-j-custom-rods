const STYLES = {
	'open-water': { label: 'Open water', bg: 'bg-[#E3F3D7]', text: 'text-[#2F6B2F]' },
	ice: { label: 'Ice fishing', bg: 'bg-[#DCEBFB]', text: 'text-[#1B4C82]' },
};

export default function WaterTypeBadge({ type, outOfStock = false, comingSoon = false }) {
	if (comingSoon) {
		return (
			<span className="absolute right-3 top-3 rounded-full bg-gray-200 px-3 py-1 text-xs font-semibold text-gray-600">
				Coming soon
			</span>
		);
	}

	const style = STYLES[type];
	if (!style) return null;

	return (
		<div className="absolute right-3 top-3 flex flex-col items-end gap-1.5">
			<span className={`rounded-full px-3 py-1 text-xs font-semibold ${style.bg} ${style.text}`}>
				{style.label}dd
			</span>
			{outOfStock && (
				<span className="rounded-full bg-gray-200 px-3 py-1 text-xs font-semibold text-gray-600">
					Out of stock
				</span>
			)}
		</div>
	);
}