const Campground = require('../models/campground')
const {cloudinary} = require('../cloudinary')

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', {campgrounds})
}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new')
}

module.exports.createCampground = async (req, res) => {
    const campground = new Campground(req.body.campground)
    campground.images = req.files.map(file => ({url: file.path, filename: file.filename}))
    campground.author = req.user._id
    await campground.save()
    req.flash('success', 'Campground feito com sucesso!')
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.showCampground = async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author')

    if (!campground){
        req.flash('error', 'Campground não pôde ser encontrado.')
        return res.redirect('/campgrounds')
    }
    res.render(`campgrounds/show`, {campground})
}

module.exports.renderEditForm = async (req, res) => {
    const {id} = req.params
    const campground = await Campground.findById(id)
    if (!campground){
        req.flash('error', 'Campground não pôde ser encontrado.')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', {campground})
}

module.exports.updateCampground = async (req, res) => {
    const {id} = req.params
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground})
    const imgs = req.files.map(file => ({url: file.path, filename: file.filename}))
    campground.images.push(...imgs)
    await campground.save()
    if (req.body.deleteImages){
        for (let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename)
        }
        await campground.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}})
    }
    req.flash('success', 'Campground atualizado com sucesso!')
    res.redirect('/campgrounds')
}

module.exports.deleteCampground = async (req, res) => {
    const {id} = req.params
    await Campground.findByIdAndDelete(id)
    req.flash('success', 'Campground deletado com sucesso')
    res.redirect('/campgrounds')
}