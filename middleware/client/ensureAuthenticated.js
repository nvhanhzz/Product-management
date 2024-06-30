module.exports.ensureAuthenticated = (req, res, next) => {
    if (res.locals.currentClient) {
        return next();
    }

    req.flash('fail', 'You need to be logged in.');
    return res.redirect('/client/login');
}