/**
* @jest-environment jsdom
*/
import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen, waitFor, userEvent, fireEvent } from '@testing-library/react';
import FriendSuggestion from './friendSuggestion';
import { BrowserRouter, Router } from 'react-router-dom';
import renderer from 'react-test-renderer';
import { createMemoryHistory } from '@remix-run/router';

const friendInfo = {
  "username": "Moshe_Lowe42",
  "name": "Ms. Vicky Koch",
  "password": "sYkoD0zZ7qh9WwP",
  "profilePic": "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/327.jpg",
  "posts": [
    1,
    2,
    3
  ],
  "followees": [
    
  ],
  "followers": [
    "3",
    "4",
    "5"
  ],
  "profile": {
    "firstName": "Lois",
    "lastName": "Steuber"
  },
  "id": "2"
}

describe("Element existence test", () => {
  test('renders Follow text', () => {
    render(
      <BrowserRouter>
        <FriendSuggestion friend={friendInfo} key={friendInfo.id} />
      </BrowserRouter>
    );
    const followText = screen.getByText('Follow');
    expect(followText).toBeInTheDocument();
    expect(followText.innerHTML).toBe('Follow');
  });
})

describe("Event test", () => {
  test('click profile avatar and navigate to other profile page', async () => {
    const history = createMemoryHistory();
    render(
      <Router location={history.location} navigator={history}>
        <FriendSuggestion friend={friendInfo} key={friendInfo.id} />
      </Router>
    );
    fireEvent.click(screen.getByRole("presentation"))
    expect(history.location.pathname).toBe('/profile/2');
  }) 
})
