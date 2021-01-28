import { parse } from "https://deno.land/std@0.83.0/flags/mod.ts";

import puppeteer from "https://deno.land/x/puppeteer@5.5.1/mod.ts";
import "https://deno.land/x/dotenv/load.ts";
import { ensureDir } from "https://deno.land/std@0.83.0/fs/ensure_dir.ts";
import pixelmatch from "https://jspm.dev/pixelmatch";
import { PNG } from "https://jspm.dev/pngjs";

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

// deno-lint-ignore require-await
async function parsePNG(buffer: Uint8Array): Promise<{ data: Uint8Array }> {
  return new Promise((resolve, reject) => {
    //@ts-ignore
    // deno-lint-ignore require-await
    new PNG().parse(buffer, async (err: Error, image: any) => {
      if (err) {
        return reject(err);
      }

      resolve(image);
    });
  });
}

async function analyseWebsite(
  website: string,
  name: string,
  viewPort: { width: number; height: number },
  isDiff: boolean,
) {
  const browser = await puppeteer.launch({
    defaultViewport: viewPort,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  try {
    const page = await browser.newPage();
    await page.goto(website, {
      waitUntil: "networkidle2",
    });

    console.log(`Getting screenshot for ${website} on ${name}`);

    const [domain] = website.replace(/(^\w+:|^)\/\//, "").split(".");

    const screenshotBasePath = Deno.env.get("WEB_RES_SCREENSHOT_BASE_PATH");
    await ensureDir(screenshotBasePath || "./");

    const screenshotPath = `${screenshotBasePath}/${domain}-${name}.png`;

    if (isDiff) {
      const screenshot = await page.screenshot();
      const newImage = await parsePNG(screenshot as Uint8Array);
      const oldImage = await parsePNG(await Deno.readFile(screenshotPath));
      const diff = new PNG(viewPort);

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
        `${screenshotBasePath}/diff-${domain}-${name}.png`,
        buffer,
        { create: true },
      );
    } else {
      await page.screenshot({ path: screenshotPath });
    }
  } catch (e) {
    console.log(e);
  } finally {
    await browser.close();
  }
}

function run() {
  const args = parse(Deno.args);
  const website = args._[0] as string;
  const isDiff = args.diff;

  if (!website) {
    throw new Error("You need to provide a website to get pdfs from");
  }

  Object.keys(Resolutions).forEach(async (name) => {
    // @ts-ignore
    const { height, width } = resolutions[name] as Resolution;
    await analyseWebsite(website, name, { height, width }, isDiff);
  });
}

run();
