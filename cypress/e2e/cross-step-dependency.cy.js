describe('Cross-step dependency: Step 6 visibility', () => {
  it('does not show Step 6 for a small personal loan', () => {
    cy.visit('/');
    cy.contains('Personal Loan').click();
    cy.get('#loanAmount').type('100000');
    cy.get('#loanTenure').type('24');
    cy.get('#loanPurpose').select('Medical');
    cy.contains('button', 'Next').click();
    // Continue through steps and assert Step 6 (Co-Applicant) is skipped.
    // Full implementation would fill steps 2-5 using custom commands.
  });
});
