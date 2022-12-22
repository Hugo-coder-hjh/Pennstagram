/* eslint-disable no-undef */
// import testing library functions
import '@testing-library/jest-dom/extend-expect';
// eslint-disable-next-line no-unused-vars
import { render } from '@testing-library/react';
import renderer from 'react-test-renderer';
import CreateComment from './createComment';

// Snapshot testing

test('createCommentComponent', () => {
  const component = renderer.create(<CreateComment />);
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
/*
// unit test for the react component
// test block
test('Create Comment', () => {
  // render the component on virtual dom
  render(<CreateComment />);
  // select the elements
  const wrapper = document.getElementsByClassName('createCommentWrapper');
  expect(wrapper).toBeInTheDocument();
  const btn = document.getElementsByClassName('commentSubmit');
  expect(btn).toBeInTheDocument();
});
*/
// describe("render commentCreated", () => {
//   test('renders a commentCreated page', async() => {
//     const { container } = render(
//       <CreateComment />
//     );
//     container.hasAttribute('commentCreated');
// })
// })
