/* eslint-disable no-trailing-spaces */
/* eslint-disable array-callback-return */
/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
/* eslint-disable arrow-parens */
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  getPostById, getUserById, updateUserInfo,
} from '../../mockAPI/mockAPI';
import './profileComponent.css';
// import from components
import Post from '../post/post';

/**
 * Get user information from backend
 * @param userID
 */
function ProfileComponent() {
  const location = useLocation();
  const pathName = location.pathname;
  const loginUserId = localStorage.getItem('myUserID');
  // const loginUserId = pathName.split('/')[2];
  const userID = pathName.split('/')[2];
  const [myUser, setMyUser] = useState(null);
  const [myPost, setMyPost] = useState([]);
  // getCurrUser
  const [currUser, setCurrUser] = useState(null);
  // const [posts, setPosts] = useState([]);
  const [followed, setFollowed] = useState('');
  const [filterPostsProfile, setFilterPostsProfile] = useState([]);
  const visiblePosts = [];

  useEffect(() => {
    async function fetchPostIds() {
      const data = await getUserById(userID);
      const res = await getUserById(loginUserId);
      setMyUser(data);
      setCurrUser(res);
      return data.posts;
    }
    async function fetchPostsByIds(ids) {
      const currPosts = [];
      await Promise.all(ids.map(async (id) => {
        const data = await getPostById(id);
        currPosts.push(data);
        return currPosts;
      }));
      setMyPost(currPosts);
    }
    fetchPostIds().then((res) => {
      fetchPostsByIds(res);
    });
  }, [userID]);

  // check if this profile page belongs to the current login user
  const [isLoginUser, setIsLoginUser] = useState(false);

  useEffect(() => {
    if (loginUserId === userID) {
      setIsLoginUser(true);
    } else {
      setIsLoginUser(false);
    }
  }, [userID]);

  useEffect(() => {
    // FP() is used to filter the posts which is legal and visable
    async function FP() {
      myPost.map((p) => {
        if (currUser._id.toString() === userID) {
          visiblePosts.push(p);
        } else if (currUser._id.toString() !== userID && p.visi) {
          visiblePosts.push(p);
        }
      });
      setFilterPostsProfile(visiblePosts);
    }
    FP();
  }, [myPost]);

  const handleFollow = async (firendInfo) => {
    // user1 add recId to his followers (call apis)
    currUser.followers.push(firendInfo._id);
    await updateUserInfo(currUser._id, currUser);
    // user2 add user1_id to his followees
    firendInfo.followees.push(currUser._id);
    await updateUserInfo(firendInfo._id, firendInfo);
    setFollowed(true);
  };

  const handleUnfollow = async (friendInfo) => {
    // remove follower
    const indexOfFollower = currUser.followers.indexOf(friendInfo._id);
    currUser.followers.splice(indexOfFollower, 1);
    await updateUserInfo(currUser._id, currUser);
    // remove followee
    const indexOfFollowee = friendInfo.followees.indexOf(currUser._id);
    friendInfo.followees.splice(indexOfFollowee, 1);
    await updateUserInfo(friendInfo._id, friendInfo);
    setFollowed(false);
  };

  if (userID) {
    return (
      <div className="profileCard">
        <div className="profileWrapper">
          <img src={myUser ? myUser.profilePic : ''} className="profilePhoto" alt="userProfilePic" />
          <div className="profileContent">
            <div className="profileName" data-testid="name-element">
              Name:
              { myUser ? myUser.name : ''}
            </div>
            <div className="profileName">
              Total Posts:
              { myPost ? myPost.length : ''}
            </div>
            <div className="profileName">
              Total Followings:
              { myUser ? myUser.followers.length : '' }
            </div>
            <div className="profileName">
              Register from:
              { myUser ? myUser.regiDate : ''}
            </div>
            {
              (currUser && currUser.followers.includes(userID)) ? (
                isLoginUser ? null : <button className="unfollowBtn" type="button" data-testid="FBTN" onClick={() => handleUnfollow(myUser)}>Unfollow</button>
              ) : (
                isLoginUser ? null : <button className="followBtn" type="button" data-testid="FBTN" onClick={() => handleFollow(myUser)}>Follow</button>
              )
            }
          </div>
        </div>
        <div className="postInProfile">
          {filterPostsProfile.length > 0 && filterPostsProfile.map((post) => (
            <Post key={post._id} post={post} viewer={currUser} />
          ))}
        </div>
      </div>
    );
  }
}
export default ProfileComponent;
