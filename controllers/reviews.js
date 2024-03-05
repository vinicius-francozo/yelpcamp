const {Reviews, Campgrounds} = require('../models')

module.exports.createReview = async (req, res) => {
    const campground = await Campgrounds.findByPk(req.params.id)
    const review = await campground.createReview(req.body.review)
    review.setAuthor(req.user.id)
    console.log(review)
    req.flash('success', 'Criado novo review!')
    res.redirect(`/campgrounds/${campground.id}`)
}

module.exports.deleteReview = async (req, res) => {
    const {id, reviewId} = req.params
    await Reviews.destroy({
        where: {
            CampgroundId: id,
            id: reviewId
        }
    })
    req.flash('success', 'Review deletado com sucesso!')
    res.redirect(`/campgrounds/${id}`)
}