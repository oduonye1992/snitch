/**
 * Created by USER on 05/01/2018.
 */
const fs = require('fs');

function fetchFileContents(currentPath) {
  if (!fs.existsSync(currentPath)) {
    throw new Error(`Path ${currentPath} does not exist`);
  }
  const file = fs.readFileSync(currentPath, 'utf8');
  return file;
}
module.exports = fetchFileContents;
