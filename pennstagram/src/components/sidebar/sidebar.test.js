/* eslint-disable no-undef */
/* eslint-disable import/no-extraneous-dependencies */
/**
* @jest-environment jsdom
*/
import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from '@remix-run/router';
import { Router } from 'react-router-dom';
import Sidebar from './sidebar';

// components rendering

test('renders a homepage tab', () => {
  const history = createMemoryHistory();

  render(
    <Router location={history.location} navigator={history}>
      <Sidebar />
    </Router>,
  );
  const home = screen.getByText(/HOMEPAGE/i);
  expect(home).toBeInTheDocument();
  const profile = screen.getByText(/PROFILE/i);
  expect(profile).toBeInTheDocument();
});

// snapshot Testing

// event
test('paths changed after clicking on a tab', async () => {
  const history = createMemoryHistory();

  render(
    <Router location={history.location} navigator={history}>
      <Sidebar />
    </Router>,
  );
  const home = screen.getByText(/HOMEPAGE/i);
  expect(home).toBeInTheDocument();
  userEvent.click(screen.getByText(/HOMEPAGE/i));
  expect(history.location.pathname).toBe('/home/null');
  userEvent.click(screen.getByText(/PROFILE/i));
  expect(history.location.pathname).toBe('/profile/null');
  userEvent.click(screen.getByText(/CONNECTION/i));
  expect(history.location.pathname).toBe('/connection/null');
});
