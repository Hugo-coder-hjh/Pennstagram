/* eslint-disable no-undef */
/* eslint-disable import/no-extraneous-dependencies */
/**
* @jest-environment jsdom
*/
import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import {
  render, screen, fireEvent,
} from '@testing-library/react';
import { BrowserRouter, Router } from 'react-router-dom';
import { createMemoryHistory } from '@remix-run/router';
import FriendsCard from './friendsCard';

const friendInfo = {
  username: 'Moshe_Lowe42',
  name: 'Ms. Vicky Koch',
  password: 'sYkoD0zZ7qh9WwP',
  profilePic: 'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/327.jpg',
  posts: [
    1,
    2,
    3,
  ],
  followees: [

  ],
  followers: [
    '3',
    '4',
    '5',
  ],
  profile: {
    firstName: 'Lois',
    lastName: 'Steuber',
  },
  id: '2',
};

describe('Element existence test', () => {
  test('renders Unfollow text', () => {
    render(
      <BrowserRouter>
        <FriendsCard friend={friendInfo} key={friendInfo.id} />
      </BrowserRouter>,
    );
    const unfollowTest = screen.getByText('Unfollow');
    expect(unfollowTest).toBeInTheDocument();
    expect(unfollowTest.innerHTML).toBe('Unfollow');
  });
});

describe('Event test', () => {
  test('click profile avatar and navigate to other profile page', async () => {
    const history = createMemoryHistory();
    render(
      <Router location={history.location} navigator={history}>
        <FriendsCard friend={friendInfo} key={friendInfo.id} />
      </Router>,
    );
    fireEvent.click(screen.getByRole('presentation'));
    expect(history.location.pathname).toBe('/profile/2');
  });
});

//     const { container } = render(
//         <Router>
//             <FriendsCard friend={friendInfo} key={friendInfo.id} />
//         </Router>
//     );

//     await waitFor(()=> {
//         container.hasAttribute("friendsCard");
//         const btn = screen.getByTestId('FBTN');
//         // fireEvent.click(btn)
//         expect(btn.innerHTML).toEqual(expect.stringContaining('ollow'))
//     })
// });
