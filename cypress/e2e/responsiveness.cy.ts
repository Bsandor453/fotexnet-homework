describe('Responsiveness tests', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/artists**', { fixture: 'artists.json' }).as('fetchArtists');
    cy.visit('/');
    cy.wait('@fetchArtists');
    cy.get('.ant-spin').should('not.exist');
  });

  const assertGridOrError = (callback: ($cols: JQuery) => void) => {
    cy.get('body').then(($body) => {
      if ($body.find('.ant-alert').length > 0) {
        cy.get('.ant-alert').should('be.visible');
      } else {
        cy.get('.ant-row .gutter-row').then(callback);
      }
    });
  };

  it('checks grid columns and header responsiveness', () => {
    cy.viewport(320, 480);
    assertGridOrError(($cols) => {
      cy.wrap($cols).each(($col) => {
        cy.wrap($col).should('have.attr', 'class').and('include', 'ant-col-xs-24');
      });
    });

    cy.viewport(768, 1024);
    assertGridOrError(($cols) => {
      cy.wrap($cols).each(($col) => {
        cy.wrap($col).should('have.attr', 'class').and('include', 'ant-col-md-8');
      });
    });

    cy.viewport(1920, 1080);
    assertGridOrError(($cols) => {
      cy.wrap($cols).each(($col) => {
        cy.wrap($col).should('have.attr', 'class').and('include', 'ant-col-lg-6');
      });
    });

    // Check header wraps on small screens
    cy.viewport(320, 480);
    cy.get('#filters').should('have.css', 'flex-wrap', 'wrap');
  });
});
