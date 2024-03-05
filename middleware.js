const {campgroundSchema, reviewSchema} = require('./schemas.js')
const ExpressError = require('./utils/ExpressError')
const { Campgrounds, Reviews } = require('./models') 

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl
        req.flash('error', 'Você precisa estar logado!')
        return res.redirect('/login')
    }
    next()
}

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo
    }
    next()
}

module.exports.validateCampground = (req, res, next) => {
    const {error} = campgroundSchema.validate(req.body)
    if (error){
        const msg = error.details.map(err => err.message)
        throw new ExpressError(msg, 400)
    } else{
        next()
    }
}

module.exports.validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body)
    if (error){
        const msg = error.details.map(err => err.message).join(',')
        throw new ExpressError(msg, 400)
    } else{
        next()
    }
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const {id, reviewId} = req.params
    const review = (await Reviews.findByPk(reviewId)).toJSON()
    if (!review.authorId == req.user.id){
        req.flash('error', 'Você não ter permissão para fazer isso')
        return res.redirect(`/campgrounds/${id}`)
    }
    next()
}

module.exports.isAuthor = async (req, res, next) => {
    const {id} = req.params
    const campground = (await Campgrounds.findByPk(id)).toJSON()
    if (!campground.authorId == req.user.id){
        req.flash('error', 'Você não tem permissão para fazer isso')
        return res.redirect(`/campgrounds/${id}`)
    }
    next()
}
