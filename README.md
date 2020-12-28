# Glob ext

A simple wrapper of glob module with multi file extension support.


# Usage

## Case 1: Pathes and Extenstions

You can specify combination of folder path and extensions.

```javascript
const globext = require("glob-ext");

async function main() {
    let files = await globext(
        ["node_modules/glob/**", "node_modules/once/**"], 
        ["*.md", "*.js"]);
    console.info(files);
}
main().then();

```

Output:
```
hide@MacBook-Air check % node index.js
[
  'node_modules/glob/changelog.md',
  'node_modules/glob/README.md',
  'node_modules/glob/common.js',
  'node_modules/glob/glob.js',
  'node_modules/glob/sync.js',
  'node_modules/once/README.md',
  'node_modules/once/once.js'
]
```

## Case 2: Get path without waiting all results

```javascript
const globext = require("glob-ext");

async function main() {
    let files = await globext(
        ["node_modules/glob/**", "node_modules/once/**"], 
        ["*.md", "*.js"],
        (fpath) => console.info(fpath));
    console.info("length:" + files.length);
}
main().then();
```

Output:
```
hide@MacBook-Air check % node index.js
node_modules/glob/README.md
node_modules/glob/changelog.md
node_modules/glob/common.js
node_modules/glob/glob.js
node_modules/glob/sync.js
node_modules/once/README.md
node_modules/once/once.js
length:7
hide@MacBook-Air check % 
```

## Case 3: Others (Passing options, abort search or etc..,)

Check below test codes.

```Javascript
"use strict"
const blobAsync = require("./index.js");

async function testAll() {
    let r;
    // test1
    r = await blobAsync("testdir/**");
    console.info("test1", r);

    // test2
    r = await blobAsync("testdir/**", "*.txt");
    console.info("test2", r);
    
    // test3
    r = await blobAsync(["testdir/dir1", "testdir/dir2"], ["*.txt", "*.text"]);
    console.info("test3", r);

    // test4 get result without waiting all search completed.
    r = await blobAsync(["testdir/dir1", "testdir/dir2"], 
                        ["*.txt", "*.text"],
                        (match) => {console.info("test4", "match", match)});
    console.info("test4", r.length);

    // test5 abort during search
    let handle;
    r = await blobAsync(["testdir/dir1", "testdir/dir2"], 
                        ["*.txt", "*.text"],
                        (match) => {console.info("test5", "match", match); handle.abort()},
                        (h) => {handle = h})
        .catch((reason)=>["reason:" + reason]);
    console.info("test5", r);   
}

testAll().then();
```

