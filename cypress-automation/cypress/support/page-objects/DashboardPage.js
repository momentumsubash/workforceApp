class DashboardPage {
  visit() {
    cy.visit('/dashboard');
  }

  getUserGreeting() {
    return cy.getByCy('user-greeting');
  }

  getUserRoleInfo() {
    return cy.getByCy('user-role-info');
  }

  getStatCard(name) {
    return cy.getByCy(`stat-${name}`);
  }

  getSidebarRole() {
    return cy.getByCy('sidebar-role');
  }

  navigateTo(page) {
    cy.getByCy(`nav-${page}`).click();
    cy.url().should('include', `/${page}`);
  }

  logout() {
    cy.getByCy('logout-btn').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  }

  waitForStatsToLoad() {
    cy.getByCy('dashboard-loading', { timeout: 10000 }).should('not.exist');
  }

  isLoginPageVisible() {
    cy.getByCy('login-page').should('be.visible');
  }

  isLoginFormVisible() {
    cy.getByCy('login-form').should('be.visible');
  }

  getErrorMessage() {
    return cy.getByCy('dashboard-error');
  }

  getAppTitle() {
    return cy.getByCy('app-title');
  }

  getApiStatus() {
    return cy.getByCy('api-status');
  }

  getUserBadge() {
    return cy.getByCy('user-badge');
  }

  getNavItem(page) {
    return cy.getByCy(`nav-${page}`);
  }
}

export default DashboardPage;
