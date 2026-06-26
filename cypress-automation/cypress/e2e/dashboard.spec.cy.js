describe('Dashboard Tests', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/employees', {
      statusCode: 200,
      body: [
        { id: 1, employee_id: 'SUP001', name: 'Jane Smith', email: 'jane.smith@workforcepro.com', department_name: 'Engineering', is_supervisor: 1 },
        { id: 2, employee_id: 'EMP001', name: 'John Doe', email: 'john.doe@workforcepro.com', department_name: 'Engineering', is_supervisor: 0 },
      ],
    }).as('getEmployees');

    cy.intercept('GET', '**/api/trainings', {
      statusCode: 200,
      body: [
        { id: 1, training_name: 'Safety Training' },
      ],
    }).as('getTrainings');

    cy.intercept('GET', '**/api/certifications', {
      statusCode: 200,
      body: [
        { id: 1, employee_name: 'John Doe', certification_name: 'First Aid', expiry_date: '2027-12-31', days_left: 365 },
      ],
    }).as('getCerts');

    cy.intercept('GET', '**/api/certifications/expiring', {
      statusCode: 200,
      body: [
        { id: 1, employee_name: 'John Doe', certification_name: 'First Aid', expiry_date: '2026-07-15', days_left: 20 },
      ],
    }).as('getExpiring');

    cy.loginAsSupervisor(1);
  });

  it('TC-020: should load the dashboard successfully', () => {
    cy.url().should('include', '/dashboard');
    dashboardPage.getUserGreeting().should('be.visible');
  });

  it('TC-031/TC-030: should display user info', () => {
    dashboardPage.getUserRoleInfo().should('be.visible');
  });

  it('TC-021: employee count stat card should be visible', () => {
    cy.wait('@getEmployees');
    dashboardPage.getStatCard('employees').should('be.visible');
  });

  it('TC-022: training count stat card should be visible', () => {
    cy.wait('@getTrainings');
    dashboardPage.getStatCard('trainings').should('be.visible');
  });

  it('TC-023: certification count stat card should be visible', () => {
    cy.wait('@getCerts');
    dashboardPage.getStatCard('certifications').should('be.visible');
  });

  it('TC-024: expiring certifications alert should show', () => {
    cy.wait('@getExpiring');
    dashboardPage.getStatCard('expiring').should('be.visible');
  });

  it('TC-020: should display all 4 stat cards on dashboard', () => {
    cy.wait('@getEmployees');
    cy.wait('@getTrainings');
    cy.wait('@getCerts');
    cy.wait('@getExpiring');
    dashboardPage.getStatCard('employees').should('be.visible');
    dashboardPage.getStatCard('trainings').should('be.visible');
    dashboardPage.getStatCard('certifications').should('be.visible');
    dashboardPage.getStatCard('expiring').should('be.visible');
  });

  it('TC-031: should have supervisor navigation items', () => {
    dashboardPage.getNavItem('dashboard').should('be.visible');
    dashboardPage.getNavItem('employees').should('be.visible');
    dashboardPage.getNavItem('trainings').should('be.visible');
    dashboardPage.getNavItem('certifications').should('be.visible');
    dashboardPage.getNavItem('reports').should('be.visible');
    dashboardPage.getSidebarRole().should('contain', 'Supervisor');
  });

  it('TC-017: should navigate to employees page', () => {
    dashboardPage.navigateTo('employees');
    cy.url().should('include', '/employees');
  });

  it('TC-017: should navigate to trainings page', () => {
    dashboardPage.navigateTo('trainings');
    cy.url().should('include', '/trainings');
  });

  it('TC-017: should navigate to certifications page', () => {
    dashboardPage.navigateTo('certifications');
    cy.url().should('include', '/certifications');
  });

  it('TC-017: should navigate to reports page', () => {
    dashboardPage.getNavItem('reports').click();
    cy.url().should('include', '/reports');
  });

  it('TC-030: should logout successfully', () => {
    dashboardPage.logout();
    cy.url({ timeout: 10000 }).should('include', '/login');
    loginPage.isVisible();
  });

  it('TC-020: should show loading state then dashboard', () => {
    cy.visit('/dashboard');
    cy.getByCy('dashboard-loading', { timeout: 5000 }).should('not.exist');
    dashboardPage.getUserGreeting().should('be.visible');
  });
});
