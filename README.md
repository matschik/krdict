# krdict

krdict is an open-source command-line tool that allows users to download, convert, and store Korean-English dictionary data in a MongoDB database. The tool can be used by developers and data scientists who are working with Korean language data.

## Installation

Before installing krdict, ensure that you have Node.js (version 14 or higher) and MongoDB (version 4 or higher) installed on your system.

To install krdict, follow these steps:

1. Clone the krdict repository from GitHub:

```
git clone https://github.com/matschik/krdict.git
```

2. Navigate to the krdict directory:

```
cd krdict
```

3. Install the dependencies using npm / pnpm / yarn:

```
npm install
```

4. Create a .env file with the following variables:

```
MONGO_URL=mongodb://localhost:27017/krdict
```

## Usage

The krdict tool includes four main modules:

- `1_download.js`: downloads Korean-English dictionary data from the [spellcheck-ko/korean-dict-nikl](https://github.com/spellcheck-ko/korean-dict-nikl) repository and saves it to XML files in the `output/1_krdict_xml` directory.
- `2_convert.js`: converts the XML files to JSON files and saves them to the `output/2_krdict_json` directory.
- `3_jsondb.js`: reads the JSON files and stores the data in a MongoDB database.
- `4_mongo.js`: queries the MongoDB database and prints the results to the console.

To use the tool, follow these steps:

1. Download the Korean-English dictionary data by running the `1_download.js` module:

```
node 1_download.js
```

2. Convert the XML files to JSON files by running the `2_convert.js` module:

```
node 2_convert.js
```

3. Store the data in a local JSON file by running the `3_jsondb.js` module:

```
node 3_jsondb.js
```

4. Query the MongoDB database to insert local JSON file objects by running the `4_mongo.js` module:

```
node 4_mongo.js
```

## Directory Structure

```
.
├── 1_download.js     # module to download data from spellcheck-ko/korean-dict-nikl repository
├── 2_convert.js      # module to convert XML files to JSON files
├── 3_jsondb.js       # module to store data in MongoDB database
├── 4_mongo.js        # module to query MongoDB database
├── ndjsonFile.js     # module to read ndjson files
├── node_modules/     # dependencies
├── output/           # directory to store downloaded data and converted data
│   ├── 1_krdict_xml/ # directory to store downloaded XML data
│   ├── 2_krdict_json/# directory to store converted JSON data
│   └── 3_jsondb/     # directory to store data in MongoDB format
├── package.json      # npm package metadata
└── pnpm-lock.yaml    # dependency lockfile
```

## Dependencies

krdict relies on the following dependencies:

- [dotenv](https://www.npmjs.com/package/dotenv) - to load environment variables from a .env file
- [fs-extra](https://www.npmjs.com/package/fs-extra) - to perform file system operations
- [glob](https://www.npmjs.com/package/glob) - to find files using glob patterns
- [got](https://www.npmjs.com/package/got) - to make HTTP requests
- [mongodb](https://www.npmjs.com/package/mongodb) - to interact with MongoDB
- [ndjson](https://www.npmjs.com/package/ndjson) - to read and write ndjson files
- [xml2js](https://www.npmjs.com/package/xml2js) - to parse XML data

All dependencies are specified in the `package.json` file and can be installed using npm.

## Credits

The krdict tool is built on top of the [FOSS Korean dictionary](https://github.com/spellcheck-ko/korean-dict-nikl) by the National Institute of Korean Language. We would like to thank the institute for their valuable contribution to the open-source community.

## ⚖️ License

MIT. Made with 💖
