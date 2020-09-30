function checkLogin(req, res, next) {
    if (req.user == null){
        res.status(403);
        return res.render('./requireLogin');
    } else {
        //console.log(req.user.name);
    }
    
    next();
}

module.exports = {
    checkLogin
}