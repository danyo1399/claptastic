function closeButton() {
  return cy.get(`#dialog button:contains('Close')`);
}

function clapButton() {
  return cy.get(".button-wrapper button.button-icon");
}

function clapSvg() {
  return cy.get(".button-wrapper button.button-icon svg.icon");
}

describe("[page tests]", function () {
  it("visited", function () {
    cy.visit("https://localhost:8080/claptastic/");
    closeButton().should("be.visible");
    closeButton().should("exist");
    closeButton().click();
    closeButton().should("not.be.visible");

    clapButton().should("be.visible");
    clapSvg().should("not.have.attr", "data-clapping");
    clapButton().click();
    clapSvg().should("have.attr", "data-clapping");

  });
});
