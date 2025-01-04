import Calendar from '@/components/Calendar'
import { headers } from 'next/headers'

export default function Home() {
  return (
    <>
    <header className='h-[50px]'>
    </header>
    <main className="min-h-screen bg-background">
            <Calendar />
    </main></>
  )
}

