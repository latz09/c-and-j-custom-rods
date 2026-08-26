'use client';
import Topography from '@/components/ui/Topography';
import { track } from '@vercel/analytics';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import MenuIcon from '../layout/navigation/MenuIcon';
import Logo from '../lib/Logo';
import { Arrow } from '@/components/ui/ButtonLink';

const DARK_NAV_ROUTES = ['/about'];
const EASE = [0.25, 0.46, 0.45, 0.94]; // same signature as StickyNav — one motion language, not two

const MobileNavbar = ({ navLinks = [], logoUrl }) => {
	const [isNavOpen, setIsNavOpen] = useState(false);
	const pathname = usePathname();
	const isDark = DARK_NAV_ROUTES.includes(pathname);

	const toggleNav = () => setIsNavOpen(!isNavOpen);

	const handleNavClick = (label, url) => {
		track(`CTA Click - Mobile Nav - ${label}`, {
			destination: url,
			buttonText: label,
		});
		toggleNav();
	};

	const mainLinks = navLinks.filter((link) => !link.isButton);
	const contactLink = navLinks.find((link) => link.isButton);

	useEffect(() => {
		if (isNavOpen) {
			const scrollY = window.scrollY;
			document.body.style.position = 'fixed';
			document.body.style.top = `-${scrollY}px`;
			document.body.style.left = '0';
			document.body.style.right = '0';
			document.body.style.overflow = 'hidden';
			document.body.dataset.scrollY = scrollY;
		} else {
			const scrollY = document.body.dataset.scrollY || '0';
			document.body.style.position = '';
			document.body.style.top = '';
			document.body.style.left = '';
			document.body.style.right = '';
			document.body.style.overflow = '';
			window.scrollTo(0, parseInt(scrollY));
		}
	}, [isNavOpen]);

	const overlayVariants = {
		closed: { opacity: 0 },
		open: { opacity: 1 },
	};

	const menuVariants = {
		closed: { x: '100%' },
		open: { x: '0%' },
	};

	const linkContainerVariants = {
		closed: { opacity: 0 },
		open: {
			opacity: 1,
			transition: {
				staggerChildren: 0.07,
				delayChildren: 0.25,
			},
		},
	};

	const linkVariants = {
		closed: { x: 32, opacity: 0 },
		open: { x: 0, opacity: 1, transition: { duration: 0.5, ease: EASE } },
	};

	return (
		<div
			className={`w-full lg:hidden flex items-center justify-between backdrop-blur-lg h-[10vh] ${
				isDark ? 'bg-dark/90' : 'bg-light/[44%]'
			}`}
		>
			<div className='relative z-20 w-full section-x-padding'>
				<header className='flex items-center justify-between'>
					<Logo
						className='w-[12rem]'
						variant={isDark ? 'verticalWhite' : 'vertical'}
					/>
					<MenuIcon
						isNavOpen={isNavOpen}
						toggleNav={toggleNav}
						variant={isNavOpen ? 'dark' : isDark ? 'light' : 'dark'}
					/>
				</header>
			</div>

			{typeof document !== 'undefined' &&
				createPortal(
					<AnimatePresence>
						{isNavOpen && (
							<>
								{/* Overlay */}
								<motion.div
									className='fixed inset-0 bg-light/75 backdrop-blur z-[9998]'
									variants={overlayVariants}
									initial='closed'
									animate='open'
									exit='closed'
									transition={{ duration: 0.35, ease: EASE }}
									onClick={toggleNav}
								/>

								{/* Menu Panel */}
								<motion.nav
									className='fixed top-0 right-0 h-full w-[85%] max-w-[500px] bg-dark z-[9999] shadow-lifted border-l border-primary/20 overflow-hidden'
									variants={menuVariants}
									initial='closed'
									animate='open'
									exit='closed'
									transition={{ duration: 0.5, ease: EASE }}
									onClick={(e) => e.stopPropagation()}
									role='dialog'
									aria-modal='true'
								>
									<Topography variant='light' fade='top' opacity={0.5} />

									<div className='relative z-10 flex flex-col h-full px-xs py-xs'>
										{/* Header */}
										<motion.div
											initial={{ opacity: 0, y: -10 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ delay: 0.15, duration: 0.4, ease: EASE }}
											className='flex items-center justify-end mb-xl'
										>
											<MenuIcon
												isNavOpen={isNavOpen}
												toggleNav={toggleNav}
												variant='light'
											/>
										</motion.div>

										{/* Links */}
										<motion.ul
											className='flex-1 space-y-0.5'
											variants={linkContainerVariants}
											initial='closed'
											animate='open'
										>
											{mainLinks.map((link, index) => (
												<motion.li key={index} variants={linkVariants}>
													<Link
														href={link.url}
														onClick={() => handleNavClick(link.label, link.url)}
														className='group relative flex items-center justify-between py-0.75 border-b border-light/10'
													>
														<span className='flex items-baseline gap-0.75'>
															<h4 className='text-primary font-[700] tracking-wide'>
																{String(index + 1).padStart(2, '0')}
															</h4>
															<h5 className='text-light transition-colors duration-300 group-hover:text-primary'>
																{link.label}
															</h5>
														</span>

														<span className='inline-flex w-0 opacity-0 text-primary transition-all duration-300 ease-out group-hover:w-[1.2rem] group-hover:opacity-100'>
															<Arrow />
														</span>

														{/* underline draw-in, independent of the static border above */}
														<span className='absolute left-0 bottom-0 h-px w-full origin-left scale-x-0 bg-primary transition-transform duration-500 ease-out group-hover:scale-x-100' />
													</Link>
												</motion.li>
											))}
										</motion.ul>

										{/* Contact CTA */}
										{contactLink && (
											<motion.div
												initial={{ y: 20, opacity: 0 }}
												animate={{ y: 0, opacity: 1 }}
												transition={{ delay: 0.55, duration: 0.45, ease: EASE }}
												className='pt-xs  space-y-1.5'
											>
												<div className='flex justify-center pb-0.5'>
													<Logo
														className='w-[12rem]'
														variant='verticalWhite'
														url={logoUrl}
													/>
												</div>
												<Link
													href={contactLink.url}
													onClick={() =>
														handleNavClick(contactLink.label, contactLink.url)
													}
													className='w-full group text-button inline-flex items-center justify-center rounded-sm transition-all duration-500 py-0.75 px-1.25 bg-secondary  text-dark hover:bg-light'
												>
													<h6>{contactLink.label}</h6>
													<span className='inline-flex transition-transform duration-300 group-hover:translate-x-0.5'>
														<Arrow />
													</span>
												</Link>
											</motion.div>
										)}
									</div>
								</motion.nav>
							</>
						)}
					</AnimatePresence>,
					document.body,
				)}
		</div>
	);
};

export default MobileNavbar;
