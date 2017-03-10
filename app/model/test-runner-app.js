"use strict";

const TestRunner = require("./test-runner");
const forEachAsyncWithInterval = require("../util/for-each-async-interval");

class TestRunnerApp extends TestRunner {

    constructor(args) {
        super(args);
    }

    start(apps) {
        super.start();

        const startTime = Date.now();
        console.log(`Sending notifications to ${apps.length} apps with an interval of ${this.delay} ms.`);

        forEachAsyncWithInterval(apps, app => {
            console.log(`Sending message to all devices of "${app.name}" [${app.pushApplicationID}] after ${Date.now() - startTime}`);
            this.upsapi.sendNotificationToApp(app)
                .then(res => console.log(`[${app.name}] RESPONSE: ${res}`))
                .catch(err => console.log(`[${app.name}] ERROR: ${err}`));
        }, this.delay);
    }
}

module.exports = TestRunnerApp;
