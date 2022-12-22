/**
* @jest-environment jsdom
*/
/* global expect, test */
import React from 'react';
// import testing library functions
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import renderer from 'react-test-renderer';
import Feed from './feed';

// Snapshot testing

// Rendering testing
test('renders Photo button', () => {
  const { getByText } = render(<Feed />);
  const linkElement = getByText(/Photo or Video/);
  expect(linkElement).toBeInTheDocument();
});

test('Upload feeed matches snapshot', () => {
  const component = renderer.create(<Feed />);
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
