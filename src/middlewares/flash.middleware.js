module.exports = (req, res, next) => {
  // Pass flash messages to view
  res.locals.messages = {
    message: req.flash('message'),
    error: req.flash('error'),
    warning: req.flash('warning'),
    info: req.flash('info')
  };
  
  // Make user available to views
  res.locals.user = req.user || null;
  
  next();
};
