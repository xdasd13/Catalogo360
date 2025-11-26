module.exports = (req, res, next) => {
  // Pass flash messages to view
  // Pass flash messages to view directly
  const messages = req.flash("message");
  const errors = req.flash("error");

  res.locals.message = messages.length > 0 ? messages[0] : null;
  res.locals.error = errors.length > 0 ? errors[0] : null;

  // Keep legacy support if needed
  res.locals.messages = {
    message: messages,
    error: errors,
  };

  // Make user available to views
  res.locals.user = req.user || null;

  next();
};
