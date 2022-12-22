/**
* @jest-environment jsdom
*/
/* global test, expect */
import React from 'react';
// import testing library functions
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import renderer from 'react-test-renderer';
import Post from './post';
import Feed from '../feed/feed';

const postExample = {
  photo: 'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/376.jpg',
  userId: parseInt(1, 10),
  likes: [],
  comment: [],
  profilePicture: 'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/376.jpg',
  username: 'Bruce Lee',
};

// Snapshot testing

test('Upload feeed matches snapshot', () => {
  const component = renderer.create(<Post post={postExample} />);
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

// unit test for the react component
// test block
test('Post', () => {
  // render the component on virtual dom
  render(<Post post={postExample} />);
  // select the elements
  const like = screen.getByTestId('likeUsedForTest');
  const incrementBtn = screen.getByTestId('increment');

  // before the like click event
  expect(like).toHaveTextContent('0 people like it');
  // interact with those elements
  fireEvent.click(incrementBtn);
  // assert the expected result
  expect(like).toHaveTextContent('1 people like it');
});

test('Post', async () => {
  // render the component on virtual dom
  render(<Post post={postExample} />);

  // await waitFor(() => {
  //   // select the elements
  //   const submit = screen.getByTestId('editPopupBtnForTest');
  //   // assert the expected result
  //   expect(submit).toBeTruthy();
  // })
});

