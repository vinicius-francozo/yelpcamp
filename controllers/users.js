const {Users} = require('../models')

module.exports.renderRegister = (req, res) => {
    res.render('users/register')
}

module.exports.register = async (req, res, next) => {
    try{
        const {email, username, password} = req.body
        const user = Users.build({email, username})
        await Users.register(user, password, function(err, user){
            if (err) return next(err)

            req.login(user, err => {
                if (err) return next(err)
                req.flash('success', 'Bem-vindo ao YelpCamp')
                res.redirect('/campgrounds')
            })
        })
    } catch(err){
        req.flash('error', err.message)
        res.redirect('register')
    }
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login')
}

module.exports.login = (req, res) => {
    req.flash('success', 'Bem-vindo de volta!')
    const redirectUrl = res.locals.returnTo || '/campgrounds'
    res.redirect(redirectUrl)
}

module.exports.logout = (req, res) => {
    req.logout()
    req.flash('success', 'Adeus!')
    res.redirect('/campgrounds')
}


