describe("Test admin control panel", () => {
    it("should navigate and log into admin login page", () => {
        cy.visit("/login");

        cy.get("h1").should("contain", "Admin Login");

        cy.get("#username").type("admin");
        cy.get("#password").type("admin1234");

        cy.get("#loginButton").click();

        cy.url().should("contain", "/admin");
    });
});
