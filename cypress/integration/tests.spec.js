function dialogCloseButton() {
  return cy.get(`#dialog button:contains('Close')`);
}

function clapButton() {
  return cy.get(".button-wrapper button.button-icon");
}

function clapSvg() {
  return cy.get(".button-wrapper button.button-icon svg.icon");
}

function sideNav() {
  return cy.get("[data-testid=side-nav]");
}

function sideNavButton() {
  return cy.get("[data-testid=side-nav-button]");
}

describe("[page tests]", function () {
  it("visited", function () {
    cy.visit("https://localhost:8080/claptastic/");
    dialogCloseButton().should("be.visible");
    dialogCloseButton().should("exist");
    dialogCloseButton().click();
    dialogCloseButton().should("not.exist");

    clapButton().should("be.visible");
    clapSvg().should("not.have.attr", "data-clapping");
    clapButton().click();
    clapSvg().should("have.attr", "data-clapping");

    sideNav().should("not.be.visible");
    sideNavButton().click();
    sideNav().should("be.visible");

    sideNavButton().click();
    sideNav().should("not.be.visible");
  });
});
