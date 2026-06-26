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

  getTable() {
    return cy.getByCy('certifications-table');
  }

  getCheckExpiringButton() {
    return cy.getByCy('check-expiring-btn');
  }

  getCount() {
    return cy.getByCy('certifications-count');
  }

  getCertList() {
    return cy.getByCy('cert-list');
  }

  getCertListTitle() {
    return cy.getByCy('cert-list-title');
  }

  getCertListTable() {
    return cy.getByCy('cert-list-table');
  }

  getAddCertButton() {
    return cy.getByCy('add-cert-btn');
  }

  getCheckExpiringListButton() {
    return cy.getByCy('cert-list-check-expiring');
  }

  getCertListCount() {
    return cy.getByCy('cert-list-count');
  }

  getCertListMessage() {
    return cy.getByCy('cert-list-message');
  }

  getBugNote() {
    return cy.getByCy('cert-bug-note');
  }

  getModal() {
    return cy.getByCy('cert-modal');
  }

  getModalTitle() {
    return cy.getByCy('cert-modal-title');
  }

  getModalSuccess() {
    return cy.getByCy('cert-modal-success');
  }

  getModalError() {
    return cy.getByCy('cert-modal-error');
  }

  openAddModal() {
    this.getAddCertButton().click();
    this.getModal().should('be.visible');
  }

  fillCertModal({ employee, name, expiry }) {
    cy.getByCy('cert-modal-employee').select(employee.toString());
    cy.getByCy('cert-modal-name').type(name);
    cy.getByCy('cert-modal-expiry').type(expiry);
  }

  submitModal() {
    cy.getByCy('cert-modal-submit').click();
  }

  closeModal() {
    cy.getByCy('cert-modal-close').click();
  }

  cancelModal() {
    cy.getByCy('cert-modal-cancel').click();
  }

  getForm() {
    return cy.getByCy('cert-form');
  }

  getFormTitle() {
    return cy.getByCy('cert-form-title');
  }

  fillCertForm({ employee, name, expiry }) {
    cy.getByCy('cert-form-employee').select(employee.toString());
    cy.getByCy('cert-form-name').type(name);
    cy.getByCy('cert-form-expiry').type(expiry);
  }

  submitForm() {
    cy.getByCy('cert-form-submit').click();
  }

  getFormSuccess() {
    return cy.getByCy('cert-form-success');
  }

  deleteFirstCert() {
    this.getCertListTable().find('tbody tr').first().within(() => {
      cy.get('[data-cy^="cert-list-delete-"]').click();
    });
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
}

export default CertificationsPage;
