"use strict";

const UPSAPI = require("../service/ups-api");

class TestRunner {

    constructor(args) {
        this.delay = args.delay;
        this.upsapi = new UPSAPI(args);
    }

    start() {
    }

}

module.exports = TestRunner;
