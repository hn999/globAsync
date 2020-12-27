const glob = require('glob');


/**
 * Search files in target directory.
 * 
 * Precondition) npm install glob
 * Usage)
 *   const glob = require('glob');
 *   let files = await globAsync(
 *                         ["/disk1", "/disk2"], ["*.jpg", "*.mp4"],
 *                         (match) => {console.info(match));
 *   console.info(files.length);
 * 
 * @param {*} searchPathes Array of search path. Ex) ["/Volumes/disk1", "Volumes/disk2/work"]
 * @param {*} targets Array of target. Ex) ["*.jpg", "*.mp4"]
 * @param {*} matchCb Callback to get each file at it is founded.
 * @param {*} handleCb Callback to get handle object of glob. Ex) (handleObGlob) => (g_handle = handleObGlob);
 * @param {*} options Options of blob modules.
 * @returns {*} Array of file pathes. Ex) ["/Volumes/disk1/b.jpg", "/Volumes/disk2/work/dir2/a.mp4"]
 */
async function globAsync(searchPathes, targets, matchCb, handleCb, options) {
  function globPromise(searchPath, matchCb, handleCb) {
    return new Promise((resolve, reject) => {
      let defaultOptions = { nocase: true };
      if(options) {
          defaultOptions = options;
          if(!("nocase" in options)) {
              options["nocase"] = true;
          }
      }
      let gobj = new glob.Glob(searchPath, { nocase: true }, (err, matches) => {
        if (err) {
          reject(err);
        } else {
          resolve(matches);
        }
      });
      if (handleCb) {handleCb(gobj)};
      gobj.on("match", (match) => {
        if (matchCb) { matchCb(match) }
      });
      gobj.on("abort", () => {reject("aborted")});
    });
  }

  if( ! targets) {
      targets = ["*"];
  }
  if(typeof(targets) != "object") {
      targets = [targets];
  }
  let searchs = [];
  if(typeof(searchPathes) != "object") {
    searchPathes = [searchPathes];
  }
  for (let sPath of searchPathes) {
    for (let target of targets) {
      searchs.push(sPath + "/" + target);
    }
  }

  let results = [];
  for (let searchPath of searchs) {
    let result = await globPromise(searchPath, matchCb, handleCb).catch((reason)=>{
      throw reason;
    });
    results = results.concat(result);
  }
  return results;
}

// default
module.exports = globAsync;
