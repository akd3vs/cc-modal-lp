/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

Cypress.Commands.add('openModal', () => {
  cy.get('.btn.btn-primary').click()
})

const defaultOptions = {
  name: 'test',
  price: 15000.05,
  sku: 'test-1',
  type: ['Vegetables', 'Meat']
}

Cypress.Commands.add('fillForm', (options: FillFormOptions = defaultOptions) => {
  const { name, price, sku, type } = options

  if (name && price && sku && type) {
    cy.get('input[name="name"]').type(name)
    cy.get('input[name="price"]').type(String(price))
    cy.get('input[name="sku"]').type(sku)
    cy.get('label[data-input-name="type"] + .dropdown-container .dropdown-field').click()

    type.forEach((option) => {
      cy.get('.dropdown-option:not(.is-group) a').contains(option).click()
    })

    cy.get('button[type="submit"').click()
  }
})

Cypress.Commands.add('verifyTableWithOptions', (options: FillFormOptions = defaultOptions) => {
  const { name, price, sku, type } = options

  if (name && price && sku && type) {
    const tr = cy.get('tr[data-testid="datatable-tr"]')

    tr.get('td').contains(name)
    tr.get('td').contains(
      new Intl.NumberFormat('default', {
        style: 'decimal',
        maximumFractionDigits: 2,
        minimumFractionDigits: 2
      }).format(price)
    )
    tr.get('td').contains(sku)
    tr.get('td').contains(type.join(', '))
  }
})

Cypress.Commands.add('goToSettings', () => {
  cy.get('.btn').contains('Configurations').click()
})

Cypress.Commands.add('inSettingsChangeMaxPrice', (newPrice) => {
  cy.get('input[name="maxPrice"]').clear().type(String(newPrice))
})

Cypress.Commands.add('goToStore', () => {
  cy.go('back')
})

interface FillFormOptions {
  name?: string
  price?: number
  sku?: string
  type?: Array<string>
}

declare global {
  namespace Cypress {
    interface Chainable {
      openModal(): Chainable<void>
      fillForm(options?: FillFormOptions | undefined): Chainable<void>
      verifyTableWithOptions(options?: FillFormOptions): Chainable<void>
      goToSettings(): Chainable<void>
      inSettingsChangeMaxPrice(price: number): Chainable<void>
      goToStore(): Chainable<void>
    }
  }
}

export {}
