describe('Training Management (Real API)', () => {
  beforeEach(() => {
    cy.loginAsSupervisor(1);
    cy.navigateTo('trainings');
  });

  it('should display training page with all sections', () => {
    trainingsPage.getTrainingList().should('be.visible');
    trainingsPage.getTitle().should('contain', 'Training Management');
    trainingsPage.getEmployeeSelectorCard().should('be.visible');
    trainingsPage.getEmployeeSelect().should('be.visible');
    trainingsPage.getAllTrainingModulesCard().should('be.visible');
  });

  it('should show assign section after selecting an employee', () => {
    cy.intercept('GET', '**/api/employees/*/trainings', { fixture: 'employee-trainings.json' }).as('getTrainings');

    trainingsPage.selectEmployee(13);
    trainingsPage.getSelectedEmployeeName().should('be.visible');
    trainingsPage.getAssignTrainingCard().should('be.visible');
    trainingsPage.getAssignSupervisorSelect().should('be.visible');
    trainingsPage.getAssignTrainingSelect().should('be.visible');
    trainingsPage.getAssignTrainingButton().should('be.visible');
  });

  it('should assign training to employee via real API', () => {
    trainingsPage.selectEmployee(13);
    trainingsPage.getSelectedEmployeeName().should('be.visible');
    trainingsPage.assignTraining(1, 1); // supervisor=Jane Smith, training=Safety Training

    trainingsPage.getToast().should('contain', 'Training assigned');
    cy.getByCy('current-trainings-table').should('contain', 'Safety Training');
  });

  it('should complete an assigned training via real API', () => {
    // John Doe has Safety Training assigned from previous test
    trainingsPage.selectEmployee(13);
    trainingsPage.getSelectedEmployeeName().should('be.visible');

    // Scroll past the assign card to find current trainings
    cy.getByCy('current-trainings-table', { timeout: 10000 }).should('be.visible');

    // Find the first complete button and click it
    cy.get('[data-cy^="complete-training-btn-"]').first().should('be.visible').click();

    trainingsPage.getToast().should('contain', 'completed');
  });

  it('should approve a completed training via real API', () => {
    trainingsPage.selectEmployee(13);
    trainingsPage.getSelectedEmployeeName().should('be.visible');

    cy.getByCy('current-trainings-table', { timeout: 10000 }).should('be.visible');

    // Find the first approve button and click it
    cy.get('[data-cy^="approve-training-btn-"]').first().should('be.visible').click();

    trainingsPage.getToast().should('contain', 'approved');
  });

  it('DEF-003: should show error when supervisor self-approves (mocked)', () => {
    cy.intercept('POST', '**/api/trainings/approve', {
      statusCode: 400,
      body: { error: 'Cannot approve your own training' },
    }).as('selfApprove');

    trainingsPage.selectEmployee(13);
    trainingsPage.getSelectedEmployeeName().should('be.visible');

    cy.get('[data-cy^="approve-training-btn-"]').first().click();

    cy.wait('@selfApprove');
    trainingsPage.getToast().should('contain', 'error');
  });

  it('DEF-002: should complete training without assignment (mocked)', () => {
    cy.intercept('POST', '**/api/trainings/complete', {
      statusCode: 200,
      body: { message: 'Training completed successfully' },
    }).as('completeNoAssign');

    trainingsPage.selectEmployee(999);
    cy.get('[data-cy^="complete-training-btn-"]').first().click();

    cy.wait('@completeNoAssign');
    trainingsPage.getToast().should('contain', 'success');
  });

  it('should show trainings table when employee has assignments', () => {
    cy.intercept('GET', '**/api/employees/*/trainings', {
      statusCode: 200,
      body: [{
        id: 1,
        training_id: 1,
        training_name: 'Safety Training',
        status: 'assigned',
        due_date: '2026-12-31',
        completion_date: null,
      }],
    }).as('loadTrainings');

    trainingsPage.selectEmployee(13);
    cy.wait('@loadTrainings');

    trainingsPage.getCurrentTrainingsCard().should('be.visible');
    trainingsPage.getCurrentTrainingsTable().should('be.visible');
    trainingsPage.getTrainingStatus(1).should('contain', 'assigned');
  });

  it('should show approved training status (mocked)', () => {
    cy.intercept('GET', '**/api/employees/*/trainings', {
      statusCode: 200,
      body: [{
        id: 2,
        training_id: 2,
        training_name: 'Code of Conduct',
        status: 'approved',
        due_date: '2026-11-30',
        completion_date: '2026-06-01',
      }],
    }).as('loadApproved');

    trainingsPage.selectEmployee(13);
    cy.wait('@loadApproved');

    trainingsPage.getTrainingStatus(2).should('contain', 'approved');
    trainingsPage.getApprovedLabel(2).should('be.visible');
  });
});
