class EmployeesPage {
  visit() {
    cy.visit('/employees');
  }

  getEmployeeList() {
    return cy.getByCy('employee-list');
  }

  getEmployeeTable() {
    return cy.getByCy('employee-table');
  }

  getAddEmployeeButton() {
    return cy.getByCy('add-employee-btn');
  }

  getEmployeeCount() {
    return cy.getByCy('employee-count');
  }

  getModal() {
    return cy.getByCy('employee-modal');
  }

  getModalTitle() {
    return cy.getByCy('employee-modal-title');
  }

  getModalSuccess() {
    return cy.getByCy('employee-modal-success');
  }

  getModalError() {
    return cy.getByCy('employee-modal-error');
  }

  // The table body doesn't have its own data-cy, use the table and find tbody
  getTableBody() {
    return cy.getByCy('employee-table').find('tbody', { timeout: 10000 });
  }

  openAddModal() {
    this.getAddEmployeeButton().click();
    this.getModal().should('be.visible');
  }

  fillEmployeeForm({ employee_id, name, email, department }) {
    cy.getByCy('employee-id-input').clear().type(employee_id);
    cy.getByCy('employee-name-input').clear().type(name);
    cy.getByCy('employee-email-input').clear().type(email);
    if (department) {
      cy.getByCy('employee-department-select').select(department);
    }
  }

  submitModal() {
    cy.getByCy('employee-modal-submit').click();
  }

  closeModal() {
    cy.getByCy('employee-modal-close').click();
  }

  cancelModal() {
    cy.getByCy('employee-modal-cancel').click();
  }

  getFirstEditButton() {
    return cy.getByCy('employee-table').find('tbody tr').first().find('[data-cy^="edit-employee-btn-"]');
  }

  getFirstDeleteButton() {
    return cy.getByCy('employee-table').find('tbody tr').first().find('[data-cy^="delete-employee-btn-"]');
  }

  getFirstViewTrainingsButton() {
    return cy.getByCy('employee-table').find('tbody tr').first().find('[data-cy^="view-trainings-btn-"]');
  }

  getMessage() {
    return cy.getByCy('employee-message');
  }

  getTrainingsModal() {
    return cy.getByCy('employee-trainings-modal');
  }

  getTrainingsTable() {
    return cy.getByCy('employee-trainings-table');
  }

  closeTrainingsModal() {
    cy.getByCy('employee-trainings-close').click();
  }
}

export default EmployeesPage;
