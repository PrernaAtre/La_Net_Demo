import { EmptyDocument } from '@/app/(dashboard)/_components/empty_document'
import Sidebar from '@/app/(dashboard)/_components/sidebar'
import React from 'react'

function Home() {
  return (
    <>
     <Sidebar />
     <EmptyDocument />
     <h2>Hello</h2>
     
    </>
  )
}

export default Home