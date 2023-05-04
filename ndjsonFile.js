import { createReadStream } from "node:fs";
import { access, appendFile, writeFile } from "node:fs/promises";
import ndjson from "ndjson";
import { promisify } from "node:util";
import stream from "node:stream";
import { createInterface } from "node:readline";

const pipeline = promisify(stream.pipeline);

export default function ndjsonFile(path) {
  return {
    async write(line) {
      if (!(await pathExists(path))) {
        await writeFile(path, "");
      }

      await appendFile(path, line + "\n");
    },
    async writeJSON(o) {
      return this.write(JSON.stringify(o));
    },
    async readByLine(onLine) {
      const readable = createReadStream(path);
      await pipeline(readable, ndjson.parse(), async (source) => {
        for await (const feature of source) {
          const canEnd = await onLine(feature);
          if (canEnd) {
            readable.destroy();
            break;
          }
        }
      });
    },
    async readByLineBatch(onBatch, batchSize = 100) {
      const readable = createReadStream(path);
      let batch = [];
      let canEndGlobal = false;
      await pipeline(readable, ndjson.parse(), async (source) => {
        for await (const feature of source) {
          batch.push(feature);
          if (batch.length >= batchSize) {
            const canEnd = await onBatch(batch);
            if (canEnd) {
              canEndGlobal = true;
              readable.destroy();
              break;
            }
            batch = [];
          }
        }
      });

      if (batch.length > 0 && !canEndGlobal) {
        await onBatch(batch);
      }
    },
    async find(attribute, value) {
      let found;
      await this.readByLine((line) => {
        if (line[attribute] === value) {
          found = line;
          return true;
        }
        return false;
      });
      return found;
    },
    async count() {
      const rl = createInterface({
        input: createReadStream(path),
        crlfDelay: Infinity,
      });

      let lineCount = 0;

      for await (const _line of rl) {
        lineCount++;
      }

      return lineCount;
    },
  };
}

async function pathExists(path) {
  try {
    await access(path);
    return true;
  } catch (error) {
    if (error.code === "ENOENT") {
      return false;
    } else {
      throw error;
    }
  }
}
