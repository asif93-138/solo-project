import { Builder, By, until } from "selenium-webdriver";
import assert from "assert";

const generateRandomString = (length: number) => {
    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};

let driver: any;

beforeAll(async () => {
    driver = await new Builder().forBrowser("chrome").build();
});

afterAll(async () => {
    await driver.quit();
});

const username = generateRandomString(8);
const email = `${username}@example.com`;
const password = "password123";

describe("Register & Login New User", () => {
    it("should register and then log in the new user", async () => {
        await driver.get("http://localhost:5173/register");

        await driver.findElement(By.name("name")).sendKeys(username);
        await driver.findElement(By.name("email")).sendKeys(email);
        await driver.findElement(By.name("pass")).sendKeys(password);
        await driver.findElement(By.css("input[type='submit']")).click();

        const registerModal = await driver.wait(
            until.elementLocated(By.css("#my_modal_2")),
            10000
        );

        await driver.wait(until.elementIsVisible(registerModal), 10000);
        const registerModalText = await registerModal.getText();
        assert.strictEqual(
            registerModalText.includes("Registration successful!"),
            true
        );

        await driver.get("http://localhost:5173/login");

        await driver.findElement(By.name("email")).sendKeys(email);
        await driver.findElement(By.name("pass")).sendKeys(password);
        await driver.findElement(By.css("input[type='submit']")).click();

        const loginModal = await driver.wait(
            until.elementLocated(By.css("#my_modal_2")),
            10000
        );

        await driver.wait(until.elementIsVisible(loginModal), 10000);
        const loginModalText = await loginModal.getText();
        assert.strictEqual(loginModalText.includes("Login successful!"), true);
    });
});

describe("Duplicate Email Registration", () => {
    it("should show an error modal for duplicate email or other server errors", async () => {
        await driver.get("http://localhost:5173/register");

        await driver.findElement(By.name("name")).sendKeys(username);
        await driver.findElement(By.name("email")).sendKeys(email);
        await driver.findElement(By.name("pass")).sendKeys(password);

        await driver.findElement(By.css("input[type='submit']")).click();

        const modal = await driver.wait(
            until.elementLocated(By.css("#my_modal_1")),
            50000
        );

        await driver.wait(until.elementIsVisible(modal), 10000);
        const modalText = await modal.getText();
        assert.strictEqual(modalText.includes("An error occurred!"), true);
    });
});

describe("Invalid User Authentication", () => {
    const invalidUser = {
        email: "invalid@example.com",
        password: "wrongpassword",
    };

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
        assert.strictEqual(modalText.includes("Email or Password didn't match!"), true);
    });

    it("should show an error for weak password", async () => {
        await driver.get("http://localhost:5173/register");

        await driver.findElement(By.name("name")).sendKeys(generateRandomString(8));
        await driver
            .findElement(By.name("email"))
            .sendKeys(`${generateRandomString(8)}@example.com`);
        await driver.findElement(By.name("pass")).sendKeys("short");

        await driver.findElement(By.css("input[type='submit']")).click();

        const warning = await driver.findElement(By.id("passWarn"));
        const warningText = await warning.getText();

        assert.strictEqual(warningText.includes("Password must be at least 8 characters long!"), true);
    });
});
