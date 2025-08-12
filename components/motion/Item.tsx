'use client'

import { MotionConfig, motion } from 'framer-motion'
import { PropsWithChildren } from 'react'

export default function Item({ children, className }: PropsWithChildren<{ className?: string }>) {
  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        className={className}
        variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </MotionConfig>
  )
}


