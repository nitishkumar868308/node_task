"use client";

import { motion } from "framer-motion";

export default function Loading() {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white">
            <motion.div
                className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
            ></motion.div>
        </div>
    );
}
