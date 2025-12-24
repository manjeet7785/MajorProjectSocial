import React from 'react'
import './Feed.css'
import { useNavigate } from 'react-router-dom'
import Navbar from '../Navbar/Navbar'
import Post from '../Post/Post'
import Follower from '../Follower/Follower'
import { getMyInfo } from '../../Redux/Slicies/AppConfig'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import CreatePost from '../CreatePost/CreatePost'
import { getFeedData } from '../../Redux/Slicies/FeedSlice'

const Feed = () => {
  const navigator = useNavigate();
  const dispatch = useDispatch();

  const postOwner = useSelector(state => state.posts.postOwner);

  const feedData = useSelector(state => state.FeedSlice.feedData);


  const myProfile = useSelector(state => state.AppConfig.myProfile);


  useEffect(() => {
    dispatch(getMyInfo());
    dispatch(getFeedData());
  }, [dispatch]);


  return (
    <div className='Feed'>
      <div className="create-post">
        <CreatePost />
      </div>
      <div className="Container">
        <div className="left">

          {

            feedData?.result?.posts.map(post => (
              <Post key={post._id} post={post} />
            ))
          }


        </div>
        <div className="right" >
          <div className="following" >
            <h3 className="title">
              You are Following
            </h3>
            {
              feedData?.result?.following?.map(user => (
                <Follower key={user._id} user={user} />
              ))
            }
          </div>
          <div className="following">
            <h3 className="Suggestion">
              Suggestion
            </h3>

            {
              feedData?.result?.suggestion?.map(user => (
                <Follower key={user._id} user={user} />
              ))
            }


          </div>
        </div>
      </div>
    </div>
  )
}

export default Feed;