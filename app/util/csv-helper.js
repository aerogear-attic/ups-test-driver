"use strict";

const csv = require("fast-csv");
const fs = require("fs");

const COLUMN_NAME_ALIAS = "TOKEN ALIAS";

class CSVHelper {

    constructor(csvPath) {
        this.csvPath = csvPath;
    }

    getAliasesFromCSV() {
        return new Promise((resolve, reject) => {
            const stream = fs.createReadStream(this.csvPath);
            const options = {
                // headers: ["variantId", "alias", "token"],
                // renameHeaders: true
                headers: true
            };
            const aliases = [];
            const csvStream = csv
                .parse(options)
                // .on("data", row => aliases.push(row.alias))
                .on("data", row => aliases.push(row[COLUMN_NAME_ALIAS]))
                .on("error", err => reject(err))
                .on("end", () => resolve(aliases));

            stream.pipe(csvStream);
        });
    }

}

module.exports = CSVHelper;
