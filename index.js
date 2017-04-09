'use strict';

const cache = require('./modules/cache');
const tag = require('./modules/tag');
const log = console.log;
let list = {};

const createTagMapFromCache = ()=>{
  list = cache.getTagsInCache();
};

//get tags from file
const createTagMapFromFiles = (cb)=>{
     let map = {};
     tag.getAllTagsFromJSON('data',(err, tags)=>{
        if(err){return cb(err);}
        tags.forEach((currentTags)=>{
          map = Object.assign(list, tag.createTagMap(map, tag.findTagOccurences(currentTags)));
        });
        //cache map
        cache.writeCacheFile('cache/cache.json', JSON.stringify(list), (err)=>{
            if(err){return cb(err);}
            return cb(null,map);
        });
     });
};

const getTagsFromFile = (cb) =>{
  tag.getTagsFromFile('tags.txt',(err,data)=>{
    if(err){return cb(err);}
    return cb(null, data);
  });
};

const getTagsFromCliArgs = ()=>{
  const args = process.argv;
  const cliTags = args[args.length -1];
  if(!/\\/.test(cliTags)){return cliTags;}
  return {};
};

const createAnswerToDisplay = ()=>{
    const printer = (tags)=>{
      const matches = {};
      tags.split(',').forEach((currentTag)=>{
         if(list[currentTag]){return matches[currentTag] = list[currentTag];}
         if(currentTag){return matches[currentTag] = 0;}
      });
      tag.orderTagsInDescend(matches).forEach((answer)=>{
          return log(`${answer.key} \t\t ${answer.value}`);
      });
    };

    const processTags = ()=>{
      const cliTags = getTagsFromCliArgs();
      if(!/\//.test(cliTags)){
          return printer(cliTags);
      }else{
          getTagsFromFile((err, tags)=>{
            if(err){
              return log(`Issue getting tags from file ${err.message}`);
            }else{
              return printer(tags);
            }
          });
      }
    };

    if(Object.keys(list).length === 0){
        createTagMapFromFiles((err, allTags)=>{
          if(err){
            return log(`Error creating list of tags from from ${err.message}`);
          }else{
            list = allTags;
            processTags();
          }
        });
    }else{
        processTags();
    }
};

//start program
const start = ()=>{
  cache.checkForCacheUpdate('data','cache/cache.json',(err, update)=>{
     if(err){return console.log(err.message);}
     if(!update){
       cache.putTagsInCache('cache/cache.json',(err)=>{
         if(err){log(`error loading cache ${err.message}`);}
         createTagMapFromCache();
         return createAnswerToDisplay();
       });
     }else{
       createAnswerToDisplay();
     }
  });
};

start();
