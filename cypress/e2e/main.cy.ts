describe('Main page smoke test', () => {
  beforeEach(() => {
    cy.visit('/'); // The baseUrl is set in cypress.config.ts
  });

  it('should load the main page', () => {
    // Check that the body has loaded
    cy.get('body').should('exist');

    // Check that there is at least one grid element
    cy.get('.ant-row .ant-col').should('have.length.greaterThan', 0);
  });
});
