"use strict";

const adminClient = require("unifiedpush-admin-client");
const senderClient = require("unifiedpush-node-sender");
const Notification = require("../model/notification");
const Message = require("../model/message");
const Options = require("../model/options");

/**
 * Helper class that encapsulates all requests to UPS
 */
class UPSAPI {

    constructor(args) {
        this.endPoint = args.endPoint;
        this.username = args.username;
        this.password = args.password;
        this.pushApplicationID = args.pushApplicationID;
        this.masterSecret = args.masterSecret;
    }

    getApplications() {
        return this.getAdminClient()
            .then(client => client.applications.find());
    }

    getAdminClient() {
        const settings = {
            username: this.username,
            password: this.password
        };

        return adminClient(this.endPoint, settings);
    }

    sendNotificationToAllDevicesOfApp(app) {
        const message = new Message(`Hello ${app.name} from ups-test-driver!`);
        const options = new Options();

        return this.getSenderClient()
            .then(client => client.sender.send(message, options));
    }

    getSenderClient() {
        const settings = {
            url: this.endPoint,
            applicationId: this.pushApplicationID,
            masterSecret: this.masterSecret
        };

        return senderClient(settings);
    }

    sendNotificationToAlias(alias) {
        if (!alias || typeof alias !== "string") {
            throw new Error("Wrong arguments: alias must be a String");
        }

        const notification = Notification.withAlias(alias);

        return this.getSenderClient()
            .then(client => client.sender.send(notification.message, notification.options));
    }

    sendNotificationToAliasesUsingBatchFeature(aliases) {
        if (!aliases || !Array.isArray(aliases)) {
            throw new Error("Wrong arguments: aliases must be an Array");
        }

        const notifications = aliases.map(alias => Notification.withAlias(alias));

        return this.getSenderClient()
            .then(client => client.sender.sendBatch(notifications));
    }

}

module.exports = UPSAPI;
