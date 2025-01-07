import { Builder, By, until, Browser } from "selenium-webdriver";
import assert from "assert";

const existingUser = {
    email: "anushua.ahmed@gmail.com",
    password: "12345678",
};

const invalidUser = {
    email: "invalid@example.com",
    password: "wrongpassword",
};

describe("Login Integration Test", () => {
    let driver: any;

    beforeAll(async () => {
        driver = await new Builder().forBrowser("chrome").build();
    });

    afterAll(async () => {
        await driver.quit();
    });

    it("should login successfully with valid credentials", async () => {
        await driver.get("http://localhost:5173/login");

        await driver.findElement(By.name("email")).sendKeys(existingUser.email);
        await driver.findElement(By.name("pass")).sendKeys(existingUser.password);

        await driver.findElement(By.css("input[type='submit']")).click();

        const modal = await driver.wait(
            until.elementLocated(By.css("#my_modal_2")),
            10000
        );
        await driver.wait(until.elementIsVisible(modal), 10000);
        const modalText = await modal.getText();
        console.log("modalText:", modalText);

        assert.strictEqual(modalText.includes("Login successful!"), true);

        await driver.wait(until.urlIs("http://localhost:5173/"), 5000);
    });

    it("should show an error modal for invalid credentials", async () => {
        await driver.get("http://localhost:5173/login");

        await driver.findElement(By.name("email")).sendKeys(invalidUser.email);
        await driver.findElement(By.name("pass")).sendKeys(invalidUser.password);

        await driver.findElement(By.css("input[type='submit']")).click();

        const modal = await driver.wait(
            until.elementLocated(By.css("#my_modal_1")),
            10000
        );
        await driver.wait(until.elementIsVisible(modal), 10000);
        const modalText = await modal.getText();
        console.log("modalText:", modalText);

        assert.strictEqual(
            modalText.includes("Email or Password didn't match!"),
            true
        );
    });
});
