const Success = (statusCode, result) => {
  return {
    success: true,
    statusCode,
    result,
  };
};

const Error = (statusCode, message) => {
  return {
    success: false,
    statusCode,
    message,
  };
};

module.exports = { Success, Error };