import React from 'react';
// import { useNavigate } from 'react-router-dom';
import ProfileComponent from '../../components/profileComponent/profileComponent';
import Navbar from '../../components/navbar/navbar';
import Sidebar from '../../components/sidebar/sidebar';
import './profile.css';

function Profile() {
  return (
    <div>
      <div>
        <Navbar />
        <Sidebar />
        <div className="profile">
          <ProfileComponent />
        </div>
      </div>
    </div>
  );
}

export default Profile;
