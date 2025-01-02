import TopNavbar from '@/components/TopNavBar'

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <TopNavbar />
      <main className="mx-auto py-6 sm:px-6 lg:px-8 pt-20">
        {children}
      </main>
    </div>
  )
}

