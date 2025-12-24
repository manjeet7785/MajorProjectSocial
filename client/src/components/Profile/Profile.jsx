import React, { useEffect } from 'react';
import './Profile.css';
import { useState } from 'react';
import Post from '../Post/Post';
import ava from '../../assets/ava.png';
import { useDispatch, useSelector } from 'react-redux';

import { getUserProfile } from '../../Redux/Slicies/Posts';
import { followAndUnfollowUser, getFeedData } from '../../Redux/Slicies/FeedSlice';
import { Link, useNavigate, useParams } from 'react-router-dom';
import CreatePost from '../CreatePost/CreatePost';
import Update from '../Update/Update';

const Profile = () => {

  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();




  const userProfile = useSelector(state => state.posts.userProfile);
  const feedData = useSelector(state => state.FeedSlice.feedData);


  const loading = useSelector(state => state.posts.loading);
  const myProfile = useSelector(state => state.AppConfig.myProfile);

  useEffect(() => {
    if (params.userId && params.userId !== 'undefined') {
      dispatch(getUserProfile({ userId: params.userId }));
    } else {
      console.error("Invalid userId in params:", params.userId);
    }
  }, [params.userId, dispatch]);

  const isMyProfile = myProfile?._id === params.userId;

  const [following, setFollowing] = useState();

  useEffect(() => {
    const followingUsers = feedData?.result?.following;
    setFollowing(followingUsers?.find(item => item._id === params.userId));
  }, [feedData, params.userId]);

  const handleFollow = async () => {
    try {
      await dispatch(followAndUnfollowUser({ userIdFollow: params.userId })).unwrap();
      dispatch(getFeedData());
    } catch (error) {
      console.error("Follow/Unfollow failed:", error);
    }
  };





  return (
    <div className="Profile">
      <div className="Container">


        <div className="left">
          <CreatePost />
          {
            userProfile.result?.posts?.map(post => <Post key={post._id} post={post} />)
          }

        </div>

        <div className="right">
          <div className="profileimg">
            <img
              className="UserImage"
              src={userProfile?.result?.avatar?.url || ava}
              alt="User Avatar"
            />
            <h3 className="Username">{userProfile?.result?.name}</h3>

            <p>{userProfile?.result?.bio}</p>

            <div className="followerInfo">
              <h4>{userProfile?.result?.followers?.length || 0}<br /> Followers</h4>
              <h4>{userProfile.result?.following?.length || 0}<br /> Following</h4>
            </div>

            <div className="profileBtn">
              {isMyProfile && (
                <button className="ProfileUpdate" onClick={() => navigate('/profile/update')}>Update Profile</button>
              )}
              {!isMyProfile && (
                <button onClick={handleFollow} className={following ? 'UnFollow' : 'FollowerBTN'}>
                  {following ? "Unfollow" : "Follow"}
                </button>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;


