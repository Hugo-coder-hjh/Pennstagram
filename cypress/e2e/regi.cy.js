describe('Test that we can register a new user', () => {
  it('passes if we can register a new user', () => {
    cy.visit('http://localhost:3000/registration')
    // check that the register button is displayed
    cy.get('.regiButton').contains('Register')
    
    // type the name of the user
    // test that the input box is updated correctely
    cy.get('#name').type('cypress').should('have.value', 'cypress')

    // type the username of the user
    // test that the input box is updated correctely
    cy.get('#username').type('cypress').should('have.value', 'cypress')
    
    // type the password of the user
    // test that the input box is updated correctely
    cy.get('#password').type('cypress').should('have.value', 'cypress')
    
    // type the confirmPassword of the user
    // test that the input box is updated correctely
    cy.get('#confirmPassword').type('cypress').should('have.value', 'cypress')
    
    // click on the regi button
    cy.contains('Register').click();
    
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

    // go to the profile page
    cy.get('.directToProfile').contains('PROFILE')
    cy.get('.directToProfile').click()

    // check name cypress is shown on the page
    cy.get('.uploadOptionText').contains('Name:cypress')
  })
})