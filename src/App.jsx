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

const Home = lazy(() => import('@/pages/Home'))
const Search = lazy(() => import('@/pages/Search'))
const Login = lazy(() => import('@/pages/Login'))
const Order = lazy(() => import('@/pages/Order'))
const Account = lazy(() => import('@/pages/Account'))
const NotFound = lazy(() => import('@/pages/NotFound'))
const Collection = lazy(() => import('@/pages/Collection'))
const Consultant = lazy(() => import('@/pages/Consultant'))

function App() {

  return (
    <>
      <Suspense fallback={<Loading />}>
        <Routes>
          {/* 带有标签栏的页面 */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/home" element={<Home />} />
            <Route path="/account" element={<Account />} />
            <Route path="/order" element={<Order />} />
            <Route path="/collection" element={<Collection />} />
            <Route path="/consultant" element={<Consultant />} />
          </Route>
          {/* 空的Layout */}
          <Route element={<BlankLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/search" element={<Search />} />
          </Route>
          <Route path="/*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  )
}

export default App
