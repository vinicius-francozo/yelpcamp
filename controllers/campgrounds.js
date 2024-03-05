const {cloudinary} = require('../cloudinary')
const {Campgrounds, Images, Reviews, Users} = require('../models')

module.exports.index = async (req, res) => {
    const campgrounds = (await Campgrounds.findAll({
        include: {model: Images, attributes: ['url', 'filename']}
    })).map(record => record.toJSON())
    res.render('campgrounds/index', {campgrounds})
}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new')
}

module.exports.createCampground = async (req, res) => {
    const images = req.files.map(file => ({url: file.path, filename: file.filename}))
    const campground = await Campgrounds.create({
        ...req.body.campground,
        Images: [...images]
    }, {
        include: [{
            association: Campgrounds.Images
        }]
    })
    campground.setAuthor(req.user.id)
    req.flash('success', 'Campground feito com sucesso!')
    res.redirect(`/campgrounds/${campground.id}`)
}

module.exports.showCampground = async (req, res) => {
    const campground = (await Campgrounds.findOne({
        where: {
            id: req.params.id
        }, include: [
            {model: Users, as: 'author', attributes: ['username', 'id']}, 
            {model: Images, attributes: ['url', 'filename']}, 
            {model: Reviews, attributes: ['body', 'rating', 'id'], include: {model: Users, as: 'author', attributes: ['username', 'id']}}
        ]
    })).toJSON()
    if (!campground){
        req.flash('error', 'Campground não pôde ser encontrado.')
        return res.redirect('/campgrounds')
    }
    res.render(`campgrounds/show`, {campground})
}

module.exports.renderEditForm = async (req, res) => {
    const {id} = req.params
    const campground = await Campgrounds.findByPk(id, {
        include: {model: Images, attributes: ['url', 'filename']}
    })
    if (!campground){
        req.flash('error', 'Campground não pôde ser encontrado.')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', {campground})
}

module.exports.updateCampground = async (req, res) => {
    const {id} = req.params
    const campground = await Campgrounds.findByPk(id, {include: {model: Images, attributes: ['url', 'filename']}})
    const imgs = req.files.map(file => ({url: file.path, filename: file.filename}))
    if (imgs.length) {
        await campground.createImage(...imgs)
    }
    await campground.set(req.body.campground)
    if (req.body.deleteImages){
        for (let filenm of req.body.deleteImages){
            await cloudinary.uploader.destroy(filenm)
            await Images.destroy({
                where: {
                    CampgroundId: id,
                    filename: filenm
                }
            })
        }
    }
    await campground.save()
    req.flash('success', 'Campground atualizado com sucesso!')
    res.redirect('/campgrounds')
}

module.exports.deleteCampground = async (req, res) => {
    const {id} = req.params
    await Campgrounds.findByIdAndDelete(id)
    req.flash('success', 'Campground deletado com sucesso')
    res.redirect('/campgrounds')
}