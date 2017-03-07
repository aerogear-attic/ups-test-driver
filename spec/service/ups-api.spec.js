"use strict";

const UPSAPI = require("../../app/service/ups-api");

describe("UPSAPI", () => {

    const args = {};

    const validPushApplicationID = "id";
    const validMasterSecret = "secret";

    function fakeGetSenderClient(upsapi) {
        return () => new Promise((resolve, reject) => {
            const client = {
                sender: {
                    send: (message, options) => {
                        return new Promise((resolve, reject) => {
                            resolve({});
                        });
                    },
                    // TODO: wait for unifiedpush-node-sender release to update this mocked method
                    sendBatch: notifications => {
                        return new Promise((resolve, reject) => {
                            resolve({});
                        });
                    }
                }
            };

            if (upsapi.pushApplicationID !== validPushApplicationID
                || upsapi.masterSecret !== validMasterSecret) {
                reject(new Error("Wrong credentials"));
            }

            resolve(client);
        });
    }

    beforeEach(() => {
        args.endPoint = undefined;
        args.username = undefined;
        args.password = undefined;
    });

    describe(".getApplications", () => {

        const validUsername = "user";
        const validPassword = "pass";

        function fakeGetAdminClient(upsapi) {
            return () => new Promise((resolve, reject) => {
                const client = {
                    applications: {
                        find: () => []
                    }
                };

                if (upsapi.username !== validUsername
                    || upsapi.password !== validPassword) {
                    reject(new Error("Wrong credentials"));
                }

                resolve(client);
            });
        }

        it("should return an array of Application if credentials are valid", done => {
            args.username = validUsername;
            args.password = validPassword;

            const upsapi = new UPSAPI(args);
            spyOn(upsapi, "getAdminClient").and.callFake(fakeGetAdminClient(upsapi));

            upsapi.getApplications()
                .then(apps => {
                    expect(Array.isArray(apps)).toBeTruthy();
                    done();
                })
                .catch(err => {
                    fail(err);
                    done();
                });
        });

        it("should throw an error if credentials are wrong", done => {
            args.username = "wrong";
            args.password = "wrong";

            const upsapi = new UPSAPI(args);
            spyOn(upsapi, "getAdminClient").and.callFake(fakeGetAdminClient(upsapi));

            upsapi.getApplications()
                .then(apps => {
                    fail("did get admin client with wrong credentials");
                    done();
                })
                .catch(err => {
                    expect(err.message).toContain("Wrong credentials");
                    done();
                });
        });

    });

    describe(".sendNotificationToAllDevicesOfApp", () => {

        let app;
        let upsapi;

        beforeEach(() => {
            app = { name: "Test App" };

            args.pushApplicationID = validPushApplicationID;
            args.masterSecret = validMasterSecret;

            upsapi = new UPSAPI(args);
            spyOn(upsapi, "getSenderClient").and.callFake(fakeGetSenderClient(upsapi));
        });

        it("should return a response if notification was sent", done => {
            upsapi.sendNotificationToAllDevicesOfApp(app)
                .then(res => {
                    expect(res).not.toBeUndefined();
                    done();
                })
                .catch(err => {
                    fail(err);
                    done();
                });
        });

        it("should throw error if app is undefined", () => {
            expect(upsapi.sendNotificationToAllDevicesOfApp).toThrowError();
        });

        it("should throw error if app credentials are wrong", done => {
            args.pushApplicationID = "wrong";
            args.masterSecret = "wrong";

            const upsapi = new UPSAPI(args);
            spyOn(upsapi, "getSenderClient").and.callFake(fakeGetSenderClient(upsapi));

            upsapi.sendNotificationToAllDevicesOfApp(app)
                .then(res => {
                    fail("Notification was sent with wrong app credentials.");
                    done();
                })
                .catch(err => {
                    expect(err.message).toContain("Wrong credentials");
                    done();
                });
        });

    });

    describe(".sendNotificationToAlias", () => {

        let upsapi;

        beforeEach(() => {
            args.pushApplicationID = validPushApplicationID;
            args.masterSecret = validMasterSecret;

            upsapi = new UPSAPI(args);
            spyOn(upsapi, "getSenderClient").and.callFake(fakeGetSenderClient(upsapi));
        });

        it("should return a response if notification was sent", done => {
            upsapi.sendNotificationToAlias("alias")
                .then(res => {
                    expect(res).not.toBeUndefined();
                    done();
                })
                .catch(err => {
                    fail(err);
                    done();
                });
        });

        it("should throw an error if alias is not a String", () => {
            const testNull = () => upsapi.sendNotificationToAlias(null);
            const testUndefined = () => upsapi.sendNotificationToAlias(undefined);
            const testBool = () => upsapi.sendNotificationToAlias(true);
            const testNum = () => upsapi.sendNotificationToAlias(1);
            const testStr = () => upsapi.sendNotificationToAlias("alias");
            const testObj = () => upsapi.sendNotificationToAlias({});
            const testArray = () => upsapi.sendNotificationToAlias([]);

            expect(testNull).toThrowError();
            expect(testUndefined).toThrowError();
            expect(testBool).toThrowError();
            expect(testNum).toThrowError();
            expect(testObj).toThrowError();
            expect(testArray).toThrowError();

            expect(testStr).not.toThrowError();
        });

        it("should throw error if app credentials are wrong", done => {
            args.pushApplicationID = "wrong";
            args.masterSecret = "wrong";

            upsapi = new UPSAPI(args);
            spyOn(upsapi, "getSenderClient").and.callFake(fakeGetSenderClient(upsapi));

            upsapi.sendNotificationToAlias("alias")
                .then(res => {
                    fail("Notification was sent with wrong app credentials.");
                    done();
                })
                .catch(err => {
                    expect(err.message).toContain("Wrong credentials");
                    done();
                });
        });

    });

    describe(".sendNotificationToAliasesUsingBatchFeature", () => {

        let upsapi;

        beforeEach(() => {
            args.pushApplicationID = validPushApplicationID;
            args.masterSecret = validMasterSecret;

            upsapi = new UPSAPI(args);
            spyOn(upsapi, "getSenderClient").and.callFake(fakeGetSenderClient(upsapi));
        });

        it("should return a response if notifications were sent", done => {
            const aliases = ["alias1", "alias2", "alias3"];

            upsapi.sendNotificationToAliasesUsingBatchFeature(aliases)
                .then(res => {
                    expect(res).not.toBeUndefined();
                    done();
                })
                .catch(err => {
                    fail(err);
                    done();
                });

            pending("Waiting for unifiedpush-node-sender to include 'sendBatch' method.");
        });

        it("should throw an error if aliases is not an Array", () => {
            const testNull = () => upsapi.sendNotificationToAliasesUsingBatchFeature(null);
            const testUndefined = () => upsapi.sendNotificationToAliasesUsingBatchFeature(undefined);
            const testBool = () => upsapi.sendNotificationToAliasesUsingBatchFeature(true);
            const testNum = () => upsapi.sendNotificationToAliasesUsingBatchFeature(1);
            const testStr = () => upsapi.sendNotificationToAliasesUsingBatchFeature("alias");
            const testObj = () => upsapi.sendNotificationToAliasesUsingBatchFeature({});
            const testArray = () => upsapi.sendNotificationToAliasesUsingBatchFeature([]);

            expect(testNull).toThrowError();
            expect(testUndefined).toThrowError();
            expect(testBool).toThrowError();
            expect(testNum).toThrowError();
            expect(testStr).toThrowError();
            expect(testObj).toThrowError();

            expect(testArray).not.toThrowError();
        });

        it("should throw error if app credentials are wrong", done => {
            args.pushApplicationID = "wrong";
            args.masterSecret = "wrong";

            upsapi = new UPSAPI(args);
            spyOn(upsapi, "getSenderClient").and.callFake(fakeGetSenderClient(upsapi));

            upsapi.sendNotificationToAliasesUsingBatchFeature([])
                .then(res => {
                    fail("Notification was sent with wrong app credentials.");
                    done();
                })
                .catch(err => {
                    expect(err.message).toContain("Wrong credentials");
                    done();
                });
        });

    });

});
