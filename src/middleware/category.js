const Category = require('../models/category')

const getCategoryById = async (req, res, next, id) => {
    try {
        const category = await Category.findById(id)
        if(!category) {
            throw new Error ('Category not found')
        }
        req.category = category
        next()
    } catch (err) {
        res.status(400).send({error: 'Category not found'})
    }
}

module.exports = {
    getCategoryById
}