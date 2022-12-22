/* eslint-disable no-console */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
import './upload.css';
import { useState, useRef } from 'react';
// import from api
import { createPost, updateUserInfo, createOrEditPostUpload } from '../../mockAPI/mockAPI';
import cancelIcon from '../../assest/cancel-svgrepo-com.svg';
import pictureIcon from '../../assest/picture-svgrepo-com.svg';

export default function Upload({ viewer }) {
  // const personOnePicture = 'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/976.jpg';
  const arr = [];
  // Create a state to hold the file for upload and the function to update it
  // we do not need the state variable since we are
  // not passing it as prop.
  const [file, setFile] = useState('');
  const [, setNewPost] = useState(null);
  // const [, setNewComments] = useState(null);
  const currentUser = useRef({});
  currentUser.current = viewer;
  // Ref variable to tell to load data or not
  const loadData = useRef(false);
  // Ref variable to store the value of postText
  const desc = useRef();

  // Create a submithandler
  const submitHandler = async (e) => {
    // stop default behavior to avoid reloading the page
    e.preventDefault();
    // create new post variable
    const newPost = {
      // photo: 'http://loremflickr.com/640/480/technics',
      userId: viewer._id,
      likes: arr,
      comment: arr,
      profilePicture: viewer.profilePic,
      username: viewer.name,
      desc: desc.current.value,
      visi: true,
    };
    // upload the file
    if (file) {
      const data = new FormData();
      const fileName = Date.now() + file.name;
      data.append('name', fileName);
      data.append('file', file);
      newPost.photo = fileName;
      console.log('newPost', newPost);
      try {
        const response = await createOrEditPostUpload(data);
        console.log('the location:', response);
        newPost.photo = response.data.data;
        // console.log(response);
        console.log(newPost);
      } catch (err) {
        console.error(err);
      }
    }

    // send POST request to create a post
    const newStoredPost = await createPost(newPost);
    // get postId
    const postId = newStoredPost._id;
    // put postId in the viewer
    currentUser.current.posts.push(postId);
    // call put user method to update user
    try {
      await updateUserInfo(currentUser.current._id, currentUser.current);
    } catch (err) {
      console.error(err);
    }
    // update loadData
    loadData.current = true;
    // newStoredPost has an id
    // then update state to trigger rerendering and load
    setNewPost(newStoredPost);

    // create new commet variable
    // send POST request to create a post
    // update loadData
    // loadData.current = true;
    // newStoredPost has an id
    // then update state to trigger rerendering and load
    window.location.reload();
  };

  return (
    <div className="uploadWrapper">
      <div className="uploadTop">
        <img className="uploadProfileImg" src={viewer?.profilePic} alt="" />
        <input
          placeholder="What's in your mind ?"
          className="uploadInput"
          ref={desc}
        />
      </div>
      <hr className="uploadHr" />
      {file && (
      <div className="uploadImgContainer">
        <img className="uploadImg" src={URL.createObjectURL(file)} alt="" />
        <img className="uploadCancelImg" src={cancelIcon} onClick={() => setFile('')} />
      </div>
      )}
      <form className="uploadBottom" onSubmit={submitHandler}>
        <div className="uploadOptions">
          <label htmlFor="file" className="uploadOption">
            |
            <img className="uploadIcon" src={pictureIcon} alt="" />
            <span className="uploadOptionText">Photo or Video</span>
            <input
              style={{ display: 'none' }}
              type="file"
              id="file"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </label>
        </div>
        <button className="uploadButton" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
}
