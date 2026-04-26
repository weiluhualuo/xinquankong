import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const decoder = new TextDecoder("utf-8", { fatal: true });
const root = process.cwd();
const scanRoots = ["app", "components", "lib"];
const configFiles = [
  "package.json",
  "tsconfig.json",
  "tsconfig.base.json",
  "next.config.mjs",
  "postcss.config.js",
  "tailwind.config.ts",
  "netlify.toml",
  ".env.example"
];
const textExtensions = new Set([".ts", ".tsx", ".js", ".jsx", ".json", ".mjs", ".css", ".toml"]);

function assertUtf8NoBom(filePath) {
  const buffer = readFileSync(filePath);
  if (buffer.length >= 3 && buffer[0] === 0xef && buffer[1] === 0xbb && buffer[2] === 0xbf) {
    throw new Error(`BOM detected: ${filePath}`);
  }

  decoder.decode(buffer);
}

function walk(dirPath) {
  for (const entry of readdirSync(dirPath)) {
    const absolute = join(dirPath, entry);
    const stats = statSync(absolute);
    if (stats.isDirectory()) {
      walk(absolute);
      continue;
    }

    if (textExtensions.has(extname(absolute))) {
      assertUtf8NoBom(absolute);
    }
  }
}

try {
  for (const relativeDir of scanRoots) {
    walk(join(root, relativeDir));
  }

  for (const file of configFiles) {
    assertUtf8NoBom(join(root, file));
  }

  console.log("UTF-8 verification passed.");
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}