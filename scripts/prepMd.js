import fs, { renameSync, rmSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * rename _docs/api/README.md to _docs/api/index.md
 */
const renameMd = (dir) => {
  fs.readdirSync(dir).forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      renameMd(filePath);
    } else {
      if (file === "README.md") {
        const newPath = path.join(dir, "index.md");
        fs.renameSync(filePath, newPath);
      }
    }
  });
};

/**
 * Function to rename all markdown links from README.md to index.md
 */
const renameLinks = (dir) => {
  fs.readdirSync(dir).forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      renameLinks(filePath);
    } else {
      if (file.endsWith(".md")) {
        const content = fs.readFileSync(filePath, "utf-8");
        const r1 = content.replace(/\.\/\.\.\/README\.md/gm, "./../index.md");
        const r2 = r1.replace(/\.\/README\.md/gm, "./index.md");
        const r3 = r2.replace(/\.\/README/gm, "./index");
        const r4 = r3.replace(
          /enums\/DateSearchModes\.md/gm,
          "dateSearchModes.md"
        );
        const r5 = r4.replace(/\.\/README.html/gm, "/");
        fs.writeFileSync(filePath, r5, "utf-8");
      }
    }
  });
};

// move _docs/api/enums/DateSearchModes.md to _docs/api/DateSearchModes.md
// make directory _docs/api/dateSearchModes
renameSync(
  path.resolve(__dirname, "../_docs/api/enums/DateSearchModes.md"),
  path.resolve(__dirname, "../_docs/api/dateSearchModes.md")
);
rmSync(path.resolve(__dirname, "../_docs/api/enums/"), {
  recursive: true,
  force: true,
});

renameMd(path.resolve(__dirname, "../_docs/api"));
renameLinks(path.resolve(__dirname, "../_docs/api"));
