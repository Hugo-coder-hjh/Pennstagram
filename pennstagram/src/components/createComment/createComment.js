/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { MentionsInput, Mention } from 'react-mentions';
import { getAllUser, addComment, editCommentInComments } from '../../mockAPI/mockAPI';
import './createComment.css';

/**
 * Comment component
 * @returns Comment component
 */
function CreateComment({
  postId, user, commentIds, setComments, comments, setCommentIds,
}) {
  // get select value
  const [value, setValue] = useState('');

  const submitHandler = async (event) => {
    event.preventDefault();
    const newComment = await addComment(user._id, user.name, value, postId);
    let ids = [];
    if (commentIds !== undefined) {
      ids = [...commentIds];
    }
    ids.push(newComment.data._id);
    await editCommentInComments(ids, postId);
    setCommentIds(ids);
    let commentsCopy = [];
    if (comments !== undefined) {
      commentsCopy = [...comments];
    }
    commentsCopy.push(newComment.data);
    // const myInput = document.getElementById('commentContent');
    setComments(commentsCopy);
  };

  // get all of the users
  const [allUsers, setAllUsers] = useState([]);
  useEffect(() => {
    async function getAllUsers() {
      const data = await getAllUser();
      setAllUsers(data);
    }
    getAllUsers();
  }, []);
  allUsers.forEach((element) => {
    element.id = element._id;
    element.key = element._id;
  });
  // console.log('allusers', allUsers);
  return (
    <div>
      <section className="createCommentWrapper">
        <div className="createcontrol">
          <MentionsInput
            type="text"
            id="commentContent"
            placeholder="Leave a comment or mention people using '@'"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          >
            <Mention
              trigger="@"
              data={allUsers}
            />
          </MentionsInput>
        </div>
        <button
          type="button"
          className="commentSubmit"
          onClick={submitHandler}
        >
          Submit
        </button>
      </section>
    </div>
  );
}
export default CreateComment;
