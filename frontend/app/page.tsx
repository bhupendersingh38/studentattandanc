'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Camera, BarChart3, Users, Shield, Brain, Smartphone } from 'lucide-react'

export default function Home() {
  const router = useRouter()

  const features = [
    {
      icon: Camera,
      title: 'Face Recognition',
      description: 'AI-powered real-time face detection and recognition with 90%+ accuracy'
    },
    {
      icon: Shield,
      title: 'Anti-Spoofing',
      description: 'Advanced liveness detection prevents proxy attendance fraud'
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Real-time insights, trends, and predictive analytics'
    },
    {
      icon: Brain,
      title: 'ML Predictions',
      description: 'Predict at-risk students and attendance patterns'
    },
    {
      icon: Users,
      title: 'Smart Profiles',
      description: 'Comprehensive student profiles with attendance history'
    },
    {
      icon: Smartphone,
      title: 'Mobile App',
      description: 'Access from anywhere with iOS and Android apps'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Header */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="glass sticky top-0 z-50 backdrop-blur-xl"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
              <Camera className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
              AttendX AI
            </h1>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => router.push('/login')}
              className="btn-secondary"
            >
              Login
            </button>
            <button 
              onClick={() => router.push('/dashboard')}
              className="btn-primary"
            >
              Dashboard
            </button>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-6xl font-bold mb-6 bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-500 bg-clip-text text-transparent">
            Smart Face Recognition
            <br />
            Attendance System
          </h2>
          <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto">
            Transform your campus with AI-powered attendance management. 
            Real-time recognition, anti-spoofing, and predictive analytics all in one platform.
          </p>
          <div className="flex gap-4 justify-center">
            <button 
              onClick={() => router.push('/dashboard')}
              className="btn-primary text-lg px-8 py-4"
            >
              Get Started
            </button>
            <button 
              onClick={() => router.push('/demo')}
              className="btn-secondary text-lg px-8 py-4"
            >
              View Demo
            </button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-20"
        >
          {[
            { value: '90%+', label: 'Recognition Accuracy' },
            { value: '<500ms', label: 'Detection Speed' },
            { value: '95%+', label: 'Anti-Spoofing Accuracy' },
            { value: '10,000+', label: 'Concurrent Users' }
          ].map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="text-4xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="text-gray-400 mt-2">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h3 className="text-4xl font-bold text-center mb-12">
            Powerful Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-card hover:border-primary-500/50"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-bold mb-2">{feature.title}</h4>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="glass mt-20">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center text-gray-400">
          <p>© 2024 AttendX AI. All rights reserved.</p>
          <p className="mt-2">Built with ❤️ for Smart Campuses</p>
        </div>
      </footer>
    </div>
  )
}
