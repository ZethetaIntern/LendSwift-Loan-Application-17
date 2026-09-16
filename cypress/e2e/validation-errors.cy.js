describe('Step 1 validation', () => {
  it('shows errors when submitting empty', () => {
    cy.visit('/');
    cy.contains('button', 'Next').click();
    cy.contains('Select a loan type').should('be.visible');
  });
});
