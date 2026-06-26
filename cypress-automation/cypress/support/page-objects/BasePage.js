class BasePage {
    constructor() {
        this.timeout = 5000;
    }

    navigate(url) {
        cy.visit(url);
    }

    waitForElement(selector, timeout = this.timeout) {
        cy.get(selector, { timeout: timeout }).should('exist');
    }

    click(selector) {
        cy.get(selector).click();
    }

    type(selector, text) {
        cy.get(selector).type(text);
    }

    getText(selector) {
        return cy.get(selector).invoke('text').then(text => text.trim());
    }

    isVisible(selector, timeout = this.timeout) {
        cy.get(selector, { timeout: timeout }).should('be.visible');
    }

    waitForApiCall(alias, timeout = this.timeout) {
        cy.wait(alias, { timeout: timeout });
    }
}

export default BasePage;
