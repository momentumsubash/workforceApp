describe('Employee Page Tests', () => {
  const uniqueId = `E2E${Date.now()}`;
  const uniqueEmail = `e2e.${Date.now()}@workforcepro.com`;

  beforeEach(() => {
    cy.loginAsSupervisor(1);
    cy.navigateTo('employees');
  });

  it('TC-001/TC-031: should display employee list on page load', () => {
    employeesPage.getEmployeeList().should('be.visible');
    employeesPage.getEmployeeTable().should('be.visible');
    employeesPage.getAddEmployeeButton().should('be.visible');
    employeesPage.getEmployeeCount().should('contain', 'Total:');
  });

  it('TC-001/TC-004: should create an employee with valid data', () => {
    employeesPage.openAddModal();
    employeesPage.getModalTitle().should('contain', 'Create Employee');
    employeesPage.fillEmployeeForm({
      employee_id: uniqueId,
      name: 'E2E Test User',
      email: uniqueEmail,
      department: 'Engineering',
    });
    employeesPage.submitModal();

    cy.contains(uniqueId, { timeout: 10000 }).should('be.visible');
    cy.contains('E2E Test User').should('be.visible');
  });

  it('TC-003: should handle duplicate email error (DEF-001/DEF-006)', () => {
    employeesPage.openAddModal();
    employeesPage.fillEmployeeForm({
      employee_id: `DUP${Date.now()}`,
      name: 'Duplicate Email',
      email: uniqueEmail,
    });
    employeesPage.submitModal();

    employeesPage.getModalError().should('be.visible');
    employeesPage.closeModal();
  });

  it('TC-005: should handle duplicate ID error', () => {
    employeesPage.openAddModal();
    employeesPage.fillEmployeeForm({
      employee_id: uniqueId,
      name: 'Duplicate ID Test',
      email: `dup.${Date.now()}@workforcepro.com`,
    });
    employeesPage.submitModal();

    employeesPage.getModalError().should('be.visible');
    employeesPage.closeModal();
  });

  it('TC-002: should show validation for missing fields', () => {
    employeesPage.openAddModal();
    cy.getByCy('employee-id-input').should('have.attr', 'required');
    cy.getByCy('employee-name-input').should('have.attr', 'required');
    cy.getByCy('employee-email-input').should('have.attr', 'required');
    cy.getByCy('employee-modal-submit').click();
    cy.getByCy('employee-modal', { timeout: 10000 }).should('be.visible');
    employeesPage.closeModal();
  });

  it('should open edit modal for existing employee', () => {
    employeesPage.getTableBody().should('exist');
    employeesPage.getFirstEditButton().click();
    employeesPage.getModal().should('be.visible');
    employeesPage.getModalTitle().should('contain', 'Edit Employee');
  });

  it('TC-019: should delete an employee', () => {
    cy.contains(uniqueId, { timeout: 10000 }).should('be.visible');
    cy.get(`[data-cy^="delete-employee-btn-"]`).first().click();
  });

  it('TC-019: should close modal with cancel button', () => {
    employeesPage.openAddModal();
    employeesPage.cancelModal();
    employeesPage.getModal().should('not.exist');
  });

  it('TC-019: should close modal with X button', () => {
    employeesPage.openAddModal();
    employeesPage.closeModal();
    employeesPage.getModal().should('not.exist');
  });

  it('should view employee trainings', () => {
    employeesPage.getTableBody().should('exist');
    employeesPage.getFirstViewTrainingsButton().click();

    employeesPage.getTrainingsModal().should('be.visible');
    employeesPage.getTrainingsTable().should('be.visible');
    employeesPage.closeTrainingsModal();
    employeesPage.getTrainingsModal().should('not.exist');
  });
});
