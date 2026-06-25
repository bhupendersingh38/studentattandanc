'use client'

import { useState, useRef, useCallback } from 'react'
import Webcam from 'react-webcam'
import { motion } from 'framer-motion'
import { Camera, Play, Square, Check, X } from 'lucide-react'
import Sidebar from '@/components/Sidebar'
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL
const AI_ENGINE_URL = process.env.NEXT_PUBLIC_AI_ENGINE_URL

export default function AttendancePage() {
  const webcamRef = useRef<Webcam>(null)
  const [isCapturing, setIsCapturing] = useState(false)
  const [recognizedStudents, setRecognizedStudents] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const capture = useCallback(async () => {
    if (!webcamRef.current) return

    setLoading(true)
    const imageSrc = webcamRef.current.getScreenshot()
    
    if (!imageSrc) {
      setLoading(false)
      return
    }

    try {
      // Remove data:image/jpeg;base64, prefix
      const base64Image = imageSrc.split(',')[1]
      
      // Send to AI engine for recognition
      const response = await axios.post(`${AI_ENGINE_URL}/api/v1/recognize`, {
        image_base64: base64Image,
        class_id: 'demo-class'
      })

      setRecognizedStudents(response.data)
      
      // Mark attendance for recognized students
      for (const student of response.data) {
        if (student.liveness_verified && student.confidence > 0.85) {
          await axios.post(`${API_URL}/api/v1/attendance/mark`, {
            student_id: student.student_id,
            class_id: 'demo-class',
            status: 'present',
            confidence_score: student.confidence,
            marked_at: new Date().toISOString()
          })
        }
      }
    } catch (error) {
      console.error('Error recognizing faces:', error)
    } finally {
      setLoading(false)
    }
  }, [webcamRef])

  const startCapture = () => {
    setIsCapturing(true)
    const interval = setInterval(() => {
      capture()
    }, 3000) // Capture every 3 seconds

    // Store interval ID to clear later
    ;(window as any).captureInterval = interval
  }

  const stopCapture = () => {
    setIsCapturing(false)
    if ((window as any).captureInterval) {
      clearInterval((window as any).captureInterval)
    }
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
            Mark Attendance
          </h1>
          <p className="text-gray-400 mt-2">Use face recognition to automatically mark attendance</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Camera Feed */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card"
          >
            <div className="flex items-center gap-3 mb-6">
              <Camera className="w-6 h-6 text-primary-500" />
              <h2 className="text-xl font-bold">Camera Feed</h2>
            </div>

            <div className="relative aspect-video bg-slate-900 rounded-lg overflow-hidden mb-6">
              <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                className="w-full h-full object-cover"
                videoConstraints={{
                  width: 1280,
                  height: 720,
                  facingMode: "user"
                }}
              />
              
              {loading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
                </div>
              )}

              {isCapturing && (
                <div className="absolute top-4 right-4">
                  <div className="flex items-center gap-2 glass px-3 py-2 rounded-lg">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-sm">Recording</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-4">
              {!isCapturing ? (
                <button 
                  onClick={startCapture}
                  className="flex-1 btn-primary flex items-center justify-center gap-2"
                >
                  <Play className="w-5 h-5" />
                  Start Recognition
                </button>
              ) : (
                <button 
                  onClick={stopCapture}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                >
                  <Square className="w-5 h-5" />
                  Stop Recognition
                </button>
              )}
              
              <button 
                onClick={capture}
                disabled={loading}
                className="btn-secondary flex items-center justify-center gap-2"
              >
                <Camera className="w-5 h-5" />
                Capture Once
              </button>
            </div>
          </motion.div>

          {/* Recognized Students */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card"
          >
            <h2 className="text-xl font-bold mb-6">Recognized Students</h2>
            
            <div className="space-y-4 max-h-[500px] overflow-y-auto">
              {recognizedStudents.length === 0 ? (
                <div className="text-center text-gray-400 py-12">
                  <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>No students recognized yet</p>
                  <p className="text-sm mt-2">Start recognition to see results</p>
                </div>
              ) : (
                recognizedStudents.map((student, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="glass p-4 rounded-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-semibold text-lg">{student.student_name}</div>
                        <div className="text-sm text-gray-400">ID: {student.student_id}</div>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-2">
                            <div className="text-xs text-gray-400">Confidence:</div>
                            <div className={`text-sm font-semibold ${
                              student.confidence > 0.9 ? 'text-green-500' : 
                              student.confidence > 0.8 ? 'text-yellow-500' : 
                              'text-red-500'
                            }`}>
                              {(student.confidence * 100).toFixed(1)}%
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {student.liveness_verified ? (
                              <>
                                <Check className="w-4 h-4 text-green-500" />
                                <span className="text-xs text-green-500">Live</span>
                              </>
                            ) : (
                              <>
                                <X className="w-4 h-4 text-red-500" />
                                <span className="text-xs text-red-500">Not Live</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {student.confidence > 0.85 && student.liveness_verified && (
                        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                          <Check className="w-6 h-6" />
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </div>

        {/* Today's Summary */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card mt-6"
        >
          <h2 className="text-xl font-bold mb-6">Today's Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-500">{recognizedStudents.length}</div>
              <div className="text-gray-400 text-sm mt-2">Recognized</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-500">
                {recognizedStudents.filter(s => s.confidence > 0.85).length}
              </div>
              <div className="text-gray-400 text-sm mt-2">High Confidence</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-500">
                {recognizedStudents.filter(s => !s.liveness_verified).length}
              </div>
              <div className="text-gray-400 text-sm mt-2">Failed Liveness</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary-500">
                {recognizedStudents.filter(s => s.confidence > 0.85 && s.liveness_verified).length}
              </div>
              <div className="text-gray-400 text-sm mt-2">Marked Present</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
