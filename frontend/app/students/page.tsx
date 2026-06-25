'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, UserPlus, Filter } from 'lucide-react'
import Sidebar from '@/components/Sidebar'
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export default function StudentsPage() {
  const [students, setStudents] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/v1/students`)
      // Transform backend data to match frontend expectations
      const transformedStudents = response.data.map((student: any) => ({
        ...student,
        first_name: student.name ? student.name.split(' ')[0] : '',
        last_name: student.name ? student.name.split(' ').slice(1).join(' ') : '',
        student_code: student.roll_number,
        year: student.semester,
        attendance_percentage: student.attendance_percentage || 0
      }))
      setStudents(transformedStudents)
    } catch (error) {
      console.error('Error fetching students:', error)
      setStudents([])
    } finally {
      setLoading(false)
    }
  }

  const filteredStudents = students.filter(student =>
    student.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.student_code.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
            Students
          </h1>
          <p className="text-gray-400 mt-2">Manage student profiles and attendance records</p>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full glass pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-transparent"
              />
            </div>
          </div>
          
          <button className="btn-secondary flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filter
          </button>
          
          <button className="btn-primary flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Add Student
          </button>
        </div>

        {/* Students Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            // Loading skeleton
            [...Array(6)].map((_, i) => (
              <div key={i} className="glass-card animate-pulse">
                <div className="h-32 bg-slate-700 rounded mb-4"></div>
                <div className="h-4 bg-slate-700 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-slate-700 rounded w-1/2"></div>
              </div>
            ))
          ) : filteredStudents.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-400">
              No students found
            </div>
          ) : (
            filteredStudents.map((student, index) => (
              <motion.div
                key={student.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass-card cursor-pointer"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-2xl font-bold">
                    {student.first_name[0]}{student.last_name[0]}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-lg">
                      {student.first_name} {student.last_name}
                    </div>
                    <div className="text-sm text-gray-400">{student.student_code}</div>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Department:</span>
                    <span>{student.department}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Year:</span>
                    <span>Year {student.year}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Email:</span>
                    <span className="truncate ml-2">{student.email}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Attendance:</span>
                    <div className="flex items-center gap-2">
                      <div className="text-2xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
                        {student.attendance_percentage}%
                      </div>
                      {student.attendance_percentage >= 75 ? (
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      ) : (
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      )}
                    </div>
                  </div>
                  <div className="mt-2 w-full bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
                      style={{ width: `${student.attendance_percentage}%` }}
                    ></div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
