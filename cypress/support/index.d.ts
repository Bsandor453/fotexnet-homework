// declare the type for your custom command
declare namespace Cypress {
  interface Chainable<Subject = any> {
    /**
     * Select an option in an AntD Select component using data-cy attribute
     * @param dataCy The data-cy attribute of the Select wrapper
     * @param option The visible option text to select
     */
    selectAntd(dataCy: string, option: string): Chainable<Subject>;
  }
}
