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
    // Test Case 1: Valid Login for Admin User
        console.log("Running Test Case 1: Valid Login for Admin User");
        await driver.get("http://localhost:3000/login");
        await driver.manage().window().maximize();
    
        // Enter valid admin username and password
        let usernameInput = await waitForElement(By.id("username"));
        let passwordInput = await waitForElement(By.id("password"));
        let loginButton = await waitForElement(By.xpath("//button[@type='submit']"));
    
        await usernameInput.sendKeys("alice"); // Admin username
        await passwordInput.sendKeys("Admin@123"); // Admin password
        await loginButton.click();
        // Wait for redirection to the Admin dashboard
        await driver.wait(until.urlContains("/dashboard?role=admin"), 10000);
        let currentUrl = await driver.getCurrentUrl();
        assert.ok(
          currentUrl.includes("/dashboard?role=admin"),
          "Supervisor user was not redirected to the supervisor dashboard."
        );

        // Verify localStorage
        await delay(1000);
        const role = await driver.wait(async () => {
          return await driver.executeScript(function () {
            return localStorage.getItem("role");
          });
        }, 10000);
        console.log("User role:", role); // Outputs the role, e.g., "Admin", "Engineer", etc.
        assert.equal(role, 'Admin', 'Role should be Admin in localStorage');


        const name = await driver.wait(async () => {
          return await driver.executeScript(function () {
            return localStorage.getItem("name");
          });
        }, 10000);
        assert.equal(name, 'Alice Johnson', 'Name should be Alice Johnson in localStorage');

        await delay(1000);
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


        let viewTask = await waitForElement(By.id("WMS-001"));
        await viewTask.click();
        await delay(1000);
        currentUrl = await driver.getCurrentUrl();
        assert.ok(
          currentUrl.includes("/tasks/Loco-001/wms/WMS-001"),
          "Redirect to wrong work method statement page."
        );
        let viewUpdateTask = await waitForElement(By.id("1"));
        await viewUpdateTask.click();
        await delay(1000);
        currentUrl = await driver.getCurrentUrl();
        assert.ok(
          currentUrl.includes("/taskjson/1"),
          "Redirect to wrong task detail page."
        );
        console.log("Redirected to task detail page successfully.");

        let nextTask = await waitForElement(By.id("next_task"));
        await delay(1000);
        await nextTask.click();
        await delay(1000);
        currentUrl = await driver.getCurrentUrl();
        assert.ok(
          currentUrl.includes("/taskjson/2"),
          "Redirect to wrong task detail page."
        );
        console.log("Redirected to next task detail page successfully.");

    
  } catch (error) {
    console.error("An error occurred during the tests:", error.message);
  } finally {
    console.log("Closing the browser.");
    await driver.quit();
  }
})();