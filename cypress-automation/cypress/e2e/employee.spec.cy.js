describe('Employee Management (Real API)', () => {
  const uniqueId = `E2E${Date.now()}`;
  const uniqueEmail = `e2e.${Date.now()}@workforcepro.com`;

  beforeEach(() => {
    cy.loginAsSupervisor(1);
    cy.navigateTo('employees');
  });

  it('should display employee list with all elements', () => {
    employeesPage.getEmployeeList().should('be.visible');
    employeesPage.getEmployeeTable().should('be.visible');
    employeesPage.getAddEmployeeButton().should('be.visible');
    employeesPage.getEmployeeCount().should('contain', 'Total:');
  });

  it('should open add employee modal with correct form fields', () => {
    employeesPage.openAddModal();
    employeesPage.getModalTitle().should('contain', 'Create Employee');
    cy.getByCy('employee-id-input').should('be.visible');
    cy.getByCy('employee-name-input').should('be.visible');
    cy.getByCy('employee-email-input').should('be.visible');
    cy.getByCy('employee-department-select').should('be.visible');
    cy.getByCy('employee-supervisor-select').should('be.visible');
  });

  it('should create a new employee via real API', () => {
    employeesPage.openAddModal();
    employeesPage.fillEmployeeForm({
      employee_id: uniqueId,
      name: 'E2E Test User',
      email: uniqueEmail,
      department: 'Engineering',
    });
    employeesPage.submitModal();

    // Confirm the row appears in the table
    cy.contains(uniqueId, { timeout: 10000 }).should('be.visible');
    cy.contains('E2E Test User').should('be.visible');
  });

  it('should show error for duplicate employee ID via real API', () => {
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

  it('should open edit modal for first employee', () => {
    employeesPage.getTableBody().should('exist');
    employeesPage.getFirstEditButton().click();
    employeesPage.getModal().should('be.visible');
    employeesPage.getModalTitle().should('contain', 'Edit Employee');
  });

  it('should update an employee via real API', () => {
    // Use the employee we just created
    cy.contains(uniqueId, { timeout: 10000 }).should('be.visible');

    cy.get(`[data-cy^="edit-employee-btn-"]`).first().click();
    cy.getByCy('employee-name-input').clear().type('E2E Updated Name');
    employeesPage.submitModal();

    cy.contains('E2E Updated Name', { timeout: 10000 }).should('be.visible');
  });

  it('should delete the employee via real API', () => {
    cy.contains(uniqueId, { timeout: 10000 }).should('be.visible');

    cy.get(`[data-cy^="delete-employee-btn-"]`).first().click();

    cy.contains(uniqueId).should('not.exist');
  });

  it('should view employee trainings modal', () => {
    employeesPage.getTableBody().should('exist');
    employeesPage.getFirstViewTrainingsButton().click();

    employeesPage.getTrainingsModal().should('be.visible');
    employeesPage.getTrainingsTable().should('be.visible');
    employeesPage.closeTrainingsModal();
    employeesPage.getTrainingsModal().should('not.exist');
  });

  it('should close add modal via cancel button', () => {
    employeesPage.openAddModal();
    employeesPage.cancelModal();
    employeesPage.getModal().should('not.exist');
  });
});
