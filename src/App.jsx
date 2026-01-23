import React from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import axios from 'axios'
import { Outlet } from 'react-router-dom'
import logo from './assets/images/logo.png'
import { ScrollProgress, ScrollProgressProvider } from '@/components/animate-ui/primitives/animate/scroll-progress'
/*  axios.defaults.withCredentials = true; */
function App() {
  return (
    <div className="App bg-gradient-to-br from-white to-gray-50 text-gray-800 min-h-screen">
      {/* <ScrollProgressProvider global>
        <ScrollProgress className="fixed top-0 left-0 w-full h-1 bg-purple-600 z-50" />
        <Navbar />
        
    
        <main>
          <Outlet />
        </main>

        <Footer />
      </ScrollProgressProvider> */}
    
     <center>
       <div className="bg-black">
           <img src={logo}  width={"26vh"} height={"26vh"}/>
          <h1 className='text-white'>Coming Soon</h1>
     <p className='text-white'>Website under maintenance</p>
       </div>
     </center>

    </div>
  )
}

export default App
