"use strict";

const TestRunnerApp = require("../model/test-runner-app");
const TestRunnerAlias = require("../model/test-runner-alias-single");
const TestRunnerAliasBatch = require("../model/test-runner-alias-batch");

class TestRunnerBuilder {

    constructor(args) {
        this.args = args;
    }

    buildTestRunners() {
        const testRunnerType = this.getTestRunnerType(this.args);

        const testRunners = [];

        for (let i = 0; i < this.args.instances; i++) {
            testRunners[i] = new testRunnerType(this.args);
        }

        return testRunners;
    }

    getTestRunnerType() {
        if (this.args.batchMode) {
            return TestRunnerAliasBatch;
        } else if (this.args.csv) {
            return TestRunnerAlias;
        } else {
            return TestRunnerApp;
        }
    }

}

module.exports = TestRunnerBuilder;
