import React, { useEffect, useRef } from 'react'
import Login from './pages/Login/Login'
import SignUp from './pages/SignUp/SignUp'
import Home from './pages/Home/Home'
import { Route, Routes } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast';
import Feed from './components/Feed/Feed'
import Profile from './components/Profile/Profile'
import ReqUser from './components/Profile/ReqUser'
import Navbar from './components/Navbar/Navbar'
import Update from './components/Update/Update'
import { useSelector } from 'react-redux'
import LoadingBar from 'react-top-loading-bar'

const App = () => {
  const loadingBarRef = useRef(null);
  const isLoading = useSelector((state) => state.AppConfig?.isLoading ?? false);

  useEffect(() => {
    if (isLoading) {
      loadingBarRef.current?.continuousStart();
    } else {
      loadingBarRef.current?.complete();
    }
  }, [isLoading]);

  return (
    <div>
      <LoadingBar color="#5fff6aff" ref={loadingBarRef} height={4} />
      <Navbar />
      <Toaster />
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<SignUp />} />
        <Route element={<ReqUser />}>
          <Route path='/' element={<Feed />} />
          <Route path='/profile/:userId' element={<Profile />} />
          <Route path='/profile/update' element={<Update />} />
        </Route>
      </Routes>
    </div >
  )
}

export default App;

