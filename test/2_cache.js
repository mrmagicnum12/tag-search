'use strict';

require('chai').should();
const expect = require('chai').expect;
const cache = require('../modules/cache');
const tag = require('../modules/tag');
const fs = require('fs');
let list = {};

describe('Node Exam - Cache',()=>{
  before((done)=>{
       tag.getAllTagsFromJSON('test/data',(err, tags)=>{
          tags.forEach((currentTags)=>{
            list = Object.assign(list, tag.createTagMap(list, tag.findTagOccurences(currentTags)));
          });
          done()
       })
  })

  it('should write file to cache in the location of provided path',(done)=>{
    cache.writeCacheFile('test/cache/cache.json', JSON.stringify(list), (err)=>{
        expect(err).to.equal(null);
        done();
    })
  })

  it('should put tags pullled from files in cache in the cache module',(done)=>{
    cache.putTagsInCache('test/cache/cache.json',(err)=>{
        expect(err).to.equal(null);
        done()
    });
  });

  it('should not put tags in cache because the location does not exist',(done)=>{
    cache.putTagsInCache('test/doesnt/exist',(err)=>{
       expect(err).to.not.equal(null);
       done()
    })
  })

  it('should get tags from cache in the cache module',()=>{
    const tags = cache.getTagsInCache();
    expect(tags).to.not.be.equal(null);
  });

  it('should return false if no file was modified in the data directory',(done)=>{
    cache.checkForCacheUpdate('data','test/cache/cache.json', (err, update)=>{
        expect(update).to.equal(false);
        done();
    });
  });

  it('should return true after file was modified in the data directory',(done)=>{
    fs.readFile('test/data/1.json',(err, fileBody)=>{
        if(err){
          console.log(err.message)
          done();
        }
        const updateFile = JSON.parse(fileBody);
        updateFile.tags.push("test");
        setTimeout(()=>{
          fs.writeFile('test/data/1.json',JSON.stringify(updateFile),(err)=>{
            if(err){
              console.log(err.message)
              done();
            }
            cache.checkForCacheUpdate('test/data','test/cache/cache.json', (err, update)=>{
              if(err){
                console.log(err.message)
                done();
              }
              expect(update).to.equal(true);
              done();
            });
          });
        },800);
    });
  });

  it('should return true if no cache file exist in the cache directory',(done)=>{
    fs.unlink('test/cache/cache.json',()=>{
      cache.checkForCacheUpdate('data','test/cache/cache.json', (err, update)=>{
          expect(update).to.equal(true);
          cache.writeCacheFile('test/cache/cache.json', JSON.stringify(list), (err)=>{
              done();
          })
      });
    });
  });
});
