import React from 'react'
import { Outlet } from 'react-router-dom'
import { Navigate } from 'react-router-dom'
import { getItem, KEY_ACCESS_TOKEN } from '../../utils/localStroage'

const ReqUser = () => {
  const user = getItem(KEY_ACCESS_TOKEN);
  return (
    user ? <Outlet /> : <Navigate to="/login" />
  )
}

export default ReqUser;


