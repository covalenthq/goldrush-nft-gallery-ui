import "@/styles/globals.css"
import '@radix-ui/themes/styles.css';

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: Readonly<DashboardLayoutProps>) {

  return (
    <div className="container min-h-[calc(100vh-150px)] py-8 flex flex-col">
        {children}
    </div>
  )
}
