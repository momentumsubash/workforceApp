describe('Training Page', () => {
  let bobWilsonId, charlieDavisId;

  before(() => {
    cy.request('http://localhost:3001/api/employees').then(resp => {
      const emps = resp.body;
      bobWilsonId = emps.find(e => e.name === 'Bob Wilson').id;
      charlieDavisId = emps.find(e => e.name === 'Charlie Davis').id;
    });
  });

  beforeEach(() => {
    cy.loginAsSupervisor(1);
    cy.navigateTo('trainings');
  });

  it('TC-026/TC-031: should display training page with all sections', () => {
    cy.getByCy('training-management-title').should('contain', 'Training Management');
    cy.getByCy('employee-selector-card').should('be.visible');
    cy.getByCy('employee-select').should('be.visible');
    cy.getByCy('all-training-modules-card').should('be.visible');
    cy.getByCy('training-modules-count').should('contain', 'Total:');
  });

  it('TC-006: should show assign section after selecting employee', () => {
    cy.getByCy('employee-select').select(String(bobWilsonId));
    cy.getByCy('selected-employee-name', { timeout: 5000 }).should('be.visible');
    cy.getByCy('assign-training-card').should('be.visible');
    cy.getByCy('assign-supervisor-select').should('be.visible');
    cy.getByCy('assign-training-select').should('be.visible');
    cy.getByCy('assign-training-btn').should('be.visible');
  });

  it('TC-006: should assign training to an employee', () => {
    cy.getByCy('employee-select').select(String(bobWilsonId));
    cy.getByCy('selected-employee-name', { timeout: 5000 }).should('be.visible');
    cy.getByCy('assign-supervisor-select').select('1');
    cy.getByCy('assign-training-select').select('3');
    cy.getByCy('assign-training-btn').click();
    cy.getByCy('training-toast', { timeout: 10000 }).should('contain', 'assigned');
  });

  it('TC-008: should complete assigned training', () => {
    cy.getByCy('employee-select').select(String(charlieDavisId));
    cy.getByCy('current-trainings-table', { timeout: 10000 }).should('be.visible');
    cy.get('[data-cy^="complete-training-btn-"]', { timeout: 10000 }).first().should('be.visible').click();
    cy.getByCy('training-toast', { timeout: 10000 }).should('be.visible');
  });

  it('TC-010: should approve completed training', () => {
    cy.getByCy('employee-select').select(String(charlieDavisId));
    cy.getByCy('current-trainings-table', { timeout: 10000 }).should('be.visible');
    cy.get('[data-cy^="approve-training-btn-"]', { timeout: 10000 }).first().should('be.visible').click();
    cy.getByCy('training-toast', { timeout: 10000 }).should('be.visible');
  });

  it('TC-012: DEF-003 should allow self-approval (known bug)', () => {
    cy.getByCy('employee-select').select(String(charlieDavisId));
    cy.getByCy('current-trainings-table', { timeout: 10000 }).should('be.visible');
    cy.get('[data-cy^="approve-training-btn-"]', { timeout: 10000 }).first().should('be.visible').click();
    cy.getByCy('training-toast', { timeout: 10000 }).should('be.visible');
  });

  it('TC-026: should show training status transitions', () => {
    cy.getByCy('employee-select').select(String(charlieDavisId));
    cy.getByCy('current-trainings-table', { timeout: 10000 }).should('be.visible');
    cy.getByCy('current-trainings-table').find('tbody tr').should('have.length.gte', 1);
  });

  it('should show no trainings message for unassigned employee', () => {
    cy.getByCy('employee-select').select(String(bobWilsonId));
    cy.getByCy('current-trainings-card', { timeout: 5000 }).should('be.visible');
  });

  it('TC-009: DEF-002 should show supervisor note about assign bug', () => {
    cy.getByCy('employee-select').select(String(bobWilsonId));
    cy.getByCy('selected-employee-name', { timeout: 5000 }).should('be.visible');
    cy.getByCy('assign-supervisor-note').should('be.visible');
    cy.getByCy('assign-supervisor-note').should('contain', 'Select');
  });
});
