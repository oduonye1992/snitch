const mysql = require('mysql');
const { async } = require('asyncawait');
const _await = require('asyncawait').await;
const fs = require('fs');

function asyncMySQLQuery(con, query) {
  return new Promise((resolve, reject) => {
    con.query(query, (err, res) => {
      if (err) reject(err);
      resolve(res);
    });
  });
}
function start() {
  const url = 'mysql://root:s0ftware!@localhost:3307/magento';
  const con = mysql.createConnection(url);
  const resultObj = [];
  con.connect(async((err) => {
    console.log('Connected');
    const showTablesSQL = 'SHOW TABLES';
    const schemaData = _await(asyncMySQLQuery(con, showTablesSQL));
    schemaData.forEach((_table) => {
      const schema = {};
      const table = _table.Tables_in_magento;
      const describeSQL = `DESCRIBE ${table}`;
      console.log(describeSQL);
      const sch = _await(asyncMySQLQuery(con, describeSQL));
      let primaryKey = null;
      for (let i = 0; i < sch.length; i++) {
        if (sch[i].Key === 'PRI') {
          primaryKey = sch[i].Field;
          break;
        }
      }
      resultObj.push({
        fields: [],
        table,
        destination_table_name: table,
        primary_key: primaryKey,
      });
    });
    const data = Buffer.from(JSON.stringify(resultObj));
    const base64data = new Buffer(data, 'binary');
    fs.writeFileSync('temp.json', base64data, 'utf8');
    console.log('done');
  }));
}
start();
