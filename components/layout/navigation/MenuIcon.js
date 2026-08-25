'use client';

import { motion } from 'framer-motion';

const MenuIcon = ({ toggleNav, isNavOpen, variant = 'dark' }) => {
	const lineColor = variant === 'light' ? 'bg-light' : 'bg-dark';

	return (
		<button className={`z-[99999] text-3xl ${variant === 'light' ? 'text-light' : 'text-dark'}`} onClick={toggleNav}>
			<motion.div
				className='cursor-pointer'
				whileHover={{ scale: 1.1 }}
				whileTap={{ scale: 0.9 }}
			>
				<div className='flex flex-col space-y-0.25'>
					<span
						className={`block w-2 h-0.25 ${lineColor} transition-all duration-300 origin-center ${
							isNavOpen ? 'rotate-45 translate-y-[0.5rem]' : ''
						}`}
					/>
					<span
						className={`block w-2 h-0.25 ${lineColor} transition-all duration-300 ${
							isNavOpen ? 'opacity-0' : ''
						}`}
					/>
					<span
						className={`block w-2 h-0.25 ${lineColor} transition-all duration-300 origin-center ${
							isNavOpen ? '-rotate-45 -translate-y-[0.5rem]' : ''
						}`}
					/>
				</div>
			</motion.div>
		</button>
	);
};

export default MenuIcon;