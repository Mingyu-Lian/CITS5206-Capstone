const { Builder, By, until } = require("selenium-webdriver");
const assert = require("assert");
(async function loginTests() {
  // Initialize Chrome WebDriver
  let driver = new Builder().forBrowser("chrome").build();

  // Helper Function: Wait for an element to appear
  async function waitForElement(locator, timeout = 10000) {
    return await driver.wait(until.elementLocated(locator), timeout);
  }
  // Utility function to delay actions
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));


  try {


    // Test Case 2: Valid Login for Engineer User
    console.log("Running Test Case 2: Valid Login for Engineer User");
    await driver.get("http://localhost:3000/login");
    await driver.manage().window().maximize();

    const usernameInput = await waitForElement(By.id("username"));
    const passwordInput = await waitForElement(By.id("password"));
    const loginButton = await waitForElement(By.xpath("//button[@type='submit']"));

    await usernameInput.sendKeys("fiona"); // Engineer username
    await passwordInput.sendKeys("Engineer@123"); // Engineer password

    const dropdown = await waitForElement(By.id('discipline-select'));

    await dropdown.click();
    await delay(1000); // Wait for 1 seconds before selecting an option

    const option = await waitForElement(By.id("Mechanical"))
    await option.click();
    await loginButton.click();

    // Wait for navigation to the engineer dashboard
    await driver.wait(until.urlContains("/dashboard?role=engineer"), 10000);
    console.log("Engineer Login: Redirected to engineer dashboard successfully.");
    const roleEngineer = await driver.wait(async () => {
      return await driver.executeScript(function () {
        return localStorage.getItem("role");
      });
    }, 5000);
    console.log("User role:", roleEngineer); // Outputs the role, e.g., "Admin", "Engineer", etc.
    const name = await driver.wait(async () => {
      return await driver.executeScript(function () {
        return localStorage.getItem("name");
      });
    }, 10000);
    assert.equal(name, 'Fiona Brown', 'Name should be Fiona Brown in localStorage');



    let taskManagement = await waitForElement(By.id("task_managements"));
    // await delay(1000);

    await taskManagement.click();
    await delay(1000);

    let viewWMS = await waitForElement(By.id("Loco-001"));
    await viewWMS.click();
    await delay(1000);
    currentUrl = await driver.getCurrentUrl();
    assert.ok(
      currentUrl.includes("/tasks/Loco-001/wms"),
      "Redirect to wrong loco page."
    );
    console.log("Redirected to loco page successfully.");


    let viewTask = await waitForElement(By.id("WMS-003"));
    await viewTask.click();
    await delay(1000);
    currentUrl = await driver.getCurrentUrl();
    assert.ok(
      currentUrl.includes("/tasks/Loco-001/wms/WMS-003"),
      "Redirect to wrong work method statement page."
    );
    let viewUpdateTask = await waitForElement(By.id("5"));
    await viewUpdateTask.click();
    await delay(1000);
    currentUrl = await driver.getCurrentUrl();
    assert.ok(
      currentUrl.includes("/commissionjson/5"),
      "Redirect to wrong commission page."
    );
    console.log("Redirected to commission page successfully.");

  } catch (error) {
    console.error("An error occurred during the tests:", error.message);
  } finally {
    console.log("Closing the browser.");
    await driver.quit();
  }
})();