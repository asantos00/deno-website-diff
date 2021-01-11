import { parse } from "https://deno.land/std@0.83.0/flags/mod.ts";

import puppeteer from "https://deno.land/x/puppeteer@5.5.1/mod.ts";
import pixelmatch from "https://jspm.dev/pixelmatch";
import { PNG } from "https://jspm.dev/pngjs";

async function parsePNG(buffer: Uint8Array): Promise<{ data: Uint8Array }> {
  return new Promise((resolve, reject) => {
    //@ts-ignore
    new PNG().parse(buffer, async (err: Error, image: any) => {
      if (err) {
        return reject(err);
      }

      resolve(image);
    });
  });
}

enum Resolutions {
  Mobile = "Mobile",
  Tablet = "Tablet",
  Desktop = "Desktop",
}

type Resolution = { width: number; height: number };

const resolutions: Record<Resolutions, Resolution> = {
  [Resolutions.Mobile]: { width: 360, height: 640 },
  [Resolutions.Tablet]: { width: 1024, height: 640 },
  [Resolutions.Desktop]: { width: 1920, height: 1090 },
};

const args = parse(Deno.args);
const website = args._[0] as string;
const isWrite = args.write;

if (!website) {
  throw new Error("You need to provide a website to get pdfs from");
}

Object.keys(Resolutions).forEach(async (name) => {
  // @ts-ignore
  const { height, width } = resolutions[name] as Resolution;

  await getPdf(name, { height, width });
});

async function getPdf(
  name: string,
  viewPort: { width: number; height: number },
) {
  const browser = await puppeteer.launch({
    defaultViewport: viewPort,
  });
  const page = await browser.newPage();
  await page.goto(website, {
    waitUntil: "networkidle2",
  });

  console.log(`Getting screenshot for ${website} on ${name}`);

  const [domain] = website.replace(/(^\w+:|^)\/\//, "").split(".");

  await page.waitForTimeout(5000);

  const diff = new PNG(viewPort);

  const screenshotPath = `./screenshots/${domain}-${name}.png`;
  const screenshot = await page.screenshot({ path: screenshotPath });

  if (!isWrite) {
    const screenshot = await page.screenshot();
    const newImage = await parsePNG(screenshot as Uint8Array);

    const oldImage = await parsePNG(await Deno.readFile(screenshotPath));

    //@ts-ignore
    pixelmatch(
      newImage.data,
      oldImage.data,
      diff.data,
      viewPort.width,
      viewPort.height,
      { threshold: 0.5 },
    );

    //@ts-ignore
    const buffer = PNG.sync.write(diff);
    await Deno.writeFile(
      `./screenshots/diff-${domain}-${name}.png`,
      buffer,
      { create: true },
    );
  }

  await browser.close();
}
