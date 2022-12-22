/* eslint-disable no-underscore-dangle */
/* eslint-disable react/void-dom-elements-no-children */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/prop-types */
import React, { useEffect, useRef, useState } from 'react';
import { deleteCommentById, updateComment, editCommentInComments } from '../../mockAPI/mockAPI';
import './commentItem.css';

function CommentItem({
  postId, commentIds, comment, handleCommentChanged, updateCommentInPost,
}) {
  console.log('CommentIds', commentIds);
  const myUserId = localStorage.getItem('myUserID');
  // console.log(comment);
  const [edit, setEdit] = useState(false);
  const contentRef = useRef();
  const deleteComment = async () => {
    await deleteCommentById(comment._id);
    const ids = commentIds;
    // eslint-disable-next-line no-undef
    const newComments = ids.filter((x) => String(x) !== String(comment._id));
    await editCommentInComments(newComments, postId);
    console.log(newComments);
    handleCommentChanged();
    updateCommentInPost();
  };

  const editComment = () => {
    setEdit(!edit);
    if (edit === true) {
      updateCommentInPost();
    }
  };

  const submitHandler = (event) => {
    event.preventDefault();
    const contentValue = contentRef.current.value;
    // console.log(contentValue);
    updateComment(contentValue, comment._id);
    contentRef.current.value = '';
  };

  const changeContentToLink = (content, commentId) => {
    const contentArray = content.split(' ');
    // console.log('contentArray', contentArray);
    const newArray = [];
    contentArray.forEach((word) => {
      if (word.includes('@')) {
        const position = word.indexOf('(');
        // console.log('position', position);
        const id = word.substring(position + 1, position + 25);
        // console.log('id', id);
        const name = word.substring(2, position - 1);
        const newWord = `<a href="/profile/${id}">@${name}</a>`;
        // console.log('newWord', newWord);
        newArray.push(newWord);
      } else {
        newArray.push(word);
      }
    });
    // console.log('newArray', newArray);
    const newContent = newArray.join(' ');
    // console.log('newContent', newContent);
    const changeContent = document.getElementById(`comment${commentId}`);
    // console.log('selectElement', changeContent);
    changeContent.innerHTML = newContent;
    // const afterchangeContent = document.getElementById(`comment${commentId}`);
    // console.log('afterselectElement', afterchangeContent);
  };
  useEffect(() => changeContentToLink(comment.content, comment._id));

  return (
    <div>
      <div id={`commentAuthor${comment._id}`}>
        Author:
        {' '}
        {comment.name}
      </div>
      <div id={`comment${comment._id}`}>
        <div> </div>
      </div>
      {comment.userId === myUserId ? <button className="editBtn" type="button" onClick={editComment}>Edit</button> : null}
      {edit === true ? (
        <div className="popup-box">
          <form onSubmit={submitHandler}>
            <label>
              Edit your comment:
              <input type="text" name="content" required ref={contentRef} />
            </label>
            <input className="closeEdit" type="submit" value="Submit" />
          </form>
          <button type="button" className="close-btn" onClick={editComment}>Close</button>
        </div>
      ) : null}
      {comment.userId === myUserId ? <button className="deleteBtn" type="button" onClick={deleteComment}>Delete</button> : null}
    </div>
  );
}
export default CommentItem;
