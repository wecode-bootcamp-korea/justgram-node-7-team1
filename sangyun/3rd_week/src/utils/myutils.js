function asyncWrap(asyncController) {
  return async (req, res, next) => {
    try {
      await asyncController(req, res, next)
    }
    catch(error) {
      next(error);
    }
  };
}

function checkDataIsNotEmpty(targetData) {
  Object.keys(targetData).forEach(key => {
    if (!targetData[key])
      throw {status: 400, message: `plz fill ${key}`};
  });
}

module.exports = {asyncWrap, checkDataIsNotEmpty};