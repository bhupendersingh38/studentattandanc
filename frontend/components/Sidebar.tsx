'use client'

import { useRouter, usePathname } from 'next/navigation'
import { 
  LayoutDashboard, Users, Camera, BarChart3, 
  Bell, Settings, LogOut, UserCircle 
} from 'lucide-react'

export default function Sidebar() {
  const router = useRouter()
  const pathname = usePathname()

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Camera, label: 'Mark Attendance', path: '/attendance' },
    { icon: Users, label: 'Students', path: '/students' },
    { icon: BarChart3, label: 'Analytics', path: '/analytics' },
    { icon: Bell, label: 'Notifications', path: '/notifications' },
    { icon: UserCircle, label: 'Profile', path: '/profile' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ]

  return (
    <div className="w-64 glass min-h-screen p-6">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
          <Camera className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold">AttendX AI</h2>
      </div>

      {/* Menu Items */}
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.path
          
          return (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className={`sidebar-link w-full ${isActive ? 'active' : ''}`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>

      {/* Logout Button */}
      <button className="sidebar-link w-full mt-auto absolute bottom-6">
        <LogOut className="w-5 h-5" />
        <span>Logout</span>
      </button>
    </div>
  )
}
