class CertificationsPage {
  visit() {
    cy.visit('/certifications');
  }

  getPageHeader() {
    return cy.getByCy('certifications-page-header');
  }

  getPageTitle() {
    return cy.getByCy('certifications-page-title');
  }

  getCard() {
    return cy.getByCy('certifications-card');
  }

  getCardTitle() {
    return cy.getByCy('certifications-card-title');
  }

  getDescription() {
    return cy.getByCy('certifications-desc');
  }

  getTable() {
    return cy.getByCy('certifications-table');
  }

  getCheckExpiringButton() {
    return cy.getByCy('check-expiring-btn');
  }

  getCount() {
    return cy.getByCy('certifications-count');
  }

  getBugNote() {
    return cy.getByCy('cert-bug-note');
  }

  getMessage() {
    return cy.getByCy('certifications-message');
  }

  getCertRow(id) {
    return cy.getByCy(`cert-row-${id}`);
  }

  getCertDaysLeft(id) {
    return cy.getByCy(`cert-days-left-${id}`);
  }

  getDeleteCertButton(id) {
    return cy.getByCy(`delete-cert-btn-${id}`);
  }

  deleteFirstCert() {
    cy.get('[data-cy^="delete-cert-btn-"]').first().click();
  }

  clickCheckExpiring() {
    this.getCheckExpiringButton().click();
  }

  getHeaderCell(position) {
    return cy.getByCy(`th-cert-${position}`);
  }

  getLoading() {
    return cy.getByCy('certifications-loading');
  }
}

export default CertificationsPage;
