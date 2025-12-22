"use client"

import Link from "next/link"
import { motion } from "framer-motion"

interface CTAButtonsProps {
  button1Text?: string
  button1Href?: string
  button2Text?: string
  button2Href?: string
  onButton1Click?: () => void
  onButton2Click?: () => void
  variant?: "black" | "white"
}

export default function CTAButtons({
  button1Text = "SHOP NOW",
  button1Href = "/shop",
  button2Text = "EXPLORE",
  button2Href = "/gallery",
  onButton1Click,
  onButton2Click,
  variant = "black",
}: CTAButtonsProps) {
  const buttonClass = variant === "white" ? `
    w-[300px] h-[55px]
    px-10 py-3.5
    border border-white
    text-white
    hover:bg-white hover:text-black
    transition-all duration-300
    text-base tracking-widest uppercase font-light
    flex items-center justify-center
    whitespace-nowrap
  ` : `
    w-[300px] h-[55px]
    px-10 py-3.5
    border border-black
    text-black
    hover:bg-black hover:text-white
    transition-all duration-300
    text-base tracking-widest uppercase font-light
    flex items-center justify-center
    whitespace-nowrap
  `

  const ButtonContent = ({ text, onClick }: { text: string; onClick?: () => void }) => (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={buttonClass}
      style={{ fontFamily: 'var(--font-brand)' }}
    >
      {text}
    </motion.button>
  )

  return (
    <div className="w-full flex items-center justify-center">
      <div className="flex flex-col sm:flex-row gap-4 md:gap-6 items-center justify-center">
        {button1Href && !onButton1Click ? (
          <Link href={button1Href}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <button className={buttonClass} style={{ fontFamily: 'var(--font-brand)' }}>
                {button1Text}
              </button>
            </motion.div>
          </Link>
        ) : (
          <ButtonContent text={button1Text} onClick={onButton1Click} />
        )}

        {button2Href && !onButton2Click ? (
          <Link href={button2Href}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <button className={buttonClass} style={{ fontFamily: 'var(--font-brand)' }}>
                {button2Text}
              </button>
            </motion.div>
          </Link>
        ) : (
          <ButtonContent text={button2Text} onClick={onButton2Click} />
        )}
      </div>
    </div>
  )
}

