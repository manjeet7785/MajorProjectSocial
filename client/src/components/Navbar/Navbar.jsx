import React from 'react';
import './Navbar.css';
import { useNavigate } from 'react-router-dom';
import Avatar from '../Avatar/Avatar';
import { LuLogOut } from 'react-icons/lu';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from "../../Redux/Slicies/AppConfig";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const myProfile = useSelector(state => state.AppConfig?.myProfile);



  const handleLogout = () => {
    dispatch(setLoading(true));
    localStorage.removeItem('AccessToken');



    setTimeout(() => {
      navigate('/login');
      dispatch(setLoading(false));
    }, 500);
  };

  const handleNavigation = (path) => {
    if (!path) return;
    dispatch(setLoading(true));
    setTimeout(() => {
      navigate(path);
      dispatch(setLoading(false));
    }, 500);
  };




  return (
    <div className='Navbar'>
      <div className='Container1'>
        <h2 className='banner' onClick={() => navigate("/")}>Social Media</h2>
        <div className="right-side">
          <div
            className='profile'
            onClick={() => myProfile?._id && handleNavigation(`/profile/${myProfile._id}`)}
            style={{ cursor: myProfile?._id ? 'pointer' : 'default' }}
          >
            <Avatar src={myProfile?.avatar?.url} />
          </div>
          <div className="logout" style={{ cursor: 'pointer' }} onClick={handleLogout}>
            <LuLogOut />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar;
