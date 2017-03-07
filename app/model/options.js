"use strict";

const Criteria = require("./criteria");
const Config = require("./config");

class Options {
    constructor() {
        this.config = new Config();
        this.criteria = new Criteria();
    }

    get alias() {
        return this.criteria.alias[0];
    }

    set alias(alias) {
        this.criteria.alias[0] = alias;
    }
}

module.exports = Options;
