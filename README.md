# Deno Website Resolutions

A Deno util that uses puppeteer to get screenshots of a website in different resolutions

# Running it

Puppeter executable is necessary. Images will be generated inside `screenshots` folder.

## Generating the first screenshots

Generates screenshots of the website for all resolutions

```bash
PUPPETEER_EXECUTABLE_PATH=/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome deno run --allow-read --allow-write --allow-net --allow-env --allow-run --unstable mod.ts https://mywebsite.com --write
```

## Generating diffs

Generates diffs of the domain with the previously stored screenshots

```bash
PUPPETEER_EXECUTABLE_PATH=/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome deno run --allow-read --allow-write --allow-net --allow-env --allow-run --unstable mod.ts https://mywebsite.com
```
