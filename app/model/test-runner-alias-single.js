"use strict";

const TestRunner = require("./test-runner");
const forEachAsyncWithInterval = require("../util/for-each-async-interval");

class TestRunnerAliasSingle extends TestRunner {

    constructor(args) {
        super(args);
    }

    start(aliases) {
        super.start();

        const startTime = Date.now();
        console.log(`Sending notifications to ${aliases.length} alias, one request per alias with an interval of ${this.delay} ms.`);

        forEachAsyncWithInterval(aliases, alias => {
            console.log(`Sending notification to ${alias} after ${Date.now() - startTime} ms.`);
            this.upsapi.sendNotificationToAlias(alias)
                .then(res => console.log(`[${alias}] RESPONSE: ${res}`))
                .catch(err => console.log(`[${alias}] ERROR: ${err}`));
        }, this.delay);
    }
}

module.exports = TestRunnerAliasSingle;
