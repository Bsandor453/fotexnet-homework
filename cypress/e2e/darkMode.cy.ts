describe('Dark Mode functional tests', () => {
  beforeEach(() => {
    // Stub initial load
    cy.intercept('GET', '**/artists**').as('fetchArtists');
    cy.visit('/');
    cy.wait('@fetchArtists');
    cy.get('.ant-spin').should('not.exist');
  });

  it('toggles from light to dark mode', () => {
    // Initially, assume light mode
    cy.get('header').should('have.css', 'background-color', 'rgb(245, 245, 245)');

    // Click toggle
    cy.contains('button', 'Set to dark mode').click();

    // Assert header background changes to dark
    cy.get('header').should('have.css', 'background-color', 'rgb(31, 31, 31)');

    // Button text/icon should update
    cy.contains('button', 'Set to light mode').should('exist');
  });

  it('toggles back from dark to light mode', () => {
    // Turn dark mode on first
    cy.contains('button', 'Set to dark mode').click();
    cy.get('header').should('have.css', 'background-color', 'rgb(31, 31, 31)');

    // Click again to revert
    cy.contains('button', 'Set to light mode').click();

    // Header should be back to light color
    cy.get('header').should('have.css', 'background-color', 'rgb(245, 245, 245)');

    // Button text/icon should be 'Set to dark mode' again
    cy.contains('button', 'Set to dark mode').should('exist');
  });
});
