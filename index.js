import lighthouse from 'lighthouse';
import { launch } from 'chrome-launcher';
import fs from 'fs';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import fetch from 'node-fetch';
import { mkdirp } from 'mkdirp';

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
    .option('categories', {
        alias: 'c',
        describe: 'Categories to analyze (comma-separated, no spaces)',
        type: 'string',
        default: 'performance,accessibility,best-practices,seo',
    })
    .option('format', {
        alias: 'f',
        describe: 'Report format',
        choices: ['html', 'json'],
        default: 'html',
    })
    .version('version', 'Display version information', '1.0.0')
    .alias('v', 'version')
    .help('h')
    .alias('h', 'help').argv;

function log(message, level = 'info') {
    console[level](message);
}

async function run(url, categories, format) {
    const dir = `results/${new Date().toISOString()}`;
    await mkdirp(dir);

    const chrome = await launch({ chromeFlags: ['--headless'] });
    const options = {
        logLevel: 'info',
        output: format,
        onlyCategories: categories.split(','),
        port: chrome.port,
    };

    try {
        const result = await lighthouse(url, options);
        const file = `${dir}/report.${format}`;

        fs.writeFileSync(file, result.report);

        log(`Report is done for ${result.lhr.finalUrl}`);
        log(`Performance score was ${result.lhr.categories.performance.score * 100}`);
        log(`Report saved as ${reportFilePath}`);
    } catch (error) {
        log('Error running Analyzer: ' + error, 'error');
    } finally {
        await chrome.kill();
    }
}

run(argv.url, argv.categories, argv.format).catch((error) => {
    log('Failed to run Analyzer: ' + error, 'error');

    process.exit(1);
});
