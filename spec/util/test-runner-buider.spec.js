"use strict";

const TestRunnerBuilder = require("../../app/util/test-runner-builder");
const TestRunnerApp = require("../../app/model/test-runner-app");
const TestRunnerAlias = require("../../app/model/test-runner-alias-single");
const TestRunnerAliasBatch = require("../../app/model/test-runner-alias-batch");
const TestRunner = require("../../app/model/test-runner");

describe("TestRunnerBuilder", () => {

    const args = {};
    const testRunnerBuilder = new TestRunnerBuilder(args);

    beforeEach(() => {
        args.username = undefined;
        args.password = undefined;
        args.csv = undefined;
        args.pushApplicationID = undefined;
        args.masterSecret = undefined;
        args.batchMode = undefined;
    });

    describe(".getTestRunnerType", () => {

        const getTestRunnerType = () => testRunnerBuilder.getTestRunnerType();

        it("should return TestRunnerApp type if username and password are provided", () => {
            args.username = "user";
            args.password = "pass";

            const Type = getTestRunnerType();

            expect(new Type(args)).toEqual(jasmine.any(TestRunnerApp));
        });

        it("should return TestRunnerAlias type if pushApplicationID, masterSecret and csv are provided", () => {
            args.pushApplicationID = "id";
            args.masterSecret = "secret";
            args.csv = "path";

            const Type = getTestRunnerType();

            expect(new Type(args)).toEqual(jasmine.any(TestRunnerAlias));
        });

        it("should return TestRunnerAliasBatch type if batchMode is enabled", () => {
            args.batchMode = "true";

            const Type = getTestRunnerType();

            expect(new Type(args)).toEqual(jasmine.any(TestRunnerAliasBatch));
        });

    });


    describe(".buildTestRunners", () => {

        it("should create an array", () => {
            const testRunners = testRunnerBuilder.buildTestRunners();

            expect(Array.isArray(testRunners)).toBeTruthy();
        });

        it("should create an array with as many TestRunner as 'instances' value", () => {
            const instances = 3;
            args.instances = instances;
            const testRunners = testRunnerBuilder.buildTestRunners();

            expect(testRunners.length).toBe(instances);
            expect(testRunners.every(tR => tR instanceof TestRunner)).toBeTruthy();
        });

    });

});
