import Image from 'next/image';

const FADE_PRESETS = {
	diagonal:
		'linear-gradient(135deg, transparent 0%, transparent 15%, black 90%)',
	corner: 'linear-gradient(135deg, transparent 0%, black 10%)',
	top: 'linear-gradient(to bottom, black 0%, black 70%, transparent 100%)',
};

const Topography = ({
	variant = 'light',
	fade = false,
	opacity = 1,
	className = '',
}) => {
	const src =
		variant === 'dark'
			? '/images/topography-dark.png'
			: '/images/topography-light.png';

	const preset = fade === true ? 'diagonal' : fade;
	const maskGradient = preset ? FADE_PRESETS[preset] : undefined;

	const style = {
		...(maskGradient && {
			maskImage: maskGradient,
			WebkitMaskImage: maskGradient,
		}),
		opacity,
	};

	return (
		<Image
			src={src}
			alt=""
			fill
			aria-hidden="true"
			style={style}
			className={`object-cover pointer-events-none rounded select-none ${className}`}
		/>
	);
};

export default Topography;