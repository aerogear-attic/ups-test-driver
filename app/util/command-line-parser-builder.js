"use strict";

const args = require("yargs");

const DEFAULT_DELAY = 1000;
const DEFAULT_INSTANCES = 1;
const DEFAULT_ENDPOINT = "http://localhost:8080/ag-push";

class CommandLineParserBuilder {
    static buildCommandLineParser() {
        return args
            .usage("Usage: node index.js [[user credentials] | [app credentials]] [options]")
            .example("$0 -u admin -p 123", "")
            .example("$0 -u admin -p 123 -e http://localhost:8080/ag-push", "")
            .example("$0 -a 123abc456def -m secret -c ./devices.csv", "")
            .example("$0 -a 123abc456def -m secret -c ./devices.csv -d 2000 -i 10", "")

            .alias("u", "username")
            .nargs("u", 1)
            .describe("u", "Aerogear account username")

            .alias("p", "password")
            .nargs("p", 1)
            .describe("p", "Aerogear account password")

            .alias("e", "endPoint")
            .nargs("e", 1)
            .default("e", DEFAULT_ENDPOINT)
            .describe("e", "The UPS instance url")

            .alias("a", "pushApplicationID")
            .nargs("a", 1)
            .describe("a", "The target applications' pushApplicationID")

            .alias("m", "masterSecret")
            .nargs("m", 1)
            .describe("m", "The target applications' masterSecret")

            .alias("c", "csv")
            .nargs("c", 1)
            .describe("c", "The path to the CSV path containing the alias in format 'variantId;alias;tokenId'")

            .alias("d", "delay")
            .nargs("d", 1)
            .default("d", DEFAULT_DELAY)
            .describe("d", "The delay between each request")

            .alias("i", "instances")
            .nargs("i", 1)
            .default("i", DEFAULT_INSTANCES)
            .describe("i", "How many test runners will be instantiated simultaneously")

            .alias("b", "batchMode")
            .boolean("b")
            .default("b", false)
            .describe("b", "Whether or not the notifications will be sent using the 'batch' feature. Incompatible with --chunkSize option.")

            .check(this.checkArguments)

            .help("h")
            .alias("h", "help")
            .argv;
    }

    static checkArguments(args) {
        if (!parseInt(args.delay) || parseInt(args.delay) <= 0) {
            throw new Error("Delay (-d) must be a positive integer");
        }

        if (!parseInt(args.instances) || parseInt(args.instances) <= 0) {
            throw new Error("Instances (-i) must be a positive integer");
        }

        if (!parseInt(args.instances) || parseInt(args.instances) <= 0) {
            throw new Error("Instances (-i) must be a positive integer");
        }

        if (args.username && !args.password
            || !args.username && args.password) {
            throw new Error("If username is provided, a password is also needed");
        }

        if (args.username && args.password) {
            if (args.csv || args.pushApplicationID || args.masterSecret || args.batchMode) {
                throw new Error("Don't provide user credentials alongside csv, pushApplicationID, masterSecret or batchMode");
            } else {
                return true;
            }
        }

        if (!(args.csv && args.pushApplicationID && args.masterSecret)) {
            throw new Error("csv, pushApplicationID and masterSecret are to be provided together");
        }

        return true;
    }
}

module.exports = CommandLineParserBuilder;
