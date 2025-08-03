import {
  lazy,
  Suspense
} from 'react'
import {
  Routes,
  Route,
  Navigate
} from 'react-router-dom'
import './App.css'

import MainLayout from '@/components/MainLayout'
import BlankLayout from '@/components/BlankLayout'
import Loading from '@/components/Loading'
import { UserProvider } from '@/contexts/UserContext'

const Home = lazy(() => import('@/pages/Home'))
const Search = lazy(() => import('@/pages/Search'))
const Login = lazy(() => import('@/pages/Login'))
const Order = lazy(() => import('@/pages/Order'))
const Account = lazy(() => import('@/pages/Account'))
const NotFound = lazy(() => import('@/pages/NotFound'))
const Consultant = lazy(() => import('@/pages/Consultant'))
const Coze = lazy(() => import('@/pages/Coze'))
const RequireAuth = lazy(() => import('@/components/RequireAuth'))
function App() {

  return (
    <>
    <UserProvider>
      <Suspense fallback={<Loading />}>
        <Routes>
          {/* 带有标签栏的页面 */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/home" element={<Home />} />
            <Route path="/account" element={<RequireAuth><Account /></RequireAuth>} />
            <Route path="/order" element={<Order />} />
            <Route path="/consultant" element={<Consultant />} />
          </Route>
          {/* 空的Layout */}
          <Route element={<BlankLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/search" element={<Search />} />
            <Route path="/coze" element={<Coze />} />
          </Route>
          <Route path="/*" element={<NotFound />} />
        </Routes>
      </Suspense>
      </UserProvider>
    </>
  )
}

export default App
