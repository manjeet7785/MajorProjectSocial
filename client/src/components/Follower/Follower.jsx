import React, { useEffect, useState } from 'react'
import Avatar from '../Avatar/Avatar'
import './Follower.css'
import { useDispatch, useSelector } from 'react-redux'
import { followAndUnfollowUser, getFeedData } from '../../Redux/Slicies/FeedSlice'
import { useNavigate } from 'react-router-dom'

const Follower = ({ user }) => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const feedData = useSelector(state => state.FeedSlice.feedData);


  const [following, setFollowing] = useState();

  useEffect(() => {
    const followingUsers = feedData?.result?.following;

    setFollowing(followingUsers?.find(item => item._id === user._id));
  }, [feedData, user._id]);


  const handleFollow = async () => {
    try {
      await dispatch(followAndUnfollowUser({ userIdFollow: user._id })).unwrap();

      dispatch(getFeedData());
    } catch (error) {

    }
  };


  return (
    <div className='Follower'>
      <div className='FollowerProfile' onClick={() => user?._id && navigate(`/profile/${user._id}`)} style={{ cursor: 'pointer' }}>
        <Avatar src={user?.avatar?.url} />
        <h4>{user?.name}</h4>
      </div>
      <button onClick={handleFollow} className={following ? 'UnFollow' : 'FollowerBTN'}>

        {following ? "Unfollow" : "Follow"}
      </button>
    </div>
  )
}

export default Follower