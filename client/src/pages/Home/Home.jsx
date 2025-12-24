import React, { use } from 'react'
import { useEffect } from 'react';
import clientAxios from '../../utils/clientAxios';
import { Link, Outlet } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar';

import { useDispatch } from 'react-redux';

import { getMyInfo } from '../../Redux/Slicies/AppConfig';
import CreatePost from '../../components/CreatePost/CreatePost';


const Home = () => {

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getMyInfo());
  }, [dispatch]);


  return (
    <div>

      <Navbar />
      <div>
        <Outlet />
      </div>

      <CreatePost />
    </div>
  )
}

export default Home


