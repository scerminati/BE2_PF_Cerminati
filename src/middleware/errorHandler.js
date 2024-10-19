export const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    console.error(
      "code:",
      statusCode,
      ", name:",
      err.name,
      ", message:",
      err.message
    );
    res.render("error/error", {
      error: err.name,
      message: err.message,
      code: statusCode,
    });
  };
