/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import homepageLogo from '../../assest/home-filled.svg';
import profileLogo from '../../assest/profile-user.svg';
import connectionLogo from '../../assest/people-outline.svg';
import './sidebar.css';

export default function Sidebar() {
  const userId = localStorage.getItem('myUserID');

  const navigate = useNavigate();

  const navigateToHomepage = () => {
    navigate(`/home/${userId}`);
  };

  const navigateToProfile = () => {
    navigate(`/profile/${userId}`);
  };

  const navigateToConnection = () => {
    navigate(`/connection/${userId}`);
    window.location.reload();
  };

  return (
    <div className="sidebar">
      <div className="sidebar_tab" onClick={navigateToHomepage}>
        <img className="sidebar_tab_icon" src={homepageLogo} alt="homepage" />
        <h3>HOMEPAGE</h3>
      </div>

      <div className="sidebar_tab">
        <img className="sidebar_tab_icon" src={profileLogo} alt="profile" />
        <h3 className="directToProfile" onClick={navigateToProfile}>PROFILE</h3>
      </div>

      <div className="sidebar_tab">
        <img className="sidebar_tab_icon" src={connectionLogo} alt="connection" />
        <h3 className="directToConnection" onClick={navigateToConnection}>CONNECTION</h3>
      </div>
    </div>
  );
}
