import {
  React, useState, useEffect, useRef,
} from 'react';
import Feed from '../../components/feed/feed';
import Navbar from '../../components/navbar/navbar';
import Sidebar from '../../components/sidebar/sidebar';
import {
  getUserById, getAllPostsById, getInvisiByUserId, getPostsNumById,
} from '../../mockAPI/mockAPI';
import './home.css';

export default function Home() {
  const userId = localStorage.getItem('myUserID');
  const [currUser, setCurrUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [invisiArr, setInvisiArr] = useState([]);
  // for live update
  const [allPostsNum, setAllPostsNum] = useState(0);

  // handle the first render
  const notInitialRender = useRef(false);
  // hanle all the render after the second time
  const flag = useRef(false);

  useEffect(() => {
    // 0. fetch the current user
    async function getUser(id) {
      const data = await getUserById(id);
      setCurrUser(data);
    }
    getUser(userId);

    // 1. fetch the followers posts
    async function fetchPosts(id) {
      const data = await getAllPostsById(id);
      setPosts(data);
    }
    fetchPosts(userId);

    // 2. fetch the invisiArray
    async function fetchInvisiArr(id1) {
      const data1 = await getInvisiByUserId(id1);
      // be careful, at first the data return can be null
      if (data1 != null) {
        setInvisiArr(data1);
      } else {
        setInvisiArr([]);
      }
    }
    fetchInvisiArr(userId);

    // live updates
    // fetch the number for the first time
    async function fetchPostsNum(id2) {
      const number = await getPostsNumById(id2);
      setAllPostsNum(number);
    }

    if (notInitialRender.current) {
      // change the innerHTML
      if (flag.current) {
        document.getElementById('myBtn').innerHTML = 'post(s) updated!';
      }
      setInterval(() => {
        flag.current = true;
        fetchPostsNum(userId);
        console.log('liveUpdate working');
      }, 5000);
    } else {
      flag.current = false;
      notInitialRender.current = true;
      fetchPostsNum(userId);
    }
  }, [allPostsNum]);

  // after clicking the button, we should refresh the page
  const handleClickRender = () => {
    window.location.reload();
    document.getElementById('myBtn').innerHTML = 'no new post';
  };

  // check sessionStorage for previous
  // const [connected] = useState(sessionStorage.getItem('app-token') !== null);
  if (currUser) {
    return (
      <div>
        <div>
          <Navbar />
          <Sidebar />
          <div className="home">
            { (allPostsNum > 0) ? (
              <button
                className="notificationBtn"
                onClick={handleClickRender}
                id="myBtn"
                type="button"
              >
                no new post
              </button>
            ) : null}
            <Feed current={currUser} posts={posts} invisiArr={invisiArr} />
          </div>
        </div>
      </div>
    );
  }
}
