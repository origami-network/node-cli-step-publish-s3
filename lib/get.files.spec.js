const chai = require('chai');
const spies = require('chai-spies');
const expect = chai.expect;

chai.use(spies);


const getFiles = require('./get-files.js');

describe('Get Files', () => {
    describe('when required', () => {
        it('should export as a function', () => {
            expect(getFiles).to.be.a('function');
        });
    });

    it('requres to pass folder', (done) => {
        const map = chai.spy()

        getFiles(__filename, (error) => {
            expect(error).to.not.be.null;
            expect(map).to.have.not.be.called;

            done();
        })(map);
    });

    // FIXME: Write more test
});
