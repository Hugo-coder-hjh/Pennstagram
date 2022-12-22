/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/jsx-no-comment-textnodes */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import pIcon from '../../assest/p-button.svg';
import Searchbar from '../searchbar/searchbar';
import './navbar.css';

export default function Navbar() {
  const userId = localStorage.getItem('myUserID');
  const navigate = useNavigate();
  const navigateToHomepage = () => {
    navigate(`/home/${userId}`);
  };

  const navigateToLogin = async () => {
    // delete the userId
    localStorage.removeItem('myUserID');
    // delete the token
    sessionStorage.removeItem('app-token');
    // reload the app
    window.location.reload(true);
  };

  return (
    <div className="navigation">
      <div className="appLogo">
        <img className="pIcon" src={pIcon} alt="P icon" />
        <h3 className="pennstagram" onClick={navigateToHomepage}>PENNSTAGRAM</h3>
      </div>
      <div className="searchbar">
        <Searchbar />
      </div>
      <div className="rightSection">
        <div className="logoutHandler">
          <h3 className="logout" onClick={navigateToLogin}>Log Out</h3>
        </div>
      </div>
    </div>
  );
}
