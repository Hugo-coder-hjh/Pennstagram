/* eslint-disable object-shorthand */
/* eslint-disable no-console */
/* eslint-disable consistent-return */
import axios from 'axios';
// import { config } from 'dotenv';

// config();
// const env = 'development';
const env = 'production';

const domain = env === 'development'
  ? 'http://localhost:8080'
  : '';

const setHeaders = () => {
  axios.defaults.headers.common.Authorization = (sessionStorage.getItem('app-token') !== null) ? sessionStorage.getItem('app-token') : null;
};

/**
 * deletes any (expired) token and relaunch the app
 */
const reAuthenticate = (status) => {
  if (status === 401) {
    // delete the token
    sessionStorage.removeItem('app-token');
    // reload the app
    window.location.reload(true);
  }
};

// following = followers

export const getFollowersbyId = async (id) => {
  try {
    // add the token to the header
    setHeaders();
    const response = await axios.get(`${domain}/users/${id}/followers`);
    reAuthenticate(response.status);
    return response.data;
  } catch (err) {
    console.error(err);
    reAuthenticate(401);
  }
};

export const getFolloweesbyId = async (id) => {
  try {
    // add the token to the header
    setHeaders();
    const response = await axios.get(`${domain}/users/${id}/followees`);
    reAuthenticate(response.status);
    return response.data;
  } catch (err) {
    console.error(err);
    reAuthenticate(401);
  }
};

// friend recommendation

export const getRecommendationById = async (id) => {
  try {
    // add the token to the header
    setHeaders();
    const response = await axios.get(`${domain}/recommendation/${id}`);
    reAuthenticate(response.status);
    return response.data;
  } catch (err) {
    console.error(err);
    reAuthenticate(401);
  }
};

// get user infomation by given id
export const getUserById = async (id) => {
  try {
    // add the token to the header
    setHeaders();
    const response = await axios.get(`${domain}/users/${id}`);
    reAuthenticate(response.status);
    return response.data.data;
  } catch (err) {
    console.error(err);
    reAuthenticate(401);
  }
};

// get all the users information
export const getAllUser = async () => {
  try {
    // add the token to the header
    setHeaders();
    const response = await axios.get(`${domain}/users`);
    reAuthenticate(response.status);
    return response.data.data;
  } catch (err) {
    console.error(err);
    reAuthenticate(401);
  }
};

// update userInfo
export const updateUserInfo = async (id, userObject) => {
  try {
    // add the token to the header
    setHeaders();
    const response = await axios.put(`${domain}/users/${id}`, userObject);
    reAuthenticate(response.status);
    return response.data.data;
  } catch (err) {
    console.error(err);
    reAuthenticate(401);
  }
};

// Post

// Upload
// When uploading and editing posts, send image form the /upload endpoint
// Create a fetch function to make the POST request to the API
export const createOrEditPostUpload = async (data) => {
  try {
    // add the token to the header
    setHeaders();
    const response = await axios.post(`${domain}/upload`, data);
    // return the object from s3 that contaions the URL of image in S3
    return response;
  } catch (err) {
    console.error(err);
    reAuthenticate(401);
  }
};

// Get the feed (now only get the first three posts)
// this used to be getAllPosts
// Create a fetch function to make the GET request to the API
export const getAllPostsById = async (id) => {
  try {
    // add the token to the header
    setHeaders();
    const response = await axios.get(`${domain}/posts/${id}?p=0`);
    reAuthenticate(response.status);
    return response.data;
  } catch (err) {
    reAuthenticate(401);
    console.error(err);
  }
};

// Create a fetch function to make the GET request to the API
// get the number of all posts
export const getPostsNumById = async (id) => {
  try {
    // add the token to the header
    setHeaders();
    const response = await axios.get(`${domain}/num/${id}`);
    return response.data;
  } catch (err) {
    console.error(err);
    reAuthenticate(401);
  }
};

// Get the feed (now get the following three posts)
// Create a fetch function to make the GET request to the API
export const getPostsPerPage = async (page) => {
  try {
    const viewerId = localStorage.getItem('myUserID');
    // add the token to the header
    setHeaders();
    const response = await axios.get(`${domain}/posts/${viewerId}?p=${page}`);
    reAuthenticate(response.status);
    return response.data;
  } catch (err) {
    reAuthenticate(401);
    console.error(err);
  }
};

// Get a post by the post id
// Create a fetch function to make the get request to the API
export const getPostById = async (id) => {
  try {
    // add the token to the header
    setHeaders();
    const response = await axios.get(`${domain}/post/${id}`);
    reAuthenticate(response.status);
    return response.data;
  } catch (err) {
    console.error(err);
    reAuthenticate(401);
  }
};

// Create a post
// Create a fetch function to make the POST request to the API
export const createPost = async (postObject) => {
  try {
    // add the token to the header
    setHeaders();
    const response = await axios.post(`${domain}/post/`, {
      photo: postObject.photo,
      userId: postObject.userId,
      likes: postObject.likes,
      comment: postObject.comment,
      profilePicture: postObject.profilePicture,
      username: postObject.username,
      desc: postObject.desc,
      visi: postObject.visi,
    });
    // reAuthenticate(response.status);
    // return the data with the id of the post
    return response.data;
  } catch (err) {
    console.error(err);
    reAuthenticate(401);
  }
};

