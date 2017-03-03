"use strict";

const async = require("async");
const TestRunnerApp = require("../model/test-runner-app");
const UPSAPI = require("../service/ups-api");
const CSVHelper = require("./csv-helper");

class TestRunnerController {

    constructor(args, testRunners) {
        this.args = args;
        this.testRunners = testRunners;
    }

    start() {
        if (this.testRunners[0] instanceof TestRunnerApp) {
            return this.startTestRunnersWithApps();
        } else {
            return this.startTestRunnersWithCSV();
        }
    }

    startTestRunnersWithApps() {
        return this.getApplications()
            .then(apps => this.startTestRunnersAsync(apps));
    }

    getApplications() {
        return new UPSAPI(this.args).getApplications();
    }

    startTestRunnersWithCSV() {
        return this.getAliasesFromCSV()
            .then(aliases => this.startTestRunnersAsync(aliases));
    }

    getAliasesFromCSV() {
        return new CSVHelper(this.args.csv).getAliasesFromCSV();
    }

    startTestRunnersAsync(objects) {
        async.each(this.testRunners, testRunner => testRunner.start(objects));
    }

}

module.exports = TestRunnerController;
