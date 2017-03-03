"use strict";

const TestRunnerController = require("../../app/util/test-runner-controller");
const TestRunnerApp = require("../../app/model/test-runner-app");
const TestRunnerAlias = require("../../app/model/test-runner-alias-single");
const TestRunnerAliasBatch = require("../../app/model/test-runner-alias-batch");

describe("TestRunnerController", () => {

    const args = {
        delay: undefined
    };

    const testRunners = [];

    const controller = new TestRunnerController(args, testRunners);

    beforeEach(() => {
        testRunners.length = 0;
    });

    describe(".start", () => {

        beforeEach(() => {
            spyOn(controller, "startTestRunnersWithApps");
            spyOn(controller, "startTestRunnersWithCSV");
        });

        it("should call startTestRunnersWithApps if the testRunners are 'App' type", () => {
            testRunners.push(new TestRunnerApp(args));

            controller.start();

            expect(controller.startTestRunnersWithApps).toHaveBeenCalled();
            expect(controller.startTestRunnersWithCSV).not.toHaveBeenCalled();
        });

        it("should call startTestRunnersWithCSV if the testRunners are 'Alias' type", () => {
            testRunners.push(new TestRunnerAlias(args));

            controller.start();

            expect(controller.startTestRunnersWithCSV).toHaveBeenCalled();
            expect(controller.startTestRunnersWithApps).not.toHaveBeenCalled();
        });

        it("should call startTestRunnersWithCSV if the testRunners are 'AliasBatch' type", () => {
            testRunners.push(new TestRunnerAliasBatch(args));

            controller.start();

            expect(controller.startTestRunnersWithCSV).toHaveBeenCalled();
            expect(controller.startTestRunnersWithApps).not.toHaveBeenCalled();
        });

    });

    describe(".startTestRunnersAsync", () => {

        const apps = [{ id: 1 }, { id: 2 }];
        const aliases = ["alias1", "alias2"];

        beforeAll(() => {
            spyOn(controller, "getApplications").and.returnValue(new Promise((res, rej) => res(apps)));
            spyOn(controller, "getAliasesFromCSV").and.returnValue(new Promise((res, rej) => res(aliases)));
        });

        beforeEach(() => {
            spyOn(controller, "startTestRunnersAsync");
        });

        it("should call startTestRunnersAsync", () => {
            controller.start()
                .then(() => expect(controller.startTestRunnersAsync).toHaveBeenCalled())
                .catch(err => fail(err));
        });

        it("should call startTestRunnersAsync with apps if the testRunners are 'App' type", () => {
            testRunners.push(new TestRunnerApp(args));

            controller.start()
                .then(() => expect(controller.startTestRunnersAsync.calls.argsFor(0)).toEqual(apps))
                .catch(err => fail(err));
        });

        it("should run startTestRunnersAsync with alias if the testRunners are 'Alias' type", () => {
            testRunners.push(new TestRunnerAlias(args));

            controller.start()
                .then(() => expect(controller.startTestRunnersAsync.calls.argsFor(0)).toEqual(aliases))
                .catch(err => fail(err));
        });

        it("should run startTestRunnersAsync with alias if the testRunners are 'AliasBatch' type", () => {
            testRunners.push(new TestRunnerAliasBatch(args));

            controller.start()
                .then(() => expect(controller.startTestRunnersAsync.calls.argsFor(0)).toEqual(aliases))
                .catch(err => fail(err));
        });

    });

});
