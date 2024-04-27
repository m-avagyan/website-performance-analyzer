## Website Performance Analyzer 🚀

A NodeJS script for analyzing the website performance using lighthouse.

---

### Getting Started

Installation

-   `git clone https://github.com/m-avagyan/website-performance-analyzer.git`
-   `cd website-performance-analyzer`
-   `nvm use`
-   `npm install`

Execution

-   `npm run analyze -- -u <URL> -c <CATEGORIES> -f <FORMAT>` - generating a new report for your website

Command Line Options

-  `-u, --url <URL>`: Specifies the URL of the website to analyze. (Required)
-  `-c, --categories <CATEGORIES>`: Defines the categories to analyze, separated by commas. Available categories include performance, accessibility, best-practices, and seo. (Optional, default: all categories)
-  `-f, --format <FORMAT>`: Sets the output format of the report. Options are html or json. (Optional, default: html)

---

### License

[MIT](https://choosealicense.com/licenses/mit/)
