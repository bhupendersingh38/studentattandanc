'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, UserCheck, UserX, AlertTriangle, 
  Camera, BarChart3, Calendar, TrendingUp 
} from 'lucide-react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import Sidebar from '@/components/Sidebar'
import StatCard from '@/components/StatCard'
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export default function Dashboard() {
  const [stats, setStats] = useState({
    total_students: 500,
    present_today: 450,
    absent_today: 50,
    present_percentage: 90.0,
    attendance_trend: [],
    top_performers: [],
    at_risk_students: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/v1/analytics/dashboard`)
      setStats({
        total_students: response.data.total_students || 0,
        present_today: response.data.present_today || 0,
        absent_today: response.data.absent_today || 0,
        present_percentage: response.data.today_percentage || 0,
        attendance_trend: response.data.attendance_trend || [],
        top_performers: response.data.top_performers || [],
        at_risk_students: response.data.at_risk_students || []
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      // Set default empty state if API fails
      setStats({
        total_students: 0,
        present_today: 0,
        absent_today: 0,
        present_percentage: 0,
        attendance_trend: [],
        top_performers: [],
        at_risk_students: []
      })
    } finally {
      setLoading(false)
    }
  }

  const trendData = [
    { date: 'Mon', percentage: 88 },
    { date: 'Tue', percentage: 92 },
    { date: 'Wed', percentage: 87 },
    { date: 'Thu', percentage: 90 },
    { date: 'Fri', percentage: 85 },
    { date: 'Sat', percentage: 78 },
    { date: 'Sun', percentage: 82 },
  ]

  const subjectData = [
    { subject: 'Math', attendance: 92 },
    { subject: 'Physics', attendance: 88 },
    { subject: 'Chemistry', attendance: 90 },
    { subject: 'Biology', attendance: 85 },
    { subject: 'CS', attendance: 95 },
  ]

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-gray-400 mt-2">Welcome back! Here's your attendance overview.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Users}
            title="Total Students"
            value={stats.total_students.toString()}
            subtitle="Enrolled"
            gradient="from-blue-500 to-cyan-500"
          />
          <StatCard
            icon={UserCheck}
            title="Present Today"
            value={stats.present_today.toString()}
            subtitle={`${stats.present_percentage}% attendance`}
            gradient="from-green-500 to-emerald-500"
          />
          <StatCard
            icon={UserX}
            title="Absent Today"
            value={stats.absent_today.toString()}
            subtitle={`${(100 - stats.present_percentage).toFixed(1)}% absent`}
            gradient="from-red-500 to-rose-500"
          />
          <StatCard
            icon={AlertTriangle}
            title="At Risk"
            value="15"
            subtitle="Below 75% attendance"
            gradient="from-yellow-500 to-orange-500"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Attendance Trend */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card"
          >
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-6 h-6 text-primary-500" />
              <h2 className="text-xl font-bold">Weekly Attendance Trend</h2>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="date" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{
                    background: 'rgba(15, 23, 42, 0.9)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="percentage" 
                  stroke="#6366f1" 
                  strokeWidth={3}
                  dot={{ fill: '#6366f1', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Subject-wise Attendance */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card"
          >
            <div className="flex items-center gap-3 mb-6">
              <BarChart3 className="w-6 h-6 text-secondary-500" />
              <h2 className="text-xl font-bold">Subject-wise Attendance</h2>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={subjectData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="subject" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{
                    background: 'rgba(15, 23, 42, 0.9)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="attendance" fill="url(#colorGradient)" radius={[8, 8, 0, 0]} />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={1} />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity={1} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Recent Activity & At Risk Students */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card"
          >
            <div className="flex items-center gap-3 mb-6">
              <Calendar className="w-6 h-6 text-green-500" />
              <h2 className="text-xl font-bold">Recent Activity</h2>
            </div>
            <div className="space-y-4">
              {[
                { student: 'John Doe', action: 'Marked Present', time: '2 minutes ago', status: 'success' },
                { student: 'Jane Smith', action: 'Marked Present', time: '5 minutes ago', status: 'success' },
                { student: 'Bob Johnson', action: 'Marked Absent', time: '10 minutes ago', status: 'error' },
                { student: 'Alice Williams', action: 'Marked Present', time: '15 minutes ago', status: 'success' },
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 glass rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${activity.status === 'success' ? 'bg-green-500' : 'bg-red-500'}`} />
                    <div>
                      <div className="font-semibold">{activity.student}</div>
                      <div className="text-sm text-gray-400">{activity.action}</div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-400">{activity.time}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* At Risk Students */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card"
          >
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle className="w-6 h-6 text-yellow-500" />
              <h2 className="text-xl font-bold">At Risk Students</h2>
            </div>
            <div className="space-y-4">
              {[
                { name: 'Mike Brown', percentage: 68, trend: 'down' },
                { name: 'Sarah Davis', percentage: 72, trend: 'down' },
                { name: 'Tom Wilson', percentage: 74, trend: 'stable' },
                { name: 'Emma Martinez', percentage: 70, trend: 'down' },
              ].map((student, index) => (
                <div key={index} className="flex items-center justify-between p-3 glass rounded-lg">
                  <div>
                    <div className="font-semibold">{student.name}</div>
                    <div className="text-sm text-gray-400">ID: CS00{index + 1}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-yellow-500">{student.percentage}%</div>
                    <div className="text-xs text-red-400">↓ Declining</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
