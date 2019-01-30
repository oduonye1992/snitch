module.exports = function cleanup(credentials, parameters) {
  return new Promise((resolve, reject) => {
    resolve({
      status: 200,
      data: parameters,
      meta: parameters.system,
    });
  });
};
