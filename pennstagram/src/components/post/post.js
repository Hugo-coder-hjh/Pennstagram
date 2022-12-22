/* eslint-disable object-shorthand */
/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable import/no-import-module-exports */
import './post.css';
import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import {
  updateLike, deletePostbyId,
  updatePost, getCommentById, getCommentsByPostId, updateVisi,
  updateInvisi,
  getInvisiByUserId,
  updateUserInfo,
  createOrEditPostUpload,
} from '../../mockAPI/mockAPI';
import Comment from '../comment/comment';
import cancelIcon from '../../assest/delete-svgrepo-com.svg';
import editIcon from '../../assest/change-svgrepo-com.svg';
import whiteHeart from '../../assest/whiteheart.svg';
import redHeart from '../../assest/redheart.svg';
import eyeOpen from '../../assest/eye-open-svgrepo-com.svg';
import eyeClose from '../../assest/eye-closed-svgrepo-com.svg';
import hideIcon from '../../assest/delete.svg';

export default function Post({ post, viewer }) {
  // for editing
  const [file, setFile] = useState('');

  const likeLength = post?.likes?.length;
  const [like, setLike] = useState(likeLength);
  const [, setIsLiked] = useState(false);
  // const [fileForPopup, setPopupFile] = useState('');
  const [, setUpdatedPost] = useState(null);
  const [buttonPopup, setButtonPopup] = useState(false);
  const visi = useRef();
  const location = useLocation();
  const pathName = location.pathname;
  const pathId = pathName.split('/')[2];
  visi.current = post.visi;
  // Ref variable to store the value of postText
  const desc = useRef();
  const togglePopup = () => {
    setButtonPopup(!buttonPopup);
  };

  const likeHandler = async () => {
    try {
      const UID = localStorage.getItem('myUserID');
      await updateLike(post, post._id, UID);
      // because we have already updated the database
      if (post.likes.includes(viewer._id)) {
        setLike(like + 1);
        setIsLiked(true);
      } else if (!post.likes.includes(viewer._id)) {
        setLike(like - 1);
        setIsLiked(false);
      }
    } catch (err) {
      // empty
    }
  };

  const cancelHandler = async () => {
    try {
      await deletePostbyId(post._id);
      const index = viewer.posts.indexOf(post._id);
      viewer.posts.splice(index, 1);
      // call put user method to update user
      await updateUserInfo(viewer._id, viewer);
      window.location.reload();
    } catch (err) {
      // empty
    }
  };

  const hideHandler = async () => {
    try {
      const invisiArr = [];
      // but we should consider the situation whether the user already exists
      const arrayExist = await getInvisiByUserId(viewer._id.toString());
      // the collection is empty and now we create the first document
      if (arrayExist == null) {
        // the user is new, and we can directly create a new array
        invisiArr.push(post._id.toString());
        // update the database for feed activity
        await updateInvisi(viewer._id.toString(), invisiArr);
        window.location.reload();
      } else {
        // the document has already existed and we should update the document
        arrayExist.invisi.push(post._id.toString());
        // update the database for feed activity
        // passing the invisi array rather than the entire object
        await updateInvisi(viewer._id.toString(), arrayExist.invisi);
        window.location.reload();
      }
    } catch (err) {
      console.log('hideHandler failed');
    }
  };

  const visiHandler = async () => {
    if (visi.current) {
      visi.current = false;
    } else {
      visi.current = true;
    }
    // create new post variable
    const editVisiPost = {
      userId: viewer._id,
      photo: post.photo,
      desc: post.desc,
      likes: post.likes,
      visi: visi.current,
    };
    try {
      // send PUT request to update a post
      const newUpdatedPost = await updateVisi(editVisiPost, post._id);
      // then update state to trigger rerendering and load
      setUpdatedPost(newUpdatedPost);
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  // add comments in post
  const [comments, setComments] = useState([]);
  const [commentIds, setCommentIds] = useState([]);

  useEffect(() => {
    async function fetchCommentIds() {
      const data = await getCommentsByPostId(post._id);
      setCommentIds(data.data);
      return data.data;
    }
    async function fetchCommentsByIds(ids) {
      const currComments = [];
      if (ids === undefined) {
        return currComments;
      }
      await Promise.all(ids.map(async (id) => {
        const data = await getCommentById(id);
        currComments.push(data.data);
        return currComments;
      }));
      // console.log('setting comments', currComments);
      setComments(currComments);
    }
    fetchCommentIds().then((res) => fetchCommentsByIds(res));
  }, []);

  const updateCommentInPost = async () => {
    async function fetchCommentIds() {
      const data = await getCommentsByPostId(post._id);
      // if (data !== undefined) {
      console.log('commentIds', data.data);
      setCommentIds(data.data);
      return data.data;
      // }
    }
    async function fetchCommentsByIds(ids) {
      // console.log('ids', ids);
      const currComments = [];
      const result = await Promise.all(ids.map(async (id) => {
        const data = await getCommentById(id);
        console.log('comment', data.data);
        currComments.push(data.data);
        return currComments;
      }));
      console.log('seeting result', result);
      // console.log('setting comments', currComments);
      setComments(currComments);
    }
    fetchCommentIds().then((res) => fetchCommentsByIds(res));
  };

  // Edit post
  // Create a handler for popup to add a new image
  const fileSelector = document.getElementById('fileForPopup');
  fileSelector?.addEventListener('change', (e) => {
    const fileList = e.target.files[0];
    // eslint-disable-next-line
    console.log(fileList);
    // setPopupFile(e.target.files[0]);
  });

  // Edit post
  // Create a submithandler for popup
  const popupSubmitHandler = async (e) => {
    // stop default behavior to avoid reloading the page
    e.preventDefault();
    // create new post variable
    const editPost = {
      // photo: 'http://loremflickr.com/640/480/food',
      desc: desc.current.value,
      likes: [],
      visi: true,
    };

    // upload the file
    if (file) {
      const data = new FormData();
      const fileName = Date.now() + file.name;
      data.append('name', fileName);
      data.append('file', file);
      // newPost.photo = fileName;
      // console.log(newPost);
      try {
        const response = await createOrEditPostUpload(data);
        console.log('the location:', response);
        editPost.photo = response.data.data;
        // console.log(response);
        console.log(editPost);
      } catch (err) {
        console.error(err);
      }
    }

    // send PUT request to update a post
    const newUpdatedPost = await updatePost(editPost, post._id);
    // then update state to trigger rerendering and load
    setUpdatedPost(newUpdatedPost);
    window.location.reload();
  };

  // const [popupFile, popupSetFile] = useState('');

  let editButton;
  let cancelButton;
  let visButton;
  let likeButton;
  // this is only used for activity feed
  let hideButton;
  if (post.userId === viewer?._id) {
    // editButton = <button onClick={togglePopup} alt="" type="button">Edit</button>;
    editButton = <img data-testid="editPopupBtnForTest" className="postEditImg" src={editIcon} onClick={togglePopup} alt="" />;
    cancelButton = <img className="postCancelImg" src={cancelIcon} onClick={cancelHandler} alt="" />;
    // 1 should be post.visibility
    if (post.visi) {
      // after click hide button, we should hide the post from everyone
      visButton = <img className="eyeOpen" src={eyeOpen} onClick={visiHandler} alt="eye open" />;
    } else {
      visButton = <img className="eyeClose" src={eyeClose} onClick={visiHandler} alt="eye close" />;
    }
  } else if (post.userId !== viewer?._id && pathId !== post.userId) {
    // this is only used for activity feed
    hideButton = <img className="hide" src={hideIcon} onClick={hideHandler} alt="hide the follower post" />;
  }

  if (post.likes && post.likes.includes(viewer._id)) {
    likeButton = <img data-testid="red" className="likeIcon" src={redHeart} onClick={likeHandler} alt="already liked" />;
  } else {
    likeButton = <img data-testid="white" className="likeIcon2" src={whiteHeart} onClick={likeHandler} alt="yet like" />;
  }

  return (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <img
              className="postProfileImg"
              src={post.profilePicture}
              alt=""
            />
            <span className="postUsername">
              {post.username}
            </span>
          </div>
          <div className="postTopRight">
            {hideButton}
            {editButton}
            {visButton}
            {cancelButton}
          </div>
        </div>
        <div className="postCenter">
          <span className="postText">{post?.desc}</span>
          <img className="postImg" src={post.photo} alt="" />
        </div>
        {buttonPopup && (
          <div className="popup">
            <div className="popup-inner">
              <button className="close-btn" onClick={togglePopup} type="button">Close</button>
              <p className="popup-name">Update post</p>
              <form className="popupUploadBottom" onSubmit={popupSubmitHandler}>
                <input
                  placeholder="What's in your mind ?"
                  className="popupUploadInput"
                  ref={desc}
                />
                <label htmlFor="fileForPopup" className="popupUploadOption">
                  <input
                    type="file"
                    id="fileForPopup"
                    onChange={(e) => setFile(e.target.files[0])}
                  />
                </label>
                <button className="popupUploadButton" type="submit">Submit</button>
              </form>
            </div>
          </div>
        )}
        <div className="postBottom">
          <div className="postBottomLeft">
            {likeButton}
            <span data-testid="likeUsedForTest" className="postLikeCounter">
              {like}
              {' '}
              people like it
            </span>
          </div>
          <div className="postBottomRight">
            <span className="postCommentText">
              {comments.length}
              {' '}
              comment
            </span>
          </div>
        </div>
        {/* {comments !== [] ? ( */}
        <Comment
          viewer={viewer}
          postId={post._id}
          commentIds={commentIds}
          setCommentIds={setCommentIds}
          comments={comments}
          setComments={setComments}
          updateCommentInPost={updateCommentInPost}
          data-testid="comment"
        />
        {/* ) : null} */}
      </div>
    </div>
  );
}
