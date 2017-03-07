"use strict";

const CommandLineParserBuilder = require("../../app/util/command-line-parser-builder");

describe("CommandLineParserBuilder", () => {

    describe(".checkArguments", () => {

        const args = {};
        const checkArguments = () => CommandLineParserBuilder.checkArguments(args);

        beforeEach(() => {
            args.username = undefined;
            args.password = undefined;
            args.csv = undefined;
            args.pushApplicationID = undefined;
            args.masterSecret = undefined;
            args.delay = "1000";
            args.instances = "1";
            args.batchMode = false;
            args.endPoint = "http:foo";
        });

        // Delay

        it("should pass if delay is a positive integer", () => {
            args.delay = "1";

            expect(checkArguments).toBeTruthy();
        });

        it("should throw if delay is a negative integer", () => {
            args.delay = "-1";

            expect(checkArguments).toThrowError("Delay (-d) must be a positive integer");
        });

        it("should throw if delay is 0", () => {
            args.delay = "0";

            expect(checkArguments).toThrowError("Delay (-d) must be a positive integer");
        });

        it("should throw if delay is not an integer", () => {
            args.delay = "foo";

            expect(checkArguments).toThrowError("Delay (-d) must be a positive integer");
        });

        // Instance

        it("should pass if instances is a positive integer", () => {
            args.instances = "1";

            expect(checkArguments).toBeTruthy();
        });

        it("should throw if instances is a negative integer", () => {
            args.instances = "-1";

            expect(checkArguments).toThrowError("Instances (-i) must be a positive integer");
        });

        it("should throw if instances is 0", () => {
            args.instances = "0";

            expect(checkArguments).toThrowError("Instances (-i) must be a positive integer");
        });

        it("should throw if instances is not an integer", () => {
            args.instances = "foo";

            expect(checkArguments).toThrowError("Instances (-i) must be a positive integer");
        });

        // User credentials / App credentials

        it("should pass if username and password are provided", () => {
            args.username = "user";
            args.password = "pass";

            expect(checkArguments).toBeTruthy();
        });

        it("should throw if username and password are not provided together", () => {
            args.username = "user";
            args.password = undefined;

            expect(checkArguments).toThrowError("If username is provided, a password is also needed");

            args.username = undefined;
            args.password = "pass";

            expect(checkArguments).toThrowError("If username is provided, a password is also needed");
        });

        it("should throw if user credentials are provided with csv", () => {
            args.username = "user";
            args.password = "pass";
            args.csv = "path";

            expect(checkArguments).toThrowError("Don't provide user credentials alongside csv, pushApplicationID, masterSecret or batchMode");
        });

        it("should throw if user credentials are provided with pushApplicationID", () => {
            args.username = "user";
            args.password = "pass";
            args.pushApplicationID = "foo";

            expect(checkArguments).toThrowError("Don't provide user credentials alongside csv, pushApplicationID, masterSecret or batchMode");
        });

        it("should throw if user credentials are provided with masterSecret", () => {
            args.username = "user";
            args.password = "pass";
            args.masterSecret = "foo";

            expect(checkArguments).toThrowError("Don't provide user credentials alongside csv, pushApplicationID, masterSecret or batchMode");
        });

        it("should throw if user credentials are provided with batchMode enabled", () => {
            args.username = "user";
            args.password = "pass";
            args.batchMode = "true";

            expect(checkArguments).toThrowError("Don't provide user credentials alongside csv, pushApplicationID, masterSecret or batchMode");

            args.batchMode = "false";

            expect(checkArguments).toBeTruthy();
        });

        it("should pass if pushApplicationID, masterSecret and csv are provided", () => {
            args.pushApplicationID = "id";
            args.masterSecret = "secret";
            args.csv = "path";

            expect(checkArguments).toBeTruthy();
        });

        it("should throw if pushApplicationID, masterSecret and csv are not provided together", () => {
            args.pushApplicationID = "id";
            args.masterSecret = undefined;
            args.csv = undefined;

            expect(checkArguments).toThrowError("csv, pushApplicationID and masterSecret are to be provided together");

            args.pushApplicationID = undefined;
            args.masterSecret = "secret";
            args.csv = undefined;

            expect(checkArguments).toThrowError("csv, pushApplicationID and masterSecret are to be provided together");

            args.pushApplicationID = undefined;
            args.masterSecret = undefined;
            args.csv = "path";

            expect(checkArguments).toThrowError("csv, pushApplicationID and masterSecret are to be provided together");
        });

    });

});
