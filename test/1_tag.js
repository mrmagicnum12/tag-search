'use strict';

require('chai').should();
const expect = require('chai').expect;
const tag = require('../modules/tag');
const cache = require('../modules/cache');
const args = process.argv;
const cliTags = args[args.length -1];
let fileTags = '';
let list = {};

describe('Node Exam',()=>{
  before((done)=>{
      tag.getTagsFromFile('tags.txt',(err,data)=>{
         fileTags = data;
         tag.getAllTagsFromJSON('test/data',(err, tags)=>{
            tags.forEach((currentTags)=>{
              list = Object.assign(list, tag.createTagMap(list, tag.findTagOccurences(currentTags)));
            });
            cache.putTagsInCache('test/cache/cache.json',(err)=>{
                expect(err).to.equal(null);
                done()
            });
         })
      })
  })

  it('should create list of comma-separated tags from tags.txt',()=>{
    tag.getTagsFromFile('tags.txt',(err,data)=>{
       expect(data).to.have.string(',');
    })
  })

  it('should not create list of comma-separated tags from tags-test.txt because it doesnt exist',(done)=>{
    tag.getTagsFromFile('tags-test.txt',(err,data)=>{
       expect(err).to.have.property('message');
       done();
    })
  })

  it('should not get .json data from data-test directory because it doesnt exist',(done)=>{
    tag.getAllTagsFromJSON('data-test',(err, tags)=>{
       expect(err).to.have.property('message');
       done();
    })
  })

  it('should create list of tags from CLI that are comma-separated. Tags are passed as CLI args',()=>{
      expect(cliTags).to.have.string(',');
  })

  it('should check how many times tags passed from CLI appears in the data/* directory. dolor should = 2 and ipsom should = 3',()=>{
      const enteredTags = cliTags.split(',');
      const tag1 = enteredTags[0]; //dolor 2
      const tag2 = enteredTags[1]; //ipsum 3
      list[tag1].should.equal(2);
      list[tag2].should.equal(3);
  })

  it('should check how many times tags passed from tags.txt in the data/* directory. dolor should = 2 and ipsom should = 3',()=>{
      const tagsFromFile = fileTags.split(',');
      const tag1 = tagsFromFile[0]; //lorem 2
      const tag2 = tagsFromFile[1]; //ipsum 3
      const tag3 = tagsFromFile[2]; //dolor 2
      const tag4 = tagsFromFile[3]; //sit 3
      const tag5 = tagsFromFile[4]; //amet 2
      expect(list[tag1]).to.equal(undefined);
      list[tag2].should.equal(3);
      list[tag3].should.equal(2);
      expect(list[tag4]).to.equal(undefined);
      list[tag5].should.equal(2);
  })

  it('should check how many times tags passed from CLI appears in cache before checking the data/* directory. dolor should = 2 and ipsom should = 3',()=>{
      const listFromCache = cache.getTagsInCache();
      const enteredTags = cliTags.split(',');
      const tag1 = enteredTags[0]; //dolor 2
      const tag2 = enteredTags[1]; //ipsum 3
      listFromCache[tag1].should.equal(2);
      listFromCache[tag2].should.equal(3);
  })

  it('should check cache for tags before processing files in /data/*',()=>{
     const listFromCache = cache.getTagsInCache();
     const tagsFromFile = fileTags.split(',');
     const tag1 = tagsFromFile[0]; //lorem 2
     const tag2 = tagsFromFile[1]; //ipsum 3
     const tag3 = tagsFromFile[2]; //dolor 2
     const tag4 = tagsFromFile[3]; //sit 3
     const tag5 = tagsFromFile[4]; //amet 2
     expect(listFromCache[tag1]).to.equal(undefined);
     listFromCache[tag2].should.equal(3);
     listFromCache[tag3].should.equal(2);
     expect(listFromCache[tag4]).to.equal(undefined);
     listFromCache[tag5].should.equal(2);
  });

  it('should ordered tags in descending order by the numder of occurences', ()=>{
    const orderedList = tag.orderTagsInDescend(list);
    expect(orderedList).to.be.instanceof(Array);
    expect(orderedList.length > 0).to.equal(true);
  })

  it('should ordered tags in ascending order by the numder of occurences', ()=>{
    const orderedList = tag.orderTagsInAscend(list);
    expect(orderedList).to.be.instanceof(Array);
    expect(orderedList.length > 0).to.equal(true);
  })

  it('should not create tag list because an object was not passed as param', ()=>{
    expect(tag.findTagOccurences()).to.be.empty;
    expect(tag.findTagOccurences(['name'])).to.be.empty;
    expect(tag.findTagOccurences([{name : 'foo'}])).to.be.empty;
  })

});
