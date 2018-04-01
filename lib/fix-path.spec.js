const chai = require('chai');
const expect = chai.expect;

const path = require('path');
const fs = require('fs-extra');

const fixPath = require('./fix-path.js');

describe('Fix Path', () => {
    describe('when imported', () => {
        it('should be a function', () => {
            expect(fixPath).to.be.a('function');
        });
    });

    [
        { name: 'Windows', seperator: '\\', path: '/dir\\dir/dir\\dir', expected: '/dir/dir/dir/dir' },
        { name: '*nix', seperator: '/', path: '/dir/dir/dir/dir', expected: '/dir/dir/dir/dir' }
    ].forEach(data => {
        it('supports ' + data.name + ' path style', () => {
            expect(fixPath(data.path, data.seperator)).to.equal(data.expected);
        });
    });
});
