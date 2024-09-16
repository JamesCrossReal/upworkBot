const fs = require("fs/promises");
const {
  faker
} = require("@faker-js/faker");
const pt = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const UserAgent = require("user-agents");
const {
  WebClient
} = require("@slack/web-api");
// const chalk = require("chalk");
let chalk;

(async () => {
  chalk = (await import("chalk")).default;
})();

pt.use(StealthPlugin());

const AdblockerPlugin = require("puppeteer-extra-plugin-adblocker");
pt.use(
  AdblockerPlugin({
    interceptResolutionPriority: 0,
  })
);

const PASSWORD = "rmg0210$";
const FILENAME = "accounts.txt";

// // Proxy server details
// const PROXY_SERVER = '';
// const PROXY_USERNAME = '12341234';
// const PROXY_PASSWORD = 'Upwork123';

const SLACK_APP_TOKEN =
  process.env.SLACK_APP_TOKEN;
const SLACK_CHANNEL_ID = process.env.SLACK_CHANNEL_ID;

const web = new WebClient(SLACK_APP_TOKEN);

/**
 * Function for sending notification to the slack channel
 * @param {string} message
 */

async function sendSlackMessage(message) {
  try {
    // Post a message to the channel
    await web.chat.postMessage({
      channel: SLACK_CHANNEL_ID,
      text: message,
    });
  } catch (error) {
    console.log("send message error!");
  }
}

const nameArray = {
  Poland: [{
      firstName: 'Hilary',
      lastName: 'Cyrus'
    },
    {
      firstName: 'Kornel',
      lastName: 'Krupa'
    },
    {
      firstName: 'Gerard',
      lastName: 'Marchewka'
    },
    {
      firstName: 'Eliasz',
      lastName: 'Kogutowicz'
    },
    {
      firstName: 'Hubert',
      lastName: 'Wronski'
    },
    {
      firstName: 'Leon',
      lastName: 'Kaniecki'
    },
    {
      firstName: 'Wlodzislaw',
      lastName: 'Brodzik'
    },
    {
      firstName: 'Ireneusz',
      lastName: 'Rafalski'
    },
    {
      firstName: 'Dawid',
      lastName: 'Stanislawski'
    },
    {
      firstName: 'Wit',
      lastName: 'Ras'
    },
    {
      firstName: 'Tadeusz',
      lastName: 'Granat'
    },
    {
      firstName: 'Dariusz',
      lastName: 'Grzesik'
    },
    {
      firstName: 'Iwo',
      lastName: 'Jurek'
    },
    {
      firstName: 'Jaroslaw',
      lastName: 'Lazowski'
    },
    {
      firstName: 'Waldemar',
      lastName: 'Krawiec'
    },
    {
      firstName: 'Romuald',
      lastName: 'Cieslewicz'
    },
    {
      firstName: 'Metody',
      lastName: 'Klos'
    },
    {
      firstName: 'Grzegorz',
      lastName: 'Slimak'
    },
    {
      firstName: 'Wlodzislaw',
      lastName: 'Siwicki'
    },
    {
      firstName: 'Zenobiusz',
      lastName: 'Szafran'
    },
    {
      firstName: 'Fabian',
      lastName: 'Petroski'
    },
    {
      firstName: 'Artur',
      lastName: 'Rowinski'
    },
    {
      firstName: 'Horacy',
      lastName: 'Bara'
    },
    {
      firstName: 'Mieszko',
      lastName: 'Dymek'
    },
    {
      firstName: 'Janusz',
      lastName: 'Bies'
    },
    {
      firstName: 'Tymon',
      lastName: 'Chmielewski'
    },
    {
      firstName: 'Remigiusz',
      lastName: 'Mich'
    },
    {
      firstName: 'Izydor',
      lastName: 'Niestroj'
    },
    {
      firstName: 'Aleksander',
      lastName: 'Madeja'
    },
    {
      firstName: 'Wieslaw',
      lastName: 'Babicz'
    },
    {
      firstName: 'Czeslaw',
      lastName: 'Guzek'
    },
    {
      firstName: 'Oktawiusz',
      lastName: 'Pankowski'
    },
    {
      firstName: 'Waldemar',
      lastName: 'Drag'
    },
    {
      firstName: 'Izajasz',
      lastName: 'Kwiecien'
    },
    {
      firstName: 'Kacper',
      lastName: 'Kukla'
    },
    {
      firstName: 'Iwo',
      lastName: 'Karban'
    },
    {
      firstName: 'Przemek',
      lastName: 'Slomka'
    },
    {
      firstName: 'Bronislaw',
      lastName: 'Kapuscinski'
    },
    {
      firstName: 'Grodzislaw',
      lastName: 'Szczesniak'
    },
    {
      firstName: 'Stefan',
      lastName: 'Sutkowski'
    }
  ],
  Canada: [{
      firstName: 'David',
      lastName: 'Lyle'
    },
    {
      firstName: 'Benjamin',
      lastName: 'Thatcher'
    },
    {
      firstName: 'Avery',
      lastName: 'Irvin'
    },
    {
      firstName: 'Logan',
      lastName: 'Robertson'
    },
    {
      firstName: 'Leo',
      lastName: 'Davis'
    },
    {
      firstName: 'Jayce',
      lastName: 'Bailey'
    },
    {
      firstName: 'Huxley',
      lastName: 'Boyd'
    },
    {
      firstName: 'William',
      lastName: 'Ward'
    },
    {
      firstName: 'Aarav',
      lastName: 'Nelson'
    },
    {
      firstName: 'River',
      lastName: 'White'
    }
  ]
};

