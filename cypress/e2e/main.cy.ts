describe('Basic tests that check page loading', () => {
  beforeEach(() => {
    cy.visit('/'); // The baseUrl is set in cypress.config.ts
  });

  it('should load the main page', () => {
    // Check that the body has loaded
    cy.get('body').should('exist');

    // Check that there is at least one grid element
    cy.get('.ant-row .ant-col').should('have.length.greaterThan', 0);
  });

  it('should have a visible header', () => {
    // Check that the header exists and is visible
    cy.get('header').should('exist').and('be.visible');
  });

  it('should have a visible main content area', () => {
    // Check that the main content wrapper exists
    cy.get('main').should('exist').and('be.visible');
  });

  it('should have a visible footer', () => {
    // Check that the footer exists and is visible
    cy.get('footer').should('exist').and('be.visible');
  });

  it('should render a pagination component if present', () => {
    // Check if pagination exists, but only if rendered
    cy.get('ul.ant-pagination').should('exist');
  });

  it('should have at least one filter input visible', () => {
    // Checks for the presence of at least one filter control
    cy.get('[data-cy^=filter]').should('exist').and('be.visible');
  });
});
