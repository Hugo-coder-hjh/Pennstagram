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
import RegistrationComponent from './registrationComponent';

test('renders a registration page', async () => {
  const history = createMemoryHistory();

  const { container } = render(
    <Router location={history.location} navigator={history}>
      <RegistrationComponent />
    </Router>,
  );
  const username = screen.getByText(/Your Username/);
  expect(username).toBeInTheDocument();
  const myPassword = screen.getByText(/Your Password/);
  expect(myPassword).toBeInTheDocument();
  const confirm = screen.getByText(/Confirm Password/);
  expect(confirm).toBeInTheDocument();
  const name = screen.getByText(/Your Full Name/);
  expect(name).toBeInTheDocument();
  const signup = screen.getByText(/Sign up/);
  expect(signup).toBeInTheDocument();
  const btn = screen.getByText(/Register/);
  expect(btn).toBeInTheDocument();
  const change = screen.getByText(/Change to login/);
  expect(change).toBeInTheDocument();
  expect(container.firstChild.firstChild).toHaveClass('auth');
  fireEvent.click(signup);
  expect(history.location.pathname).toBe('/');
  fireEvent.click(change);
  expect(history.location.pathname).toBe('/');
});
