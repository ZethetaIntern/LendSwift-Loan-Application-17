describe('Personal loan happy path', () => {
  it('fills step 1 and moves to step 2', () => {
    cy.visit('/');
    cy.contains('Personal Loan').click();
    cy.get('#loanAmount').type('300000');
    cy.get('#loanTenure').type('36');
    cy.get('#loanPurpose').select('Medical');
    cy.contains('button', 'Next').click();
    cy.contains('Step 2 of').should('be.visible');
  });
});
