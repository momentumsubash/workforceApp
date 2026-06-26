class LoginPage {
  visit() {
    cy.visit('/');
  }

  enterEmail(email) {
    cy.getByCy('email-input').clear().type(email);
  }

  enterPassword(password) {
    cy.getByCy('password-input').clear().type(password);
  }

  clickLogin() {
    cy.getByCy('login-btn').click();
  }

  loginAs(email, password) {
    this.visit();
    this.enterEmail(email);
    this.enterPassword(password);
    this.clickLogin();
    cy.url({ timeout: 10000 }).should('include', '/dashboard');
  }

  loginViaDemo(role, index = 1) {
    this.visit();
    const group = role === 'supervisor' ? 'supervisor' : 'employee';
    cy.getByCy(`demo-btn-${group}-${index}`).click();
    cy.url({ timeout: 10000 }).should('include', '/dashboard');
  }

  getEmailInput() {
    return cy.getByCy('email-input');
  }

  getPasswordInput() {
    return cy.getByCy('password-input');
  }

  getLoginButton() {
    return cy.getByCy('login-btn');
  }

  getDemoButton(role, index) {
    const group = role === 'supervisor' ? 'supervisor' : 'employee';
    return cy.getByCy(`demo-btn-${group}-${index}`);
  }

  isVisible() {
    cy.getByCy('login-page').should('be.visible');
    cy.getByCy('login-form').should('be.visible');
  }
}

export default LoginPage;
