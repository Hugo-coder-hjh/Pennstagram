/**
* @jest-environment jsdom
*/
import React from "react";
import '@testing-library/jest-dom/extend-expect';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { createMemoryHistory } from '@remix-run/router';
import { Router } from 'react-router-dom';
import Searchbar from "./searchbar";


test ('renders a searchbar', async() => {
    const history = createMemoryHistory();
    render(
        <Router location={history.location} navigator={history}>
          <Searchbar />
        </Router>,
      );

    await waitFor(()=> {
        const input = screen.getByLabelText(/search/i);
        fireEvent.change(input, {target: {value: 'Gloria Collins Jr.'}})
        expect(input.value).toBe('Gloria Collins Jr.')
        const btn = screen.getByLabelText(/button/i);
        expect(btn).toBeInTheDocument();
        //fireEvent.click(btn);
        //expect(history.location.pathname).toBe('/profile');
    })
});