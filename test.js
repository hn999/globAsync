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