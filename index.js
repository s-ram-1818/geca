const axios = require("axios");
const cheerio = require("cheerio");
const cron = require("node-cron");
const fs = require("fs");
const nodemailer = require("nodemailer");

const url = "https://geca.ac.in/";
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "ramsarwade1818@gmail.com",
    pass: "thjn vlud abqh fupo", // Replace with the App Password
  },
});
let x = [];

const mails = ["shamsarwade1818@gmail.com", "shamsarwade431515@gmail.com"];

async function checkForNewNews() {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    // Select all news items

    const newsItems = [];
    
    $("ul.scrollNews li a").each((i, el) => {
      const title = $(el).text().trim();
      const href = $(el).attr("href").trim();
      const fullLink = new URL(href, url).href;
      newsItems.push({ title, link: fullLink });
    });

    const oldLinks = new Set(x.map((item) => item.link));

    const newNews = newsItems.filter((item) => !oldLinks.has(item.link));

    if (newNews.length > 0) {
      const mailOptions = {
        from: "ramsarwade1818@gmail.com",
        to: mails,
        subject: "GECA News Update ",
        text: `latest news ${newsItems[0].title}\nLink: ${newsItems[0].link}`,
      };
      await transporter.sendMail(mailOptions);
      x = newsItems;
    } else {
      console.log("No new news.");
    }
  } catch (error) {
    console.error("Error fetching news:", error);
    return [];
  }
}

// Run once or on schedule
async function runScraper() {
  await checkForNewNews();

  // Wait 10 seconds after completion
  setTimeout(runScraper, 10000);
}

runScraper();
