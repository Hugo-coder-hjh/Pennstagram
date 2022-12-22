/* eslint-disable import/no-extraneous-dependencies */
/**
* @jest-environment jsdom
*/
import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import {
  render, screen, waitFor, fireEvent,
} from '@testing-library/react';
import { createMemoryHistory } from '@remix-run/router';
import { Router } from 'react-router-dom';
import Navbar from './navbar';

test('renders a Navbar', async () => {
  const history = createMemoryHistory();
  render(
    <Router location={history.location} navigator={history}>
      <Navbar />
    </Router>,
  );

  await waitFor(() => {
    const logo = screen.getByText(/PENNSTAGRAM/i);
    expect(logo).toBeInTheDocument();
    fireEvent.click(logo);
    expect(history.location.pathname).toBe('/home/null');
    const logout = screen.getByText(/Log Out/i);
    fireEvent.click(logout);
    expect(history.location.pathname).toBe('/');
  });
});
