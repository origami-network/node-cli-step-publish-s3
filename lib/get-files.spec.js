const chai = require('chai');
const spies = require('chai-spies');
const expect = chai.expect;

chai.use(spies);


const path = require('path');
const fs = require('fs-extra');

const getFiles = require('./get-files.js');

describe('Get Files', () => {
    describe('when imported', () => {
        it('should be a function', () => {
            expect(getFiles).to.be.a('function');
        });
    });

    it('requires to pass folder', done => {
        const map = chai.spy()

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
            fs.emptyDirSync(testDir);
            testFiles.forEach(file =>
                fs.outputFileSync(path.join(testDir, file), file)
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
});
