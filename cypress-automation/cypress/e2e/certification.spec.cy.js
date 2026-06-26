describe('Certification Management (Mocked API)', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/certifications', {
      statusCode: 200,
      body: [
        { id: 1, employee_name: 'John Doe', certification_name: 'AWS Certified Developer', expiry_date: '2027-12-31', days_left: 365 },
        { id: 2, employee_name: 'Jane Smith', certification_name: 'PMP', expiry_date: '2027-06-30', days_left: 365 },
      ],
    }).as('getCerts');

    cy.loginAsSupervisor(1);
    cy.navigateTo('certifications');
  });

  it('should display certifications page with all elements', () => {
    certificationsPage.getPageHeader().should('be.visible');
    certificationsPage.getPageTitle().should('contain', 'Certification Management');
    certificationsPage.getCard().should('be.visible');
    certificationsPage.getTable().should('be.visible');
    certificationsPage.getCheckExpiringButton().should('be.visible');
    certificationsPage.getCount().should('contain', 'Total:');
  });

  it('should display using CertificationList component', () => {
    certificationsPage.getCertList().should('be.visible');
    certificationsPage.getCertListTitle().should('contain', 'Certifications');
    certificationsPage.getCertListTable().should('be.visible');
    certificationsPage.getAddCertButton().should('be.visible');
    certificationsPage.getCheckExpiringListButton().should('be.visible');
    certificationsPage.getCertListCount().should('contain', 'Total:');
  });

  it('should add a certification via modal', () => {
    cy.intercept('POST', '**/api/certifications', {
      statusCode: 200,
      body: { message: 'Certification created successfully' },
    }).as('createCert');

    certificationsPage.openAddModal();
    certificationsPage.getModalTitle().should('contain', 'Assign Certification');
    certificationsPage.fillCertModal({
      employee: 1,
      name: 'AWS Certified Developer',
      expiry: '2027-12-31',
    });
    certificationsPage.submitModal();

    cy.wait('@createCert');
    certificationsPage.getModalSuccess().should('be.visible');
  });

  it('should add a certification via inline form', () => {
    cy.intercept('POST', '**/api/certifications', {
      statusCode: 200,
      body: { message: 'Certification assigned successfully' },
    }).as('createCertForm');

    certificationsPage.getForm().should('be.visible');
    certificationsPage.getFormTitle().should('contain', 'Assign Certification');
    certificationsPage.fillCertForm({
      employee: 1,
      name: 'AWS Certified Solutions Architect',
      expiry: '2027-06-30',
    });
    certificationsPage.submitForm();

    cy.wait('@createCertForm');
    certificationsPage.getFormSuccess().should('be.visible');
  });

  it('should delete a certification', () => {
    cy.intercept('DELETE', '**/api/certifications/*', {
      statusCode: 200,
      body: { message: 'Certification deleted' },
    }).as('deleteCert');

    certificationsPage.getCertListTable({ timeout: 10000 }).should('be.visible');
    certificationsPage.deleteFirstCert();

    cy.wait('@deleteCert');
    certificationsPage.getCertListMessage().should('be.visible');
  });

  it('should check expiring certifications', () => {
    cy.intercept('GET', '**/api/certifications/expiring', {
      statusCode: 200,
      body: [
        { id: 1, employee_name: 'John Doe', certification_name: 'First Aid', expiry_date: '2026-07-15', days_left: 20 },
        { id: 2, employee_name: 'Jane Smith', certification_name: 'Safety', expiry_date: '2026-07-20', days_left: 25 },
      ],
    }).as('checkExpiring');

    certificationsPage.getCheckExpiringListButton().click();
    cy.wait('@checkExpiring');
    certificationsPage.getCertListMessage().should('be.visible');
  });

  it('should show days-left warning for near-expiry certs', () => {
    cy.intercept('GET', '**/api/certifications', {
      statusCode: 200,
      body: [
        { id: 10, employee_name: 'Test User', certification_name: 'Expiring Cert', expiry_date: '2026-07-10', days_left: 15 },
      ],
    }).as('loadCerts');

    cy.wait('@loadCerts');
    certificationsPage.getCertRow(10).should('be.visible');
    certificationsPage.getCertDaysLeft(10).should('be.visible');
    certificationsPage.getCertDaysLeft(10).invoke('text').then(Number).should('be.lt', 30);
    certificationsPage.getDeleteCertButton(10).should('be.visible');
  });

  it('should display bug note about DEF-003', () => {
    certificationsPage.getBugNote().should('be.visible');
  });

  it('should close cert modal via close button', () => {
    certificationsPage.openAddModal();
    certificationsPage.closeModal();
    certificationsPage.getModal().should('not.exist');
  });

  it('should close cert modal via cancel button', () => {
    certificationsPage.openAddModal();
    certificationsPage.cancelModal();
    certificationsPage.getModal().should('not.exist');
  });

  it('should show error on cert creation failure', () => {
    cy.intercept('POST', '**/api/certifications', {
      statusCode: 500,
      body: { error: 'Internal server error' },
    }).as('createCertFail');

    certificationsPage.openAddModal();
    certificationsPage.fillCertModal({
      employee: 1,
      name: 'Failing Cert',
      expiry: '2027-12-31',
    });
    certificationsPage.submitModal();

    cy.wait('@createCertFail');
    certificationsPage.getModalError().should('be.visible');
  });
});
