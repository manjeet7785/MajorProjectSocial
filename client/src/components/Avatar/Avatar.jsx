import React from 'react'
import './Avatar.css'
import ava from "../../assets/ava.png"

const Avatar = ({ src }) => {
  return (
    <div className='Avatar'>
      <img className='Avatar-img' src={src ? src : ava} />
    </div>
  )
}

export default Avatar