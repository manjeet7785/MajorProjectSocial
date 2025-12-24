import React, { useState } from 'react'
import './CreatePost.css'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import Avatar from '../Avatar/Avatar'
import { BsCardImage } from 'react-icons/bs'
import { setLoading } from '../../Redux/Slicies/AppConfig'
import clientAxios from '../../utils/clientAxios'
import { getUserProfile } from '../../Redux/Slicies/Posts'

const CreatePost = () => {
  const dispatch = useDispatch()
  const [postImg, setPostImg] = useState('')
  const [caption, setCaption] = useState('')
  const myProfile = useSelector(state => state.AppConfig.myProfile);

  console.log(myProfile);


  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const fileReader = new FileReader()
    fileReader.readAsDataURL(file)
    fileReader.onload = () => {
      if (fileReader.readyState === fileReader.DONE) {
        setPostImg(fileReader.result)
        console.log("Image base64 result:", fileReader.result)
      }
    }
  }

  const handlePostSubmit = async () => {
    if (!caption || !postImg) {
      alert('Please enter a caption and select an image.')
      return
    }

    try {
      dispatch(setLoading(true))
      const result = await clientAxios.post('/posts', {
        caption,
        image: postImg, // backend expects 'image' key
      })
      console.log('Post successful:', result.data)

      dispatch(getUserProfile({
        userId: myProfile?._id
      }));

    } catch (error) {
      console.error('Error posting:', error.response?.data || error.message)

    } finally {
      dispatch(setLoading(false))
      setCaption('')
      setPostImg('')
    }
  }

  return (
    <div className="main_div">
      <div className='CreatePost'>
        <div className="left-part">
          <Avatar />
        </div>
        <div className="right-part">
          <input
            type="text"
            placeholder='Enter Your Description'
            className="captionInput"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />
          {postImg && (
            <div className="img-container">
              <img className='post-img' src={postImg} alt="Post preview" />
            </div>
          )}
          <div className="bottom-part">

            <div className="input-post-img">
              <label className='Icons' htmlFor="inputImg" >
                <BsCardImage />
              </label>
              <input
                className='InputImg'
                id='inputImg'
                accept='image/*'
                type="file"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
            </div>
            <button
              type='button'
              className='post-btn-primary'
              onClick={handlePostSubmit}
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreatePost;  
