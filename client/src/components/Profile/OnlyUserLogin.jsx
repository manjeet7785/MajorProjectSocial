import React from 'react'
import { getItem, KEY_ACCESS_TOKEN } from '../../utils/localStroage'
import { Navigate, Outlet } from 'react-router-dom';

const OnlyUserLogin = () => {
  const user = getItem(KEY_ACCESS_TOKEN);
  return (
    <div>

      user ? <Navigate to="/" /> :  <Outlet />
    </div>
  )
}

export default OnlyUserLogin;