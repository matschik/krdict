import { readJSON, remove, ensureDir } from "fs-extra/esm";
import ndjsonFile from "./ndjsonFile.js";
import { glob } from "glob";

const KRDICT_JSON_FILES_DIR = "output/2_krdict_json";
const LOCAL_DB_DIR = "output/3_jsondb";
const LOCAL_DB_PATH = `${LOCAL_DB_DIR}/krdict.jsonl`;

async function createKrDictDbFromJsonFiles() {
  await ensureDir(LOCAL_DB_DIR);
  const db = ndjsonFile(LOCAL_DB_PATH);
  await remove(LOCAL_DB_PATH);
  const jsonFilePaths = await glob(`${KRDICT_JSON_FILES_DIR}/*.json`);

  for (const jsonPath of jsonFilePaths) {
    const data = await readJSON(jsonPath);
    const words = data.LexicalResource.Lexicon[0].LexicalEntry;

    for (const word of words) {
      await db.writeJSON(word);
    }
  }
}

createKrDictDbFromJsonFiles();
