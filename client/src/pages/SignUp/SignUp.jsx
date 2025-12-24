import React, { useState } from 'react';
import './Sign.css';
import { Link, useNavigate } from 'react-router-dom';
import clientAxios from '../../utils/clientAxios';
import toast from 'react-hot-toast';

const SignUp = () => {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [imgUrl, setImgUrl] = useState('');

  const validate = () => {
    if (!firstName.trim() || !lastName.trim()) {
      toast.error('Please enter your first and last name');
      return false;
    }
    if (!email.trim()) {
      toast.error('Email is required');
      return false;
    }
    if (!password) {
      toast.error('Password is required');
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords don't match");
      return false;
    }
    if (mobile && !/^\d{7,15}$/.test(mobile)) {
      toast.error('Enter a valid mobile number (digits only)');
      return false;
    }
    return true;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      if (fileReader.readyState === fileReader.DONE) {
        setImgUrl(fileReader.result); // base64 string
      }
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const name = `${firstName.trim()} ${lastName.trim()}`;
      const payload = { 
        name, 
        email, 
        password, 
        bio, 
        mobile,
        avatar: imgUrl // Send base64 avatar if provided
      };
      const res = await clientAxios.post('/auth/signup', payload);
      if (res?.data?.success) {
        toast.success('Account created — please login');
        navigate('/login');
      } else {
        toast.error(res?.data?.message || 'Signup failed');
      }
    } catch (err) {
      console.error('Signup Error:', err);
      toast.error(err.response?.data?.message || err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="box">
      <div className="Sbox">
        <h2 className="heading">Create Account</h2>
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="col">
              <label>First Name</label>
              <input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First name" />
            </div>
            <div className="col">
              <label>Last Name</label>
              <input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last name" />
            </div>
          </div>

          <div className="form-row">
            <div className="col">
              <label>Email</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" type="email" />
            </div>
            <div className="col">
              <label>Mobile</label>
              <input value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="Mobile number" />
            </div>
          </div>

          <div className="form-row">
            <div className="col">
              <label>Password</label>
              <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" />
            </div>
            <div className="col">
              <label>Confirm Password</label>
              <input value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} type="password" placeholder="Confirm password" />
            </div>
          </div>


          <div className="form-row">
            <div className="col">
              <label>Profile Image</label>
              <input type="file" accept="image/*" onChange={handleImageChange} />
              {imgUrl && <img src={imgUrl} alt="Preview" className="img-preview" />}
            </div>
          </div>


          <div className="form-row">
            <div className="col-full">
              <label>Bio</label>
              <textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Short bio (optional)" rows={3} />
            </div>
          </div>

          <button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Sign Up'}</button>

          <div className="checking">
            Already have an account? <Link to="/login">Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
