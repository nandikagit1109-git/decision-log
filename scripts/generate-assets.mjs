/**
 * Generates raster assets from the SVG sources so the 1200x630 social preview
 * and the PNG favicon fallback can never drift out of sync with the design.
 *
 * Run: npm run assets
 */
import { readFileSync, writeFileSync } from "node:fs";
import { Resvg } from "@resvg/resvg-js";

const og = new Resvg(readFileSync("public/og.svg", "utf8"), {
  fitTo: { mode: "width", value: 1200 },
});
writeFileSync("public/og-image.png", og.render().asPng());

const icon = new Resvg(readFileSync("public/favicon.svg", "utf8"), {
  fitTo: { mode: "width", value: 32 },
});
writeFileSync("public/favicon-32.png", icon.render().asPng());

console.log("Wrote public/og-image.png (1200x630) and public/favicon-32.png");