// Update likes (the array of userId) by a given Id
// Create a fetch function to make the PUT request to the API
export const updateLike = async (postObject, id, UID) => {
  try {
    // add the token to the header
    setHeaders();
    if (!postObject.likes.includes(UID)) {
      postObject.likes.push(UID);
    } else if (postObject.likes.includes(UID)) {
      postObject.likes.pop(UID);
    }
    // const likesUpdates = { likes: postObject.likes };
    // console.log('likeUpdate', postObject);
    // const likes = { likes: `${!postObject.likes.includes(userId) ?
    // postObject.likes.push(userId) : postObject.likes.pop(userId)}` };
    // add the token to the header
    setHeaders();
    await axios.put(`${domain}/post/${id}`, postObject);
    // return response.data;
    // return the data with the id of the student
  } catch (err) {
    console.error(err);
    reAuthenticate(401);
  }
};

// Update post by a given Id
// Create a fetch function to make the PUT request to the API
export const updatePost = async (postObject, id) => {
  try {
    // add the token to the header
    setHeaders();
    const postUpdates = {
      photo: postObject.photo,
      desc: postObject.desc,
      likes: postObject.likes,
      visi: postObject.visi,
    };
    await axios.put(`${domain}/post/${id}`, postUpdates);
  } catch (err) {
    console.error(err);
    reAuthenticate(401);
  }
};

// Update visibility by a given Id
// Create a fetch function to make the PUT request to the API
export const updateVisi = async (postObject, id) => {
  try {
    setHeaders();
    await axios.put(`${domain}/post/${id}`, postObject);
  } catch (err) {
    console.error(err);
    reAuthenticate(401);
  }
};

// Delete a post
// Create a fetch function to make the DELETE request to the API
export const deletePostbyId = (id) => {
  try {
    // add the token to the header
    setHeaders();
    return axios.delete(`${domain}/post/${id}`);
  } catch (err) {
    console.error(err);
    reAuthenticate(401);
  }
};

// update invisiArray of a user
export const updateInvisi = async (id, invisiArr) => {
  try {
    // add the token to the header
    setHeaders();
    const response = await axios.put(`${domain}/invisi/${id}`, invisiArr);
    return response.data.data;
  } catch (err) {
    console.error(err);
    reAuthenticate(401);
  }
};

// get invisibility array of a user
export const getInvisiByUserId = async (id) => {
  try {
    // add the token to the header
    setHeaders();
    const response = await axios.get(`${domain}/invisi/${id}`);
    return response.data.data;
  } catch (err) {
    console.error(err);
    reAuthenticate(401);
  }
};

// Login
// Get login userinformation
export const userLogin = async (username, password) => {
  try {
    const response = await axios({
      method: 'post',
      url: `${domain}/api/login`,
      responseType: 'json',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        username: username,
        password: password,
      },
    });
    // store the token
    sessionStorage.setItem('app-token', response.data.token);
    return response.data;
  } catch (err) {
    // console.log(err);
    return err.response;
  }
};

// Registration
// Creat a new user
export const userRegistration = async (name, username, password, confirmPassword) => {
  try {
    const response = await axios({
      method: 'post',
      url: `${domain}/api/registration`,
      responseType: 'json',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        name: name,
        username: username,
        password: password,
        confirmpassword: confirmPassword,
      },
    });
    return response.data;
  } catch (err) {
    // console.error(err);
    return err.response;
  }
};

// Comment
// Get comments by given postId
export const getCommentsByPostId = async (id) => {
  try {
    // add the token to the header
    setHeaders();
    const response = await axios.get(`${domain}/comments/${id}`);
    reAuthenticate(response.status);
    return response.data;
  } catch (err) {
    console.error(err);
    reAuthenticate(401);
  }
};

export const getCommentById = async (id) => {
  try {
    // add the token to the header
    setHeaders();
    const response = await axios.get(`${domain}/comment/${id}`);
    reAuthenticate(response.status);
    return response.data;
  } catch (err) {
    console.log(err);
    reAuthenticate(401);
  }
};

// Edit a comment
export const updateComment = async (newContent, commentId) => {
  // add the token to the header
  setHeaders();
  await axios({
    method: 'put',
    url: `${domain}/comment/${commentId}`,
    responseType: 'json',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      commentId,
      content: newContent,
    },
  })
    .then((response) => (response))
    .catch((err) => {
      console.log(err);
      reAuthenticate(401);
    });
};

// Delete a comment by given commentId
export const deleteCommentById = async (id) => {
  try {
    // add the token to the header
    setHeaders();
    const response = await axios.delete(
      `${domain}/comment/${id}`,
    );
    reAuthenticate(response.status);
    return response.data;
  } catch (err) {
    console.error(err);
    reAuthenticate(401);
  }
};
// Edit the comment also in the comments endpoint
export const editCommentInComments = async (newComments, postId) => {
  // add the token to the header
  setHeaders();
  await axios({
    method: 'put',
    url: `${domain}/comments/${postId}`,
    responseType: 'json',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      comment: newComments,
    },
  })
    .then((response) => (response))
    .catch((err) => {
      console.log(err);
      reAuthenticate(401);
    });
};

// Add a comment by given user object
export const addComment = async (userID, userName, content, id) => {
  try {
    // add the token to the header
    setHeaders();
    const response = await axios({
      method: 'post',
      url: `${domain}/comment`,
      responseType: 'json',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        userId: userID,
        content,
        postId: id,
        name: userName,
      },
    });
    reAuthenticate(response.status);
    return response.data;
  } catch (err) {
    console.error(err);
    reAuthenticate(401);
  }
};
