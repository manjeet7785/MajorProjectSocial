import React, { useEffect, useState } from 'react';
import './Update.css';
import ava from "../../assets/ava.png";
import { useSelector, useDispatch } from 'react-redux';
import { setLoading, updateProfile } from '../../Redux/Slicies/AppConfig';
import toast from 'react-hot-toast';

const Update = () => {
  const dispatch = useDispatch();
  const myProfile = useSelector((state) => state.AppConfig?.myProfile || {});
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setavatar] = useState("");


  useEffect(() => {

    setName(myProfile?.user?.name || " ");
    setBio(myProfile?.user?.bio || " ");
    setavatar(myProfile?.user?.avatar?.url || " ");

  }, [myProfile]);

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      if (fileReader.readyState === fileReader.DONE) {
        setavatar(fileReader.result);
        console.log("iuuuuuuuuuuuuuuu=====", fileReader);
      }
    };
  }


  function handleSubmit(e) {
    e.preventDefault();
    const dataToSend = {
      name,
      bio,
      avatar: avatar.startsWith("data:") ? avatar : ""
    };
    dispatch(updateProfile(dataToSend));
  }

  function handleDelete() {
    console.log("Delete");
  }

  return (
    <div className='update'>
      <div className='updateContainer'>
        <div className="leftUpdate">
          <div className='input-user-img'>
            <label htmlFor="inputImg" className='labelImg'>
              <img src={avatar || ava} alt={name} />
            </label>

            <input
              type="file"
              className='inputImg'
              placeholder='Upload Your Profile'
              id="inputImg"
              accept='image/*'
              onChange={handleImageChange}
            />
          </div>
        </div>

        <div className="rightUpdate">
          <form className='right-form' onSubmit={handleSubmit}>

            <input
              value={name}
              type="text"
              placeholder='Enter Your Name Here'
              onChange={(e) => setName(e.target.value)}
            />

            <input
              value={bio}
              type="text"
              placeholder='Enter Your Bio'
              onChange={(e) => setBio(e.target.value)}
            />

            <button className='Submit' onClick={handleSubmit}>Submit</button>
          </form>
          <button className='DeleteBTN' onClick={handleDelete}>Delete Account</button>
        </div>
      </div>
    </div>
  );
};

export default Update;
