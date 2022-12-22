/* eslint-disable no-underscore-dangle */
/* eslint-disable no-sequences */
/* eslint-disable array-callback-return */
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllUser } from '../../mockAPI/mockAPI';
import './searchbar.css';

export default function Searchbar() {
  const inputRef = useRef(null);
  let searchUserId = null;
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');
  const [count, setCount] = useState(0);

  useEffect(() => {
    async function fetchAllUsers() {
      const data = await getAllUser();
      setUsers(data);
    }
    fetchAllUsers();
  }, []);

  const handleChange = (event) => {
    setMessage(event.target.value);
  };

  const navigate = useNavigate();
  const navigateToProfile = () => (
    users.map((user) => {
      if (user.name === inputRef.current.value) { searchUserId = user._id; }
    }),
    navigate(`/profile/${searchUserId}`),
    setCount(count + 1),
    console.log(count),
    setMessage('')
  );

  return (
    <div>
      <input
        ref={inputRef}
        className="searchInput"
        aria-label="search"
        list="userNames"
        name="searchInput"
        placeholder="Search users here..."
        value={message}
        onChange={handleChange}
      />
      <datalist id="userNames">
        if (users)
        {' '}
        {
          users.map(
            (item) => <option key={item._id} aria-label="option" value={item.name} />,
          )
        }
      </datalist>
      <button className="searchButton" aria-label="button" type="button" onClick={navigateToProfile}>Search</button>
    </div>
  );
}
