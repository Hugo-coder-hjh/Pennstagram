/* eslint-disable no-undef */
/* eslint-disable import/no-extraneous-dependencies */
/**
* @jest-environment jsdom
*/
import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import {
  render, screen, waitFor,
} from '@testing-library/react';
import { createMemoryHistory } from '@remix-run/router';
import { Router } from 'react-router-dom';
import ProfileComponent from './profileComponent';

// components rendering

test('renders a profile page', async () => {
  const history = createMemoryHistory({ initialEntries: ['/profile/1'] });

  console.log(history.location);

  const { container } = render(
    <Router history={history} location={history.location} navigator={history}>
      <ProfileComponent />
    </Router>,
  );
  container.hasAttribute('profileCard');

  await waitFor(() => {
    const element = screen.getByTestId('name-element');
    expect(element).toHaveTextContent('Name:');
    // const btn = screen.getByTestId('followBtnTest');
    // fireEvent.click(btn)
    // expect(btn.innerHTML).toEqual(expect.stringContaining('ollow'))
  });
  // const img = screen.getByAltText(/userProfilePic/i);
  // console.log(img);
});
