/**
* @jest-environment jsdom
*/
/* global test, expect, jest */
import React from 'react';
import '@testing-library/jest-dom';
// import MockAdapter from 'axios-mock-adapter';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Upload from './upload';

// const axios = require('axios');

// const mockAxios = new MockAdapter(axios);

// Rendering testing

test('renders button', () => {
  const { getByText } = render(<Upload />);
  const linkElement = getByText(/Photo or Video/);
  expect(linkElement).toBeInTheDocument();

  const linkElementTwo = getByText(/Submit/);
  expect(linkElementTwo).toBeInTheDocument();
});

test('clicking on a input', async () => {
  // render the component
  render(<Upload />);
  const file = new File(['hello'], 'hello.png');
  global.URL.createObjectURL = jest.fn();

  const input = screen.getByLabelText(/|/i);
  userEvent.upload(input, file);

  expect(input.files[0]).toStrictEqual(file);
  expect(input.files.item(0)).toStrictEqual(file);
  expect(input.files).toHaveLength(1);
});
