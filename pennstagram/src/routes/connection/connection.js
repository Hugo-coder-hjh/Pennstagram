/* eslint-disable no-underscore-dangle */
import { React, useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
import FriendsCard from '../../components/friendsCard/friendsCard';
import Navbar from '../../components/navbar/navbar';
import Sidebar from '../../components/sidebar/sidebar';
import FriendSuggestion from '../../components/friendSuggestion/friendSuggestion';
import {
  getFollowersbyId,
  getUserById,
  getRecommendationById,
} from '../../mockAPI/mockAPI';
import './connection.css';

export default function Connection() {
  const userId = localStorage.getItem('myUserID');
  const [suggestion, setSuggestion] = useState([]);
  const [following, setFollowing] = useState([]);
  // fetch data to update followingArray

  useEffect(() => {
    async function fetchFollowing(id) {
      const data = await getFollowersbyId(id);
      const followerArray = [];
      await Promise.all(data.data.map(async (fid) => {
        const fr = await getUserById(fid);
        followerArray.push(fr);
      }));
      setFollowing(followerArray);
    }
    fetchFollowing(userId);
  }, []);

  // fetch data of recommendation
  useEffect(() => {
    async function fetchSuggestion(id) {
      const data = await getRecommendationById(id);
      // console.log('data', data.data);
      // data[i]
      const recArray = [];
      await Promise.all(data.data.map(async (fid) => {
        const fr = await getUserById(fid);
        recArray.push(fr);
      }));
      setSuggestion(recArray);
    }
    fetchSuggestion(userId);
  }, []);

  return (
    <div>
      <div>
        <Navbar />
        <Sidebar />
        <div className="connection">
          <div className="up">
            <h1>Your Friends</h1>
            <div className="friendsCard">
              {following.map((friendInfo) => (
                <FriendsCard
                  friend={friendInfo}
                  key={friendInfo._id}
                />
              ))}
            </div>
          </div>
          <div className="down">
            <h1>Suggestions For You</h1>
            <div className="suggestion">
              {suggestion.map((friendInfo) => (
                <FriendSuggestion friend={friendInfo} key={friendInfo._id} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
