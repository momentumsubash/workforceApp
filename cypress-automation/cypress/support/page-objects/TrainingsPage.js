class TrainingsPage {
  visit() {
    cy.visit('/trainings');
  }

  selectEmployee(employeeId) {
    cy.getByCy('employee-select').select(employeeId.toString());
  }

  getSelectedEmployeeName() {
    return cy.getByCy('selected-employee-name');
  }

  assignTraining(trainingId, supervisorId) {
    cy.getByCy('assign-supervisor-select').select(supervisorId.toString());
    cy.getByCy('assign-training-select').select(trainingId.toString());
    cy.getByCy('assign-training-btn').click();
  }

  completeTraining(trainingId) {
    cy.getByCy(`complete-training-btn-${trainingId}`, { timeout: 10000 }).click();
  }

  approveTraining(trainingId) {
    cy.getByCy(`approve-training-btn-${trainingId}`, { timeout: 10000 }).click();
  }

  getTrainingStatus(trainingId) {
    return cy.getByCy(`training-status-${trainingId}`);
  }

  getTrainingList() {
    return cy.getByCy('training-list');
  }

  getTitle() {
    return cy.getByCy('training-management-title');
  }

  getEmployeeSelectorCard() {
    return cy.getByCy('employee-selector-card');
  }

  getEmployeeSelect() {
    return cy.getByCy('employee-select');
  }

  getAllTrainingModulesCard() {
    return cy.getByCy('all-training-modules-card');
  }

  getAssignTrainingCard() {
    return cy.getByCy('assign-training-card');
  }

  getAssignSupervisorSelect() {
    return cy.getByCy('assign-supervisor-select');
  }

  getAssignTrainingSelect() {
    return cy.getByCy('assign-training-select');
  }

  getAssignTrainingButton() {
    return cy.getByCy('assign-training-btn');
  }

  getCurrentTrainingsCard() {
    return cy.getByCy('current-trainings-card');
  }

  getCurrentTrainingsTable() {
    return cy.getByCy('current-trainings-table');
  }

  getNoTrainingsMessage() {
    return cy.getByCy('no-trainings-message');
  }

  getToast() {
    return cy.getByCy('training-toast');
  }

  getApprovedLabel(trainingId) {
    return cy.getByCy(`training-approved-${trainingId}`);
  }
}

export default TrainingsPage;
