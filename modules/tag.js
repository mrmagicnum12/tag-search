'use strict';

const fs = require('fs');
const log = console.log;

const orderTagsInDescend =(tags)=>{
  let ordered = [];
  let descending = (a,b)=>{return b.value - a.value;};
  Object.keys(tags).forEach((key)=>{
     ordered.push({key: key, value: tags[key]});
  });
  return ordered.sort(descending);
};

const orderTagsInAscend =(tags)=>{
  let ordered = [];
  let ascending = (a,b)=>{return  a.value - b.value;};
  Object.keys(tags).forEach((key)=>{
     ordered.push({key: key, value: tags[key]});
  });
  return ordered.sort(ascending);
};


const findTagOccurences = (dataObj)=>{
  const getAllTagValues = (obj)=>{
     let allTagsValues = [];
     const getEachTagArray = (tags)=>{
       Object.keys(tags).forEach((key)=>{
         if(key === 'tags'){return allTagsValues = allTagsValues.concat(tags[key]);}
         if(typeof tags[key] === 'object'){return getEachTagArray(tags[key]);}
         if(Array.isArray(tags[key])){return tags[key].forEach(getEachTagArray(t));}
       });
       return allTagsValues;
     };
     return getEachTagArray(obj);
  };
  const createTagList = (tags)=>{
    const tagList = {};
    tags.forEach((tag)=>{
       if(tagList[tag]){
         tagList[tag] += 1;
       }else{
         tagList[tag]=1;
       }
    });
    return tagList;
  };

  if(typeof dataObj === 'object'){
    return createTagList(getAllTagValues(dataObj));
  }else{
    return {};
  }
};

const getTagsFromFile = (location, cb)=>{
    fs.readFile(location,'utf8',(err, data)=>{
      if(err){
        return cb(err);
      }else{
        return cb(null,data.toString().replace(/\n/g, ","));
      }
    });
};

const createTagMap = (masterList, newList)=>{
    for(let t in newList){
      if(masterList[t]){
         masterList[t] = newList[t] + masterList[t];
      }else{
         masterList[t] = newList[t];
      }
    }
    return masterList;
};

const getDataFromFiles = (dataDirectory, files, index, cb)=>{
   if(index < 0){return cb(null);}
   fs.readFile(`${dataDirectory}/${files[index]}`,'utf8', cb);
};

const isJSON = (value)=>{
  try{
    JSON.parse(value);
    return true;
  }catch(e){
    return false;
  }
};

const getAllTagsFromJSON = (dataDirectory, cb)=>{
  let files = [];
  let filesToRead = 0;
  let dataObj = [];

  const check = (err, fileBody)=>{
     if(err){log(err);}
     if(filesToRead > -1){
       filesToRead = filesToRead - 1;
       if(isJSON(fileBody)){
         dataObj.push(JSON.parse(fileBody));
         return getDataFromFiles(dataDirectory, files, filesToRead, check);
       }else{
         log(`******* Error ******* File contains invalid json`);
         return getDataFromFiles(dataDirectory, files,  filesToRead, check);
       }
     }else{
       return cb(null, dataObj);
     }
  };

  fs.readdir(dataDirectory,(err, f)=>{
      if(err){return cb(err);}
      filesToRead = f.length - 1;
      files = f;
      getDataFromFiles(dataDirectory, f, filesToRead, check);
  });
};

module.exports = {getTagsFromFile, findTagOccurences, getAllTagsFromJSON, createTagMap, orderTagsInDescend, orderTagsInAscend}
