import got from "got";
import stream from "node:stream";
import { promisify } from "node:util";
import { pathExists } from "fs-extra/esm";
import { createWriteStream } from "node:fs";
import { ensureDir } from "fs-extra/esm";

const DOWNLOADS_DIR = "output/1_krdict_xml";

async function main() {
  await ensureDir(DOWNLOADS_DIR);
  const files = await getXMLFileList();

  for (const file of files) {
    const dest = `${DOWNLOADS_DIR}/${file.name}`;

    if (await pathExists(dest)) {
      console.log(dest, "already exists");
      continue;
    }

    console.log(dest, "start");
    try {
      await downloadFile(file.download_url, dest);
      console.log(dest, "success");
    } catch (err) {
      console.log(dest, "error");
      console.error(err);
    }
  }
}

main().catch(console.error);

const pipeline = promisify(stream.pipeline);

async function getXMLFileList() {
  const files = await got
    .get(
      "https://api.github.com/repos/spellcheck-ko/korean-dict-nikl/contents/krdict",
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
        },
      }
    )
    .json();

  return files.filter((file) => file.name.endsWith(".xml"));
}

async function downloadFile(downloadUrl, path) {
  await pipeline(got.stream(downloadUrl), createWriteStream(path));
  return path;
}
