// https://on.cypress.io/api

describe('Store tests', () => {
  it('add new product', () => {
    cy.visit('/').openModal().fillForm().verifyTableWithOptions()
  })

  it('handles more than one product', () => {
    cy.visit('/').openModal().fillForm().verifyTableWithOptions()
    const product2 = {
      name: 'test 2',
      sku: 'test-2',
      price: 2,
      type: ['Bakery', 'Pet supplies']
    }
    cy.openModal().fillForm(product2).verifyTableWithOptions(product2)
  })
})