const COUNTRY = "Poland";

const formatDateTime = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

function updateStatus(newStatus) {
  console.log(newStatus);
  // process.stdout.clearLine(); // Clear the current line
  // process.stdout.cursorTo(0); // Move the cursor to the beginning of the line
  // process.stdout.write(newStatus);
}

const delay = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

const signup = async (page, emailAddress) => {
  try {
    // Close the cookie consent popup if it appears
    try {
      await page.waitForSelector(
        'div#onetrust-close-btn-container button[aria-label="Close"]', {
          timeout: 10000
        }
      );
      await page.$eval(
        'div#onetrust-close-btn-container button[aria-label="Close"]',
        (el) => el.click()
      );
      updateStatus("Cookie consent popup closed");
    } catch (error) {
      updateStatus("Cookie consent popup not found, proceeding...");
    }

    // Click on 'Work' button
    updateStatus("SignUp State2...");
    await page.screenshot({
      path: "state2.png"
    }); // Add screenshot here
    // await page.waitForSelector('[data-qa="work"]', { timeout: 300000 });
    // await page.$eval('[data-qa="work"]', (el) => el.click());
    await page.waitForSelector('[data-qa="hire"]', {
      timeout: 300000
    });
    await page.$eval('[data-qa="hire"]', (el) => el.click());
    await page.$eval(`button[type="button"][data-qa="btn-apply"]`, (el) =>
      el.click()
    );

    // Get a random index from the array of names for the specified country
    const randomIndex = Math.floor(Math.random() * nameArray[COUNTRY].length);
    // Extract the first name and last name from the selected country
    const {
      firstName,
      lastName
    } = nameArray[COUNTRY][randomIndex];

    // Fill out the signup form
    updateStatus("SignUp State3...");
    await page.waitForSelector("#first-name-input", {
      timeout: 10000
    });
    await page.type("#first-name-input", firstName);
    await page.type("#last-name-input", lastName);
    // await page.type('#first-name-input', 'Higgins');
    // await page.type('#last-name-input', 'Randy');
    await page.type("#redesigned-input-email", emailAddress);
    await page.type("#password-input", PASSWORD);

    // Wait for the country dropdown to appear and select country
    updateStatus("SignUp State4-country...");
    await page.waitForSelector('[aria-labelledby*="select-a-country"]', {
      timeout: 10000,
    });
    await delay(1500);
    await page.$eval('[aria-labelledby*="select-a-country"]', (el) =>
      el.click()
    );
    await page.waitForSelector('[autocomplete="country-name"]');
    await page.type('[autocomplete="country-name"]', COUNTRY);
    await page.$eval('[aria-labelledby="select-a-country"] li', (el) =>
      el.click()
    );
    // Accept terms and conditions
    await delay(500);
    await page.waitForSelector("#checkbox-terms", {
      timeout: 10000
    });
    await page.$eval("#checkbox-terms", (el) => el.click());
    await delay(500);
    await page.waitForSelector("#button-submit-form", {
      timeout: 10000
    });
    await page.$eval("#button-submit-form", (el) => el.click());
    updateStatus("Verify email...");
    await delay(8000);
  } catch (error) {
    updateStatus(`Error in signup: ${error.message}`);
    throw error;
  }
};

const checkConnect = async (page, emailAddress) => {
  try {
    await retry(() =>
      page.goto(
        "https://www.upwork.com/jobs/Website-Designer-and-Developer-Figma-Webflow_~01782f825d88a411b3/?referrer_url_path=%2Fnx%2Fsearch%2Fjobs%2F", {
          waitUntil: "domcontentloaded",
        }
      )
    );
    await page.waitForSelector("div[data-v-614febcf].mt-2", {
      timeout: 60000
    });
    await delay(1500);
    const availableConnects = await page.evaluate(() =>
      document.querySelector("div[data-v-614febcf].mt-2").textContent.trim()
    );
    console.log("test result========>", availableConnects);
    if (availableConnects === "Available Connects: 10") {
      const date = formatDateTime();
      const logEntry = `${date} ${emailAddress}\n`;
      sendSlackMessage(emailAddress);
      try {
        await fs.access(FILENAME);
      } catch (err) {
        await fs.writeFile(FILENAME, "");
      }
      await fs.appendFile(FILENAME, logEntry);
      return true;
    }
    return false;
  } catch (error) {
    updateStatus(`Error in checkConnect: ${error.message}`);
    throw error;
  }
};

