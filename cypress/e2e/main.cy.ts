describe('Basic tests that check page loading', () => {
  beforeEach(() => {
    // Intercept the API that fetches the grid items
    cy.intercept('GET', 'https://exam.api.fotex.net/api/artists*').as('getArtists');
    cy.visit('/'); // The baseUrl is set in cypress.config.ts

    // Wait for the fetch to complete
    cy.wait('@getArtists');
  });

  it('should load the page', () => {
    // Check that the body has loaded
    cy.get('body').should('exist');
  });

  it('should have a header, main content and footer', () => {
    // Check that the header exists and is visible
    cy.get('header').should('exist').and('be.visible');

    // Check that the main content wrapper exists
    cy.get('main').should('exist').and('be.visible');

    // Check that the footer exists and is visible
    cy.get('footer').should('exist').and('be.visible');
  });

  it('should render grid or show error', () => {
    // Check if a grid item exists, but only if there is no error (check for the error message otherwise)
    cy.get('body').then(($body) => {
      if ($body.find('.ant-row .ant-col').length > 0) {
        cy.get('.ant-row .ant-col').should('have.length.greaterThan', 0);
      } else {
        cy.get('[data-cy=error-message]').should('exist').and('be.visible');
      }
    });
  });

  it('should have all 3 filter controls', () => {
    // Checks for the presence of the filter controls
    cy.get('[data-cy^=filter]').should('have.length', 3);
  });

  it('should render pagination if the grid is present or show error', () => {
    // Check if the pagination exists, but only if there is no error (check for the error message otherwise)
    cy.get('body').then(($body) => {
      if ($body.find('.ant-row .ant-col').length > 0) {
        cy.get('ul.ant-pagination').should('exist');
      } else {
        cy.get('[data-cy=error-message]').should('exist').and('be.visible');
      }
    });
  });
});
