/* eslint-disable no-underscore-dangle */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import CommentItem from '../commentItem/commentItem';
import CreateComment from '../createComment/createComment';
import './comment.css';

/**
 * Comment component
 * @returns Comment component
 */
function Comment({
  viewer, postId, commentIds, comments, setComments, updateCommentInPost, setCommentIds,
}) {
  // console.log('commentIds', commentIds);
  // get array of the post's comment id
  const [commentChanged, setCommentChanged] = useState(false);
  function handleCommentChanged() {
    setCommentChanged(!commentChanged);
  }

  useEffect(() => {
    // setCommentChanged(!commentChanged);
  }, [commentChanged]);

  return (
    <div>
      <CreateComment
        key={`create${postId}`}
        postId={postId}
        user={viewer}
        commentIds={commentIds}
        comments={comments}
        setCommentIds={setCommentIds}
        setComments={setComments}
        commentChanged={commentChanged}
        handleCommentChanged={handleCommentChanged}
        updateCommentInPost={updateCommentInPost}
      />
      {comments.map((comment) => (
        <CommentItem
          key={comment._id}
          postId={postId}
          commentIds={commentIds}
          comment={comment}
          commentChanged={commentChanged}
          handleCommentChanged={handleCommentChanged}
          updateCommentInPost={updateCommentInPost}
        />
      ))}
    </div>
  );
}
export default Comment;
