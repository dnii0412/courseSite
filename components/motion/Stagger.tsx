'use client'

import { MotionConfig, motion } from 'framer-motion'
import { PropsWithChildren } from 'react'

export default function Stagger({ children, className }: PropsWithChildren<{ className?: string }>) {
  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        className={className}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
      >
        {children}
      </motion.div>
    </MotionConfig>
  )
}


