'use client'

import { MotionConfig, motion } from 'framer-motion'
import { ComponentPropsWithoutRef, ElementType } from 'react'

type Props<T extends ElementType> = {
  as?: T
  delay?: number
  y?: number
  once?: boolean
  className?: string
  children?: React.ReactNode
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'className' | 'children'>

export default function Reveal<T extends ElementType = 'div'>({
  as,
  delay = 0,
  y = 24,
  once = true,
  className,
  children,
  ...rest
}: Props<T>) {
  const Tag = (as || 'div') as ElementType
  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        initial={{ opacity: 0, y, filter: 'blur(6px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once, amount: 0.2 }}
        transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
        className={className}
      >
        <Tag {...(rest as any)}>{children}</Tag>
      </motion.div>
    </MotionConfig>
  )
}


