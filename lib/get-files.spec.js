const chai = require('chai');
const spies = require('chai-spies');
const expect = chai.expect;

chai.use(spies);


const path = require('path');
const fse = require('fs-extra');

const getFiles = require('./get-files.js');

describe('Get Files', () => {
    describe('when imported', () => {
        it('should be a function', () => {
            expect(getFiles).to.be.a('function');
        });
    });

    it('requires to pass folder', done => {
        const map = chai.spy();

        getFiles(__filename, error => {
            expect(error).to.not.be.null;
            expect(map).to.have.not.be.called;

            done();
        })(map);
    }); 

    describe('reading folder', () => {
        const testDir = path.join(__dirname, '.files');
        var testFiles = [
            'simple.txt',
            'dir/simple.txt',
            'dir/dir/simple.txt'
        ];
    
        beforeEach(() => {
            fse.emptyDirSync(testDir);
            testFiles.forEach(file =>
                fse.outputFileSync(path.join(testDir, file), file)
            );
        });

        it(`get files recursively`, done => {
            var files = testFiles;
    
            getFiles(testDir, done)(item => {
                expect(files).to.include(item.file);
    
                files = files.filter(i => i !== item.file)
                if (files.length == 0) {
                    done();
                }
            })
        })
        
        it(`get data buffer for each file`, done => {
            var files = testFiles;
    
            getFiles(testDir, done)(item => {
                expect(item.data).to.be.an.instanceof(Buffer);
                expect(item.data.toString()).to.equal(item.file);
    
                files = files.filter(i => i !== item.file)
                if (files.length == 0) {
                    done();
                }
            })
        }) 
    });

    describe('internals', () => {
        const fs = require('fs');
        const sandbox = chai.spy.sandbox();

        beforeEach(() => {
            sandbox.on(fs, 'readdir', (directory, callback) => {
                callback(false, ['item'])
            })
        });
        
        afterEach(() => {
            sandbox.restore(); // restores original methods on `array`
        })
        

        it('reports `stat` error', done => {
            const map = chai.spy();

            const expectedError = "stat error";
            sandbox.on(fs, 'stat', (directoryItem, callback) => {
                callback(expectedError);
            })

            getFiles('dir', error => {
                expect(map).to.have.not.be.called;
                expect(error).to.equal(expectedError);
    
                done();
            })(map);     
        })

        it('reports `readFile` error', done => {
            const map = chai.spy();

            sandbox.on(fs, 'stat', (directoryItem, callback) => {
                callback(false, {
                    isDirectory: () => false
                });
            })
            const expectedError = "readFile error";
            sandbox.on(fs, 'readFile', (directoryItem, callback) => {
                callback(expectedError);
            })

            getFiles('dir', error => {
                expect(map).to.have.not.be.called;
                expect(error).to.equal(expectedError);
    
                done();
            })(map);     
        })
    });
});
