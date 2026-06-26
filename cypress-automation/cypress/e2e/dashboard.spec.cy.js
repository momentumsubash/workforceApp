describe('Dashboard (Mocked API)', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/employees', {
      statusCode: 200,
      body: [
        { id: 1, employee_id: 'SUP001', name: 'Jane Smith', email: 'jane@test.com', department_name: 'Engineering', is_supervisor: 1 },
        { id: 2, employee_id: 'EMP001', name: 'John Doe', email: 'john@test.com', department_name: 'Engineering', is_supervisor: 0 },
      ],
    }).as('getEmployees');

    cy.intercept('GET', '**/api/trainings', {
      statusCode: 200,
      body: [
        { id: 1, training_name: 'Safety Training' },
        { id: 2, training_name: 'Leadership Training' },
      ],
    }).as('getTrainings');

    cy.intercept('GET', '**/api/certifications/count', {
      statusCode: 200,
      body: { count: 5 },
    }).as('getCertCount');

    cy.intercept('GET', '**/api/certifications/expiring', {
      statusCode: 200,
      body: [
        { id: 1, employee_name: 'John Doe', certification_name: 'First Aid', expiry_date: '2026-07-15', days_left: 20 },
      ],
    }).as('getExpiring');

    cy.loginAsSupervisor(1);
  });

  it('should show dashboard with user greeting', () => {
    cy.url().should('include', '/dashboard');
    dashboardPage.getUserGreeting().should('be.visible');
    dashboardPage.getUserRoleInfo().should('be.visible');
  });

  it('should display app header elements', () => {
    dashboardPage.getAppTitle().should('contain', 'WorkForcePro');
    dashboardPage.getApiStatus().should('be.visible');
    dashboardPage.getUserBadge().should('be.visible');
  });

  it('should show all stat cards with mocked values', () => {
    cy.wait('@getEmployees');
    cy.wait('@getTrainings');
    cy.wait('@getCertCount');
    cy.wait('@getExpiring');

    dashboardPage.getStatCard('employees').should('be.visible');
    dashboardPage.getStatCard('trainings').should('be.visible');
    dashboardPage.getStatCard('certifications').should('be.visible');
    dashboardPage.getStatCard('expiring').should('be.visible');
  });

  it('should show numeric values matching our mock data', () => {
    cy.wait('@getEmployees');
    // Employees stat should show 2 (our mock has 2 employees)
    dashboardPage.getStatCard('employees').find('p').invoke('text').then(Number).should('eq', 2);
  });

  it('should show all sidebar navigation for supervisors', () => {
    dashboardPage.getNavItem('dashboard').should('be.visible');
    dashboardPage.getNavItem('employees').should('be.visible');
    dashboardPage.getNavItem('trainings').should('be.visible');
    dashboardPage.getNavItem('certifications').should('be.visible');
    dashboardPage.getNavItem('reports').should('be.visible');
    dashboardPage.getSidebarRole().should('contain', 'Supervisor');
  });

  it('should navigate to all pages from sidebar', () => {
    const pages = ['employees', 'trainings', 'certifications', 'reports'];
    pages.forEach((page) => {
      dashboardPage.navigateTo(page);
    });
  });

  it('should show employee role for employee login', () => {
    cy.loginAsEmployee(1);
    dashboardPage.getUserRoleInfo().should('contain', 'Employee');
    dashboardPage.getSidebarRole().should('contain', 'Employee');
  });

  it('should not show reports nav for employee role', () => {
    cy.loginAsEmployee(1);
    dashboardPage.getNavItem('reports').should('not.exist');
  });

  it('should logout successfully', () => {
    dashboardPage.logout();
    cy.url().should('eq', Cypress.config().baseUrl + '/');
    loginPage.isVisible();
  });

  it('should show login page elements after logout', () => {
    dashboardPage.logout();
    loginPage.isVisible();
    loginPage.getEmailInput().should('be.visible');
    loginPage.getPasswordInput().should('be.visible');
  });

  it('should show error state when mocked API fails', () => {
    cy.intercept('GET', '**/api/employees', {
      statusCode: 500,
      body: { error: 'Server error' },
    }).as('apiFail');

    cy.visit('/dashboard');
    cy.wait('@apiFail');
    dashboardPage.getErrorMessage({ timeout: 10000 }).should('be.visible');
  });
});
