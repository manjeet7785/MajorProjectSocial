import React, { use } from 'react'
import './Post.css'
import Avatar from '../Avatar/Avatar'
import { useNavigate } from 'react-router-dom'
import bg from "../../assets/1.avif"
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai"
import { useDispatch } from 'react-redux'
import { likeAndUnlikePost } from '../../Redux/Slicies/Posts'
import { format } from 'timeago.js';
const Post = ({ post }) => {
  const navigator = useNavigate();
  const postOwner = post?.owner;


  const dispatch = useDispatch();

  async function handlePostLike() {
    dispatch(likeAndUnlikePost({
      postId: post._id,
    }))
  }

  return (
    <div className='Post'>
      <div className="heading" onClick={() => postOwner?._id && navigator(`/profile/${postOwner._id}`)} style={{ cursor: 'pointer' }}>
        <Avatar src={postOwner?.avatar?.url} />
        <h3>{post?.owner?.name}</h3>

      </div>
      <div className="content">
        <img className='bgimg' src={post?.image?.url} alt="" />
      </div>
      <div className="footer">
        <div className="likes" onClick={handlePostLike}>
          {post.isLiked ? <AiFillHeart className='iconsColor' /> : <AiOutlineHeart className='icons' />}

          <h4>{`${post?.likesCount} Likes`}</h4>
        </div>
        <p className="caption">
          {post?.caption}
        </p>
        <h5 className="time-ago">{format(post?.createdAt)}</h5>
      </div>
    </div>
  )
}

export default Post;


