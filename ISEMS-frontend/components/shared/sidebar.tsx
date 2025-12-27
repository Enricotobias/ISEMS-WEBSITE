'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  LayoutDashboard, 
  Smartphone, 
  Settings, 
  FileText,
  Activity,
  Zap
} from 'lucide-react'

const menuItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    description: 'Monitoring real-time'
  },
  {
    title: 'Remote Control',
    href: '/remote',
    icon: Smartphone,
    description: 'Kontrol AC'
  },
  {
    title: 'Automation',
    href: '/automation',
    icon: Settings,
    description: 'Pengaturan otomasi'
  },
  {
    title: 'Event Logs',
    href: '/logs',
    icon: FileText,
    description: 'Riwayat aktivitas'
  }
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-white transition-transform">
      {/* Logo/Brand */}
      <div className="flex h-16 items-center gap-3 border-b px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
          <Zap className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-gray-900">ISEMS</h1>
          <p className="text-xs text-gray-500">Smart AC Control</p>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="space-y-1 p-4">
        {menuItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-4 py-3 transition-all",
                isActive
                  ? "bg-blue-50 text-blue-600 shadow-sm"
                  : "text-gray-600 hover:bg-gray-50"
              )}
            >
              <Icon className={cn(
                "h-5 w-5",
                isActive ? "text-blue-600" : "text-gray-400"
              )} />
              <div className="flex-1">
                <div className={cn(
                  "text-sm font-medium",
                  isActive ? "text-blue-600" : "text-gray-700"
                )}>
                  {item.title}
                </div>
                <div className="text-xs text-gray-500">
                  {item.description}
                </div>
              </div>
            </Link>
          )
        })}
      </nav>

      {/* Footer Info */}
      <div className="absolute bottom-0 left-0 right-0 border-t bg-gray-50 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-blue-500">
            <Activity className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-700">System Active</div>
            <div className="text-xs text-gray-500">All systems operational</div>
          </div>
        </div>
      </div>
    </aside>
  )
}