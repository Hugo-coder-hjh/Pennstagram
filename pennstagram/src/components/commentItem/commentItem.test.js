/**
* @jest-environment jsdom
*/
/* global test, expect */
import React from 'react';
// import testing library functions
import '@testing-library/jest-dom/extend-expect';
import { render } from '@testing-library/react';
import renderer from 'react-test-renderer';
import CommentItem from './commentItem';

const commentExample = {
  userId: 34223,
  name: 'Clinton',
  content: '123 @[amy](5)',
  postId: '2',
  id: '12',
};

// Snapshot testing

test('Upload feeed matches snapshot', () => {
  const component = renderer.create(<CommentItem comment={commentExample} />);
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});


// unit test for the react component
// test block
test('Comment', () => {
  // render the component on virtual dom
  render(<CommentItem comment={commentExample} />);
  // select the elements
  const author = document.getElementById('commentAuthor12');
  expect(author).toBeInTheDocument();
  const content = document.getElementById('comment12');
  expect(content).toBeInTheDocument();
});

// test('Post', () => {
//   // render the component on virtual dom
//   render(<Post post={postExample} />);
//   // select the elements
//   const formBtn = screen.getByTestId('formBtnForTest');

//   // interact with those elements
//   fireEvent.click(formBtn);
//   const submit = screen.getByTestId('submitBtnForTest');
//   // assert the expected result
//   expect(submit).toBeTruthy();
// });

