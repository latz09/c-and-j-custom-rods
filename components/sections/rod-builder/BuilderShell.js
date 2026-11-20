'use client';

import { useReducer } from 'react';
import SanityImage from '@/components/ui/SanityImage';
import { emptyBuildConfig } from '@/lib/builder/constants';
import { getBuildPrice, getStickerMax } from '@/lib/builder/pricing';
import { validateBuild } from '@/lib/builder/validateBuild';
import BuilderBreadcrumb from './BuilderBreadcrumb';
import BuilderHeader from './BuilderHeader';
import BuilderSection from './BuilderSection';
import ApplicationSelect from './ApplicationSelect';
import BlankColorSelect from './BlankColorSelect';
import LengthSelect from './LengthSelect';
import ThreadColorSelect from './ThreadColorSelect';
import GripSelect from './GripSelect';
import StickerInput from './StickerInput';
import BuildSummary from './BuildSummary';
import MobileBuildBar from './MobileBuildBar';
import AddBuildToCartButton from './AddBuildToCartButton';
import { formatPrice } from './formatPrice';

const reducer = (config, { field, value }) => ({ ...config, [field]: value });

const BuilderShell = ({ catalog, copy, rules, basePrice }) => {
	const [config, dispatch] = useReducer(
		reducer,
		catalog.slug,
		emptyBuildConfig,
	);
	const set = (field) => (value) => dispatch({ field, value });

	const isIce = catalog.applicationType === 'ice';
	const price = getBuildPrice(config, catalog, rules, basePrice ?? 0);
	const stickerMax = getStickerMax(rules);
	const validation = validateBuild(config, catalog, rules);
	// Null only if Shopify didn't return the base price. Then the total is hidden and add to cart is off.
	const hasBasePrice = basePrice != null;

	const cartButton = (
		<AddBuildToCartButton
			config={config}
			catalog={catalog}
			rules={rules}
			validation={validation}
			hasBasePrice={hasBasePrice}
		/>
	);

	// Guided flow: a section is full opacity once it has a pick or is the current step (the first
	// required section still empty). Optional sections light up when the step reaches them.
	const steps = [
		...(isIce
			? [
					{ key: 'blank', done: !!config.blankId, required: true },
					{ key: 'length', done: !!config.length, required: true },
				]
			: [
					{ key: 'application', done: !!config.applicationKey, required: true },
					{ key: 'blank', done: !!config.blankId, required: true },
				]),
		{ key: 'primary', done: !!config.primaryThreadId, required: true },
		{ key: 'accent', done: !!config.accentThreadId, required: false },
		{ key: 'grip', done: !!config.gripId, required: true },
		{ key: 'sticker', done: !!config.stickerText?.trim(), required: false },
	];
	const currentIndex = steps.findIndex((s) => s.required && !s.done);
	const isActive = (key) => {
		const index = steps.findIndex((s) => s.key === key);
		// Sections that aren't a step for this series (e.g. application on ice) are built but never shown.
		if (index === -1) return true;
		return steps[index].done || currentIndex === -1 || index <= currentIndex;
	};

	const accentNote =
		rules?.accentPrice > 0 ? `+${formatPrice(rules.accentPrice)}` : null;
	const stickerNote =
		rules?.stickerPrice > 0 ? `+${formatPrice(rules.stickerPrice)}` : null;

	const applicationSection = (
		<BuilderSection
			key='application'
			active={isActive('application')}
			label={copy?.applicationLabel || 'Select application'}
			priceNote={`${catalog.applications?.length ?? 0} options`}
		>
			<ApplicationSelect
				applications={catalog.applications}
				value={config.applicationKey}
				onChange={set('applicationKey')}
			/>
		</BuilderSection>
	);

	const blankSection = (
		<BuilderSection
			key='blank'
			active={isActive('blank')}
			label={copy?.blankColorLabel || 'Blank color'}
		>
			<BlankColorSelect
				blanks={catalog.blanks}
				value={config.blankId}
				onChange={set('blankId')}
			/>
		</BuilderSection>
	);

	const lengthSection = (
		<BuilderSection
			key='length'
			active={isActive('length')}
			label={copy?.lengthLabel || 'Rod length'}
		>
			<LengthSelect
				lengths={rules?.iceLengths}
				value={config.length}
				onChange={set('length')}
			/>
		</BuilderSection>
	);

	return (
		<div className='section-x-padding mt-1 lg:mt-2 pb-24 lg:pb-5 grid gap-1.5 lg:grid-cols-5 lg:gap-3 '>
			<div className='lg:col-span-2 lg:self-start lg:sticky lg:top-1.5 '>
				<div className='relative overflow-hidden rounded border border-accent bg-gradient-to-b from-light via-accent/0 to-accent/60 p-1.5'>
					<SanityImage
						image={catalog.image}
						alt={catalog.name}
						preset='catalog'
						className='mx-auto aspect-square h-auto w-full max-w-[22rem] lg:max-w-[27.41rem]'
						sizes='(min-width: 1024px) 27.5rem, 22rem'
					/>
				</div>
				{/* Desktop button lives in the card; mobile uses MobileBuildBar */}
				<BuildSummary
					config={config}
					catalog={catalog}
					price={price}
					hasBasePrice={hasBasePrice}
					action={<div className='hidden lg:block'>{cartButton}</div>}
				/>
			</div>

			<div className='lg:col-span-3'>
				<BuilderBreadcrumb
					seriesName={catalog.name}
					applicationType={catalog.applicationType}
				/>
				<BuilderHeader name={catalog.name} basePrice={basePrice} />

				{/* Ice: blank, length. Open water: application, blank. */}
				{isIce
					? [blankSection, lengthSection]
					: [applicationSection, blankSection]}

				<BuilderSection
					active={isActive('primary')}
					label={copy?.primaryThreadLabel || 'Primary thread color'}
				>
					<ThreadColorSelect
						id='primary-thread'
						threads={catalog.threads}
						value={config.primaryThreadId}
						onChange={set('primaryThreadId')}
					/>
				</BuilderSection>

				<BuilderSection
					active={isActive('accent')}
					label={copy?.accentThreadLabel || 'Accent thread color (optional)'}
					priceNote={accentNote}
					helperText={copy?.accentHelperText}
				>
					<ThreadColorSelect
						id='accent-thread'
						threads={catalog.threads}
						value={config.accentThreadId}
						onChange={set('accentThreadId')}
						optional
					/>
				</BuilderSection>

				<BuilderSection
					active={isActive('grip')}
					label={copy?.gripLabel || 'Grip'}
				>
					<GripSelect
						grips={catalog.grips}
						waterType={catalog.applicationType}
						rules={rules}
						value={config.gripId}
						onChange={set('gripId')}
					/>
				</BuilderSection>

				<BuilderSection
					active={isActive('sticker')}
					label={copy?.stickerLabel || 'Personalized sticker (optional)'}
					priceNote={stickerNote}
					helperText={copy?.stickerHelperText}
				>
					<StickerInput
						value={config.stickerText}
						onChange={set('stickerText')}
						maxLength={stickerMax}
					/>
				</BuilderSection>

				{copy?.leadTimeNote && (
					<p className='mt-2 text-caption'>{copy.leadTimeNote}</p>
				)}
			</div>

			<MobileBuildBar
				price={price}
				hasBasePrice={hasBasePrice}
				action={cartButton}
			/>
		</div>
	);
};

export default BuilderShell;
