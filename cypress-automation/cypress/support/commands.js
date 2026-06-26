Cypress.Commands.add('getByCy', (selector) => {
  return cy.get(`[data-cy="${selector}"]`);
});

Cypress.Commands.add('login', (email, password) => {
  cy.visit('/');
  cy.getByCy('email-input').clear().type(email);
  cy.getByCy('password-input').clear().type(password);
  cy.getByCy('login-btn').click();
  cy.url({ timeout: 10000 }).should('include', '/dashboard');
});

Cypress.Commands.add('loginAsSupervisor', (index = 1) => {
  cy.visit('/');
  cy.getByCy(`demo-btn-supervisor-${index}`).click();
  cy.url({ timeout: 10000 }).should('include', '/dashboard');
});

Cypress.Commands.add('loginAsEmployee', (index = 1) => {
  cy.visit('/');
  cy.getByCy(`demo-btn-employee-${index}`).click();
  cy.url({ timeout: 10000 }).should('include', '/dashboard');
});

Cypress.Commands.add('logout', () => {
  cy.getByCy('logout-btn').click();
  cy.url().should('eq', Cypress.config().baseUrl + '/');
});

Cypress.Commands.add('navigateTo', (page) => {
  cy.getByCy(`nav-${page}`).click();
  cy.url().should('include', `/${page}`);
});
