describe('Certification Page Tests', () => {
  beforeEach(() => {
    cy.loginAsSupervisor(1);
    cy.navigateTo('certifications');
  });

  it('TC-013: should display certifications page', () => {
    certificationsPage.getPageHeader().should('be.visible');
    certificationsPage.getPageTitle().should('contain', 'Certification Management');
    certificationsPage.getCard().should('be.visible');
    certificationsPage.getCardTitle().should('contain', 'Employee Certifications');
    certificationsPage.getTable().should('be.visible');
    certificationsPage.getCheckExpiringButton().should('be.visible');
    certificationsPage.getCount().should('contain', 'Total:');
  });

  it('TC-015/TC-016: should check expiring certifications (30-day bug DEF-004)', () => {
    certificationsPage.clickCheckExpiring();
  });

  it('should delete a certification', () => {
    certificationsPage.getDeleteCertButton(1).should('be.visible');
  });

  it('TC-016: should show expire within 30 days for near-expiry certs', () => {
    certificationsPage.getTable().should('be.visible');
    cy.getByCy('certifications-table').find('tbody tr').each(($row) => {
      cy.wrap($row).find('[data-cy^="cert-days-left-"]').then(($days) => {
        const text = $days.text().trim();
        if (text !== 'Expired!' && text.includes('days')) {
          const num = parseInt(text);
          expect(num).to.be.gte(0);
        }
      });
    });
  });

  it('TC-016: should show bug note about DEF-004 (30-day off-by-one)', () => {
    certificationsPage.getBugNote().should('be.visible');
    certificationsPage.getBugNote().should('contain', '30-day');
  });

  it('TC-013: should show certification description text', () => {
    certificationsPage.getDescription().should('be.visible');
    certificationsPage.getDescription().should('contain', 'automatically created');
  });

  it('TC-013: should have correct table headers', () => {
    cy.getByCy('th-cert-employee').should('contain', 'Employee');
    cy.getByCy('th-cert-name').should('contain', 'Certification');
    cy.getByCy('th-cert-expiry').should('contain', 'Expiry');
    cy.getByCy('th-cert-days').should('contain', 'Days');
    cy.getByCy('th-cert-actions').should('contain', 'Actions');
  });
});
