"use strict";

const Message = require("./message");
const Options = require("./options");

class Notification {

    constructor(message, options) {
        this.message = message || new Message(`Testing!!`);
        this.options = options || new Options();
    }

    static withAlias(alias) {
        const message = new Message(`Hello ${alias} from ups-test-driver!`);
        const options = new Options();
        options.alias = alias;

        return new Notification(message, options);
    }

}

module.exports = Notification;
