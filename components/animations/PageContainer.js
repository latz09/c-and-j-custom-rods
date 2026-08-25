'use client';

import { motion } from 'framer-motion';
const PageContainer = ({ children, className }) => {
	return (
		<motion.main
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 2 }}
			className={`${className} pt-[10vh] `}
		>
			{children}
		</motion.main>
	);
};

export default PageContainer;
