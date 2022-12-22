/* eslint-disable no-underscore-dangle */

import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getUserById, updateUserInfo } from '../../mockAPI/mockAPI';
import './friendsCard.css';

export default function FriendsCard(props) {
  const userId = localStorage.getItem('myUserID');
  const [isFollowed, setIsFollowed] = useState(true);
  const currentUser = useRef({});
  const { friend } = props;

  useEffect(() => {
    async function fetchCurrentUser(id) {
      const data = await getUserById(id);
      currentUser.current = data;
    }
    fetchCurrentUser(userId);
  }, []);

  const handleFollow = async (firendInfo) => {
    // user1 add recId to his followers (call apis)
    currentUser.current.followers.push(firendInfo._id);
    // console.log(currentUser.current._id);
    // user2 add user1_id to his followees
    firendInfo.followees.push(userId);
    try {
      await updateUserInfo(currentUser.current._id, currentUser.current);
      await updateUserInfo(firendInfo._id, firendInfo);
      setIsFollowed(true);
    } catch (err) {
      console.log(err);
    }
  };

  const handleUnfollow = async (friendInfo) => {
    // remove follower
    const indexOfFollower = currentUser.current.followers.indexOf(friendInfo._id);
    currentUser.current.followers.splice(indexOfFollower, 1);
    // remove followee
    const indexOfFollowee = friendInfo.followees.indexOf(currentUser.current._id);
    friendInfo.followees.splice(indexOfFollowee, 1);
    try {
      await updateUserInfo(currentUser.current._id, currentUser.current);
      await updateUserInfo(friendInfo._id, friendInfo);
      window.location.reload();
      setIsFollowed(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={`card${friend.name}`}>
      <div className="friend" key={friend.id}>
        <Link style={{ textDecoration: 'none' }} to={`/profile/${friend._id}`} role="presentation">
          <div className="nameAvatar">
            <img className="avatar" src={friend.profilePic} alt="avatar" />
            <h4 className="name" style={{ color: 'black' }}>{friend.name}</h4>
          </div>
        </Link>
        <div className="unfollowButton">
          {
          isFollowed ? (
            <button className="Unfollow" type="button" data-testid="FBTN" onClick={() => handleUnfollow(friend)}>Unfollow</button>
          ) : (
            <button className="Follow" type="button" data-testid="FBTN" onClick={() => handleFollow(friend)}>Follow</button>
          )
        }
        </div>
      </div>
    </div>
  );
}
