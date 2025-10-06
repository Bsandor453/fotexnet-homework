describe('Pagination functional tests', () => {
  const page1Fixture = {
    data: [
      {
        id: 1,
        name: 'Ludwig van Beethoven',
        albumCount: 9,
        portrait: 'https://picsum.photos/seed/beethoven/500/500',
      },
      {
        id: 2,
        name: 'Wolfgang Amadeus Mozart',
        albumCount: 12,
        portrait: 'https://picsum.photos/seed/mozart/500/500',
      },
    ],
    pagination: {
      current_page: 1,
      total_pages: 2,
      per_page: 2, // small page size to force multiple pages
      total_items: 4,
    },
  };

  const page2Fixture = {
    data: [
      {
        id: 3,
        name: 'Franz Schubert',
        albumCount: 6,
        portrait: 'https://picsum.photos/seed/schubert/500/500',
      },
      {
        id: 4,
        name: 'Johann Sebastian Bach',
        albumCount: 15,
        portrait: 'https://picsum.photos/seed/bach/500/500',
      },
    ],
    pagination: {
      current_page: 2,
      total_pages: 2,
      per_page: 2,
      total_items: 4,
    },
  };

  beforeEach(() => {
    // Intercept dynamically based on page & perPage
    cy.intercept('GET', '**/artists*', (req) => {
      if (req.query.page === '2') req.reply({ body: page2Fixture });
      else req.reply({ body: page1Fixture });
    }).as('fetchArtists');

    // Visit with perPage=2 so pagination works
    cy.visit('/?perPage=2');
    cy.wait('@fetchArtists');
    cy.get('.ant-spin').should('not.exist');
  });

  it('navigates to next page correctly', () => {
    cy.get('.ant-pagination-next button').click({ force: true });
    cy.wait('@fetchArtists');
    cy.get('.ant-spin').should('not.exist');
    cy.get('.ant-row .gutter-row').should('have.length', page2Fixture.data.length);
    cy.get('.ant-pagination-item-active').should('contain.text', '2');
  });

  it('navigates back to previous page correctly', () => {
    cy.get('.ant-pagination-next button').click({ force: true });
    cy.wait('@fetchArtists');
    cy.get('.ant-spin').should('not.exist');

    cy.get('.ant-pagination-prev button').click({ force: true });
    cy.wait('@fetchArtists');
    cy.get('.ant-spin').should('not.exist');
    cy.get('.ant-row .gutter-row').should('have.length', page1Fixture.data.length);
    cy.get('.ant-pagination-item-active').should('contain.text', '1');
  });
});
