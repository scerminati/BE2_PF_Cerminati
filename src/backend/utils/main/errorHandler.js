export const handleError = (res, status, error, message) => {
  console.error(error);
  res.status(status).render("error/error", { msg: message });
};
