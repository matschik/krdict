import "dotenv/config";
import { MongoClient } from "mongodb";
import ndjsonFile from "./ndjsonFile.js";

const LOCAL_DB_PATH = "output/3_jsondb/krdict.jsonl";
const dbName = process.env.MONGO_DBNAME || "krdict";
const dbCollectionName = process.env.MONGO_COLLECTION || "lexicalEntry";

const client = new MongoClient(process.env.MONGO_URL);

async function main() {
  const localDb = ndjsonFile(LOCAL_DB_PATH);
  await client.connect();
  console.info("Connected successfully to Mongo server");
  const db = client.db(dbName);
  const collection = db.collection(dbCollectionName);

  await collection.deleteMany({});

  const localDbCount = await localDb.count();

  let c = 0;
  await localDb.readByLineBatch(async (batch) => {
    await collection.insertMany(batch);
    c += batch.length;
    console.info(c, `/${localDbCount}`, "inserted");
  }, 500);

  console.info(
    `Inserted ${c} documents into the collection '${dbCollectionName}' in db '${dbName}'`
  );

  const count = await collection.countDocuments();
  console.info(
    `Collection '${dbCollectionName}' in db '${dbName}' has now ${count} documents`
  );
}

main()
  .catch(console.error)
  .finally(() => client.close());
