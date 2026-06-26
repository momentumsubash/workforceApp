import './commands';
import '@cypress/code-coverage/support';
import 'cypress-mochawesome-reporter/register';

import LoginPage from '../support/page-objects/LoginPage';
import DashboardPage from '../support/page-objects/DashboardPage';
import EmployeesPage from '../support/page-objects/EmployeesPage';
import TrainingsPage from '../support/page-objects/TrainingsPage';
import CertificationsPage from '../support/page-objects/CertificationsPage';

Cypress.on('uncaught:exception', () => false);

globalThis.loginPage = new LoginPage();
globalThis.dashboardPage = new DashboardPage();
globalThis.employeesPage = new EmployeesPage();
globalThis.trainingsPage = new TrainingsPage();
globalThis.certificationsPage = new CertificationsPage();
