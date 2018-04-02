const { expect } = require('chai');

const path = require('path');

const packagePath = path.join(__dirname, '.cli');

describe('Publish S3 - CLI', () => {
    describe("arguments", () => {
        before(() => {
            // TODO: runs before all tests in this block
        });

        it("requires AWS access key", () => {
            throw new Error("TODO: not implemented");
        })
        it("requires AWS secret key", () => {
            throw new Error("TODO: not implemented");
        })
        it("requires S3 region", () => {
            throw new Error("TODO: not implemented");
        })
        it("requires S3 bucket", () => {
            throw new Error("TODO: not implemented");
        })
        it("allows to define S3 key prefix", () => {
            throw new Error("TODO: not implemented");
        })
        it("use `dist` as default module source path", () => {
            throw new Error("TODO: not implemented");
        })
        it("alows to define module source path", () => {
            throw new Error("TODO: not implemented");
        })
    });
});