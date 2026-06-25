'use client'

import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'

interface StatCardProps {
  icon: LucideIcon
  title: string
  value: string
  subtitle: string
  gradient: string
}

export default function StatCard({ icon: Icon, title, value, subtitle, gradient }: StatCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="glass-card"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 bg-gradient-to-r ${gradient} rounded-lg flex items-center justify-center`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <div className="text-3xl font-bold mb-1">{value}</div>
      <div className="text-gray-400 text-sm mb-2">{title}</div>
      <div className="text-xs text-gray-500">{subtitle}</div>
    </motion.div>
  )
}
