'use strict';

const fs = require('fs');
const log = console.log;
let tags = {};

const getTagsInCache = ()=>{
   return tags;
};

const putTagsInCache = (location, cb)=>{
    return fs.readFile(location,'utf8',(err, data)=>{
       if(err){return cb(err);}
       tags = JSON.parse(data);
       cb(null);
    });
};

const writeCacheFile = (location, data, cb)=>{
    return fs.writeFile(location, data,'utf8',cb);
};

const hasFilesUpdated = (dataDirectory, files, index, cacheFileLocation, cb)=>{
    if(index < 0){return cb(null,false);}
    fs.stat(`${dataDirectory}/${files[index]}`,(err, fileDir)=>{
        if(err){return cb(err);}
        fs.stat(cacheFileLocation, (err, cacheFile)=>{
          if(err){return cb(err);}
          if(fileDir.mtime > cacheFile.mtime){return cb(null,true);}
          return cb(null,false);
        });
    });
};

const checkForCacheUpdate = (dataDirectory, cacheFileLocation, cb)=>{
  let files = [];
  let filesToRead = 0;

  const check = (err, updateCache)=>{
     if(err){log(err);}
     if(filesToRead > -1){
       filesToRead = filesToRead - 1;
       if(updateCache){
         return cb(null, true);
       }else{
         return hasFilesUpdated(dataDirectory, files,  filesToRead, cacheFileLocation, check);
       }
     }else{
       return cb(null, false);
     }
  };
  fs.readdir(dataDirectory,(err, f)=>{
      if(err){return cb(err);}
      filesToRead = f.length-1;
      files = f;
      hasFilesUpdated(dataDirectory, f, filesToRead, cacheFileLocation, check);
  });
};
module.exports = {putTagsInCache, getTagsInCache, writeCacheFile, checkForCacheUpdate};
