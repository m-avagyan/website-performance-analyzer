import lighthouse from 'lighthouse';
import { launch } from 'chrome-launcher';
import fs from 'fs';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import fetch from 'node-fetch';

if (!globalThis.fetch) {
    globalThis.fetch = fetch;
}

const argv = yargs(hideBin(process.argv))
    .usage('Usage: $0 -u [url]')
    .option('url', {
        alias: 'u',
        describe: 'URL to analyze with Lighthouse',
        type: 'string',
        demandOption: 'URL is required',
        nargs: 1,
    })
    .version('version', 'Display version information', '1.0.0')
    .alias('v', 'version')
    .help('h')
    .alias('h', 'help').argv;

async function run(url) {
    try {
        const chrome = await launch({ chromeFlags: ['--headless'] });
        const options = {
            logLevel: 'info',
            output: 'html',
            onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
            port: chrome.port,
        };

        const result = await lighthouse(url, options);

        console.info('Report is done for', result.lhr.finalUrl);
        console.info('Performance score was', result.lhr.categories.performance.score * 100);

        await chrome.kill();
        fs.writeFileSync('report.html', result.report);

        console.info('Lighthouse report is saved as report.html');
    } catch (error) {
        console.error('Error running Lighthouse:', error);
        process.exit(1);
    }
}

run(argv.url);
