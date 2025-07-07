export const injectSocket = (req, res, next) => {
  req.io = req.app.get("io");
  next();
};