import ApiError from "../utils/apiError.js";

const errorMiddleware = (err, req, res, next) => {
  let error = err;
  console.log(error)

  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || "Internal Server Error";
    error = new ApiError(statusCode, message);
  }

  const response = {
    success: false,
    message: error.message,
    errors: error.errors,
  };
  console.log("response is =>",response)

  res.status(error.statusCode).json(response);
};

export default errorMiddleware;
