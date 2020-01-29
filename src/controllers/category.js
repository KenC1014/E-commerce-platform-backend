const Category = require('../models/category')
const errorHandler = require('../helpers/dbErrorHandler')

const create = async (req, res) => {
    const category = new Category(req.body)

    try {
        await category.save()
        res.status(201).send(category)
    } catch (err) {
        res.status(400).send({error: errorHandler(err)})
    }
}

const read = async (req, res) => {
    const category = req.category
    return res.status(200).send(category)
}

const list = async (req, res) => {
    try {
        const categories = await Category.find()
        res.status(200).send(categories)
    } catch (err) {
        res.status(400).send({error: errorHandler(err)})
    }
}

const update = async (req, res) => {
    let category = req.category
    category.name = req.body.name
    
    try {
        const updated = await category.save()
        res.status(200).send(updated)
    } catch (err) {
        res.status(400).send({error: errorHandler(err)})
    }
}

const remove = async (req, res) => {
    const category = req.category
       
    try {
        const updated = await category.remove()
        res.status(200).send('Category removed')
    } catch (err) {
        res.status(400).send({error: errorHandler(err)})
    }
}

module.exports = {
    create,
    read,
    list,
    update,
    remove
}