const readMail = async (page, emailAddress) => {
  try {
    await delay(10000);

    await page.goto(`https://generator.email/${emailAddress}`, {
      waitUntil: "domcontentloaded",
    });
    for (let i = 0; i < 5; i++) {
      const href = await page.evaluate(() => {
        const aTags = document.querySelectorAll(".button-holder a");
        return aTags.length > 0 ? aTags[0].href : "";
      });
      if (href) return href;
      else {
        updateStatus("Email not found. Retrying...");
        await delay(5000);
      }
    }

    throw new Error("Inbox is empty after multiple retries");
  } catch (error) {
    updateStatus(`Error in readMail: ${error.message}`);
    throw error;
  }
};

const convertFreelancer = async (page, emailAddress) => {
  try {
    await delay(10000);

    await page.goto(`https://www.upwork.com/nx/client/dashboard/`, {
      waitUntil: "domcontentloaded",
    });
    updateStatus("Go to the client dashboard...");

    await delay(10000);

    await page.goto(`https://www.upwork.com/nx/client-info/`, {
      waitUntil: "domcontentloaded",
    });

    updateStatus("Preparing the freelancer...");

    await delay(10000);

    await page.goto(`https://www.upwork.com/freelancers/settings/become-freelancer`, {
      waitUntil: "domcontentloaded",
    });

    updateStatus("Become Freelancer...");

    await page.waitForSelector('[aria-labelledby*="countries"]', {
      timeout: 10000,
    });
    await delay(1500);
    await page.$eval('[aria-labelledby*="countries"]', (el) =>
      el.click()
    );

    updateStatus("Selecting country...");

    //   await page.evaluate((country) => {
    //     const options = Array.from(document.querySelectorAll('li[role="option"]'));
    //     const countryOption = options.find(option => option.innerText.trim() === country);
    //     if (countryOption) {
    //       countryOption.querySelector(':first-child').click();
    //     }
    //   }, COUNTRY);
    await page.waitForSelector('li[role="option"]', {
      timeout: 10000,
    });
    await delay(1500);
    await page.$eval('li[role="option"]', (el) =>
      el.click()
    );

    await page.$eval('button.air3-btn.air3-btn-block-sm.mb-0.air3-btn-primary', (el) => el.click());

  } catch (error) {
    updateStatus(`Error in readMail: ${error.message}`);
    throw error;
  }
}

const randomNumber = () => Math.floor(Math.random() * 10000000);

let browser;
const startScript = async () => {
  while (true) {
    browser = await pt.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--disable-gpu",
        "--window-size=1920x1080",
        "--start-maximized",
        "--disable-infobars",
        "--disable-features=site-per-process",
        "--disable-web-security",
        "--disable-blink-features=AutomationControlled",
        // `--proxy-server=${PROXY_SERVER}`,
      ],
    });

    try {
      const start = performance.now();
      const [page] = await browser.pages();

      // await page.authenticate({
      //   username: PROXY_USERNAME,
      //   password: PROXY_PASSWORD,
      // });

      const userAgent = new UserAgent();
      await page.setUserAgent(userAgent.toString());
      await page.setViewport({
        width: 1366,
        height: 768
      });
      await page.setExtraHTTPHeaders({
        "Accept-Language": "en-US,en;q=0.9",
      });

      await page.evaluateOnNewDocument(() => {
        Object.defineProperty(navigator, "webdriver", {
          get: () => false,
        });
      });
      const emailAddress = `${faker.person.firstName(
        "male"
      )}${faker.person.lastName()}${randomNumber()}@enunal.com`;
      updateStatus(`${formatDateTime()} ${emailAddress}`);
      updateStatus("Preparing upwork signup page...");
      await retry(() =>
        page.goto("https://www.upwork.com/nx/signup/?dest=home", {
          waitUntil: "domcontentloaded",
        })
      );
      await signup(page, emailAddress);
      await delay(2000);
      const verify_link = await readMail(page, emailAddress);
      await retry(() =>
        page.goto(verify_link, {
          waitUntil: "domcontentloaded"
        })
      );

      await delay(2000);

      await convertFreelancer(page, emailAddress);

      await delay(5000);
      const hasConnect = await checkConnect(page, emailAddress);

      updateStatus(
        `${formatDateTime()} ${emailAddress} => ${
          (performance.now() - start) / 1000
        }s : ${
          hasConnect
        }`
      );
      console.log("");
      const delay_time = 5000 + Math.random() * 5000;
      updateStatus(
        `Waiting for next creating account: ${delay_time / 1000}s\n`
      );
      await delay(delay_time);
    } catch (error) {
      updateStatus(`Error occurred: ${error.message}\n`);
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }
};

const retry = async (fn, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      updateStatus(`Retry ${i + 1} failed: ${error.message}`);
      if (i === retries - 1) throw error;
      await delay(5000);
    }
  }
};

// Handle termination signals to close the browser
const handleExit = async (signal) => {
  updateStatus(`Received ${signal}. Closing browser...`);
  if (browser) {
    await browser.close();
  }
  process.exit(0);
};

process.on("SIGINT", handleExit);
process.on("SIGTERM", handleExit);

startScript();