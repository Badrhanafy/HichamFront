import { createBrowserRouter } from 'react-router-dom'
import App from './App'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Contact from './components/Contact'
import Portfolio from './components/Portfolio'
import AddProject from './components/AddProject'
import ProjectsPage from './components/ProjectsPage'
import Admin from './components/Admin'
import CategoryProjects from './components/CategoryProjects'
import Login from './components/Login'
import Register from './components/Register'
import ProjectDetails from './components/ProjectDetails'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Hero /> },
      { path: 'about', element: <About /> },
      { path: 'skills', element: <Skills /> },
      { path: 'portfolio', element: <Portfolio /> },
     
    ],
  },
  { path:"/addProject", element:<ProjectsPage /> },
  { path:"/admin", element:<Admin /> },
   {
        path: 'projects',
        children: [
          { index: true, element: <Contact /> }, // /projects
          { path: ':category', element: <CategoryProjects /> } // /projects/social-media
        ]
      }
    ,{
      path:"/login",
      element:<Login/>
    }    ,{
      path:"/register",
      element:<Register/>
    },{
      path:"/projects/project/:id",
      element:<ProjectDetails/>
    }
])


export default router
