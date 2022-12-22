/**
 * @jest-environment jsdom
 */

/* eslint-disable no-undef */
/* eslint-disable import/no-extraneous-dependencies */
/**
* @jest-environment jsdom
*/
import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen, fireEvent } from '@testing-library/react';
import { createMemoryHistory } from '@remix-run/router';
import { Router } from 'react-router-dom';
import LoginComponent from './loginComponent';

test('use jsdom in this test file', () => {
  const element = document.createElement('div');
  expect(element).not.toBeNull();
});

// components rendering

test('renders a login page', async () => {
  const history = createMemoryHistory();

  const { container } = render(
    <Router location={history.location} navigator={history}>
      <LoginComponent />
    </Router>,
  );
  const username = screen.getByText(/Your Username/);
  expect(username).toBeInTheDocument();
  const myPassword = screen.getByText(/Your Password/);
  expect(myPassword).toBeInTheDocument();
  const signin = screen.getByText(/Sign in/);
  expect(signin).toBeInTheDocument();
  const change = screen.getByText(/Creat a new account/);
  expect(change).toBeInTheDocument();
  expect(container.firstChild.firstChild).toHaveClass('auth');
  await fireEvent.click(signin);
  expect(history.location.pathname).toBe('/');
});
