/* eslint-disable array-callback-return */
/* eslint-disable no-underscore-dangle */
import './feed.css';
// import useState and useEffect
import React, { useState, useEffect } from 'react';
// import from api
// import { getInvisiByUserId } from '../../mockAPI/mockAPI';
import InfiniteScroll from 'react-infinite-scroll-component';
import { getPostsPerPage } from '../../mockAPI/mockAPI';
// import from components
import Post from '../post/post';
import Upload from '../upload/upload';

export default function Feed({ current, posts, invisiArr }) {
  // Create a state to hold the feed (many posts) and the function to update it.
  // const [posts, setPosts] = useState([]);
  // const [invisiArr, setInvisiArr] = useState([]);
  const [filterPosts, setFilterPosts] = useState([]);

  // for scroll
  const [hasMore, sethasMore] = useState(true);
  const [page, setpage] = useState(1);

  useEffect(() => {
    // 3. FP() is used to filter the posts which is legal and visable
    async function FP() {
      if (invisiArr.length === 0 && posts.length > 0) {
        // apply when invisiArray is empty
        const visiblePosts = [];
        posts.map((post) => {
          // be careful the object and the array property
          if (post.visi) {
            visiblePosts.push(post);
          }
        });
        setFilterPosts(visiblePosts);
      } else {
        // apply when the invisiArray is not empty
        const visiblePosts = [];
        posts.map((post) => {
          // be careful the object and the array property
          if (!invisiArr.invisi.includes(post._id.toString()) && post.visi) {
            visiblePosts.push(post);
          }
          setFilterPosts(visiblePosts);
        });
      }
    }
    FP();
  }, [posts]);

  // fetchMoreData for the scroll component
  const fetchMoreData = async () => {
    // get the every 3 posts from the next page
    const PostsFromServer = await getPostsPerPage(page);

    if (invisiArr.length === 0 && posts.length > 0) {
      // apply when invisiArray is empty
      // for filter post - visible
      const filterPostsFromServer = [];
      PostsFromServer.map((post) => {
        // be careful the object and the array property
        if (post.visi) {
          filterPostsFromServer.push(post);
        }
      });
      setTimeout(() => {
        setFilterPosts([...filterPosts, ...filterPostsFromServer]);
        if (PostsFromServer === 0 || PostsFromServer.length < 3) {
          sethasMore(false);
        }
        setpage(page + 1);
      }, 2000);
    } else {
      // apply when the invisiArray is not empty
      // for filter post - visible
      const filterPostsFromServer = [];
      PostsFromServer.map((post) => {
        // be careful the object and the array property
        if (!invisiArr.invisi.includes(post._id.toString()) && post.visi) {
          filterPostsFromServer.push(post);
        }
      });

      setTimeout(() => {
        setFilterPosts([...filterPosts, ...filterPostsFromServer]);
        if (PostsFromServer === 0 || PostsFromServer.length < 3) {
          sethasMore(false);
        }
        setpage(page + 1);
      }, 2000);
    }
  };

  return (
    <div className="feedContainer">
      <div className="feedWrapper">
        <Upload viewer={current} />
        <InfiniteScroll
          dataLength={filterPosts.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={(
            <p style={{ textAlign: 'center' }}>
              <b>Loading...</b>
            </p>
          )}
          endMessage={(
            <p style={{ textAlign: 'center' }}>
              <b>Yay! You have seen it all</b>
            </p>
          )}
        >
          <div className="postInFeed">
            {filterPosts.length > 0 && filterPosts.map((p) => (
              <Post key={p._id} post={p} viewer={current} />
            ))}
          </div>
        </InfiniteScroll>
      </div>
    </div>
  );
}
