module.exports = {
    isLoggedIn(req, res, next) {//Por cada ruta se van a procesar esos parametros, especialmente el request
        if(req.isAuthenticated()){//Método de passport, para saber si el usuario está login o no
            return next();
        }
        return res.redirect('/signin');
    },

    isNotLoggedIn(req, res, next) {
        if(!req.isAuthenticated()){
            return next();
        }
        return res.redirect('/profile');
    }

}