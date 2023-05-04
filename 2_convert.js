import xml2js from "xml2js";
import { promisify } from "node:util";
import { readFile } from "node:fs/promises";
import { pathExists, writeJSON, ensureDir } from "fs-extra/esm";
import { glob } from "glob";
import path from "node:path";

const XML_FILES_DIR = "output/1_krdict_xml";
const DEST_DIR = "output/2_krdict_json";

async function main() {
  await ensureDir(DEST_DIR);
  const files = await glob(`${XML_FILES_DIR}/*.xml`);

  for (const file of files) {
    const dest = `${DEST_DIR}/${path.parse(file).name}.json`;

    if (await pathExists(dest)) {
      console.log(dest, "already exists");
      continue;
    }

    console.log(dest, "start");
    let content = await readFile(file, { encoding: "utf-8" });

    // fix invalid xml
    content = content.replace(`val="&"`, `val=""`);

    try {
      const strangeJson = await parseXML(content);
      const json = strangeJsonToJson(strangeJson);
      await writeJSON(dest, json, {
        spaces: 2,
      });
      console.log(dest, "success");
    } catch (err) {
      console.log(dest, "error");
      console.error(err);
    }
  }
}

main().catch(console.error);

const parseXML = promisify(xml2js.parseString);

function strangeJsonToJson(strangeJson) {
  const newJson = {};

  function processNode(o, newo) {
    for (const key in o) {
      if (key === "$" || key === "feat") {
        continue;
      }

      let value = o[key];

      if (Array.isArray(value)) {
        newo[key] = value.map((v) => {
          const newv = {};
          processNode(v, newv);
          return newv;
        });
      }

      if (value["$"]) {
        newo[key] = {};
        const att = value["$"]["att"];
        if (att) {
          newo[key][att] = value["$"]["val"];
        } else {
          newo[key] = value["$"];
        }
      }

      if (value["feat"]) {
        if (!newo[key]) {
          newo[key] = {};
        }
        for (const feat of value["feat"]) {
          const { att, val } = feat["$"];
          newo[key][att] = val;
        }
      }

      if (typeof value === "object" && value !== null) {
        processNode(value, newo[key]);
      }
    }
  }

  processNode(strangeJson, newJson);
  return newJson;
}
