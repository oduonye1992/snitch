/**
 * Created by USER on 01/03/2018.
 */
function getDetailsFromConnectionString(connectionString) {
  const main = connectionString.split('//')[1];
  const usernameAndPass = main.split('@');
  const userName = usernameAndPass[0].split(':')[0];
  const password = usernameAndPass[0].split(':')[1];
  const hostPortAndDB = usernameAndPass[1];
  const database = hostPortAndDB.split('/')[1];
  const hostAndPort = hostPortAndDB.split('/')[0].split(':');
  const server = hostAndPort[0];
  const port = hostAndPort[1];
  return {
    userName,
    password,
    server,
    database,
    port,
  };
}
module.exports = getDetailsFromConnectionString;
// console.log(getDetailsFromConnectionString('mssql://atlas:Gg2Ptjw!_2HU@den1.mssql3.gear.host:1433/atlas'));
