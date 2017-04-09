Node.js exam
====

Quick practical exam for node.js candidates.

Requirements
----

- allow the user to supply a CLI argument containing a comma-separated list of tags
- if no argument is given, load `tags.txt` to get an array of tags.
- for each of these tags, find out how many times that tag appears within the objects in `data/*.json` (_note:_ objects can be nested).
- final output should be formatted like this (sorted by most popular tag first):

```
pizza     15
spoon     2
umbrella  0
cats      0
```

- cache the result so that subsequent runs can return the result immediately without needing to process the files.
- use only core modules
- use the asynchronous variants of the file IO functions (eg. use `fs.readFile` not `fs.readFileSync`).
- if any of the data files contain invalid JSON, log the error with `console.error` and continue, ignoring that file.
- you can use any version of node, however your solution must use plain callbacks rather than promises.

Solution
----
This program allows for user cli arguments or reads a tags text file to obtain tags to search the number of occurrences in the json files in the data directory and prints the search results to the console sorted most popular to least popular. 

In addition the program will cache the initial search and reference the cache file as long as the data directory is not updated. If data directory is updated, the program will read the data directory again and automatically update the cache file.
