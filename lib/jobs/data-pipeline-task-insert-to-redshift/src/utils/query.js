const { async } = require('asyncawait');
const _await = require('asyncawait').await;
const Log = require('../utils/logger');

function query(con, query, type = 'postgres') {
  return new Promise(async((resolve, reject) => {
    try {
      if (type === 'postgres') {
        const res = _await(con.query(query));
        return resolve(res.rows);
      }
      return con.query(query, (err, res) => {
        if (err) return reject(err);
        return resolve(res);
      });
    } catch (e) {
      reject(e);
    }
  }));
}

module.exports = query;
