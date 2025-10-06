Cypress.Commands.add('selectAntd', (dataCy: string, option: string) => {
  // Click the select box
  cy.get(`[data-cy=${dataCy}] .ant-select-selector`).click();

  // Click the option inside the dropdown
  cy.get('body').find('.ant-select-dropdown').contains(option).click();
});
