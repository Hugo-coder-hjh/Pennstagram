describe('Test that we can login and follow a user', () => {
  it('passes if we can login and follow a user', () => {
    cy.visit('http://localhost:3000/login')

    // check that successfully direct to login page
    cy.get('.loginButton').contains('Sign in')

    // type the username of the user
    // test that the input box is updated correctely
    cy.get('#username').type('cypress').should('have.value', 'cypress')
    
    // type the password of the user
    // test that the input box is updated correctely
    cy.get('#password').type('cypress').should('have.value', 'cypress')
    
    // click on the login button
    cy.get('.loginButton').click()

    // check that search input is shown on the page
    cy.get('.searchInput').type('follow')

    // click the search button
    cy.get('.searchButton').click()

    // check we are in the searched user's profile
    cy.get('.profileName').contains('Name:follow')

    // click on the follow button
    cy.get('.followBtn').click()

    // go to the connection page
    cy.get('.directToConnection').contains('CONNECTION')
    cy.get('.directToConnection').click()

    // check the follow user in on the page
    cy.get('.cardfollow')

  })
})