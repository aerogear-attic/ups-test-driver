"use strict";

const TestRunner = require("./test-runner");

class TestRunnerAliasBatch extends TestRunner {

    constructor(args) {
        super(args);
    }

    start(aliases) {
        super.start();

        console.log(`Sending notification to ${aliases.length} aliases in a single batch`);

        this.upsapi.sendNotificationToAliasesUsingBatchFeature(aliases)
            .then(res => console.log(`RESPONSE: ${res.statusCode} - ${res.body.error || res.body}`))
            .catch(err => console.log(`ERROR: ${err}`));
    }
}

module.exports = TestRunnerAliasBatch;
