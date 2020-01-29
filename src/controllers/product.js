const formidable = require('formidable')
const _ = require('lodash')
const fs = require('fs')
const Product = require('../models/product')
const errorHandler = require('../helpers/dbErrorHandler')

const create = async (req, res) => {
  let form = new formidable.IncomingForm()
  form.keepExtensions = true

  
    form.parse(req, async (err, fields, files)=> {
        if (err) {
            return res.status(400).send({error:'Image can not be uploaded'})
        }

        const {name, description, price, category, quantity, shipping, sizes} = fields
        if (!name || !description || !price || !category || !quantity || !shipping || !sizes) {
            return res.status(400).send({error:'All fields are required'})
        }

        if (sizes && sizes[0].length < 1) {
            return res.status(400).send({error:'Sizes must be selected'})
        }

        let product = new Product(fields)

        if(files.photo) {
            if (files.photo.size > 1000000) {
                return res.status(400).send({error:'Image must be less than 1Mb in size'})
            }
            product.photo.data = fs.readFileSync(files.photo.path)
            product.photo.contentType = files.photo.type
        }

        try {
            await product.save()
            product.photo = undefined
            res.status(200).send(product)
        } catch (err) {
            res.status(400).send({error: errorHandler(err)})
        }
    })
}

const read = async (req, res) => {
    req.product.photo = undefined
    return res.status(200).send(req.product)
}

const list = async (req, res) => {
    let order = req.query.order ? req.query.order : 'asc'
    let sortBy = req.query.sortBy ? req.query.sortBy : '_id'
    let limit = req.query.limit ? parseInt(req.query.limit) : 6

    try {
        const products = await Product.find()
        .select("-photo")
        .populate('category')
        .sort([[sortBy, order]])
        .limit(limit)
        res.status(200).send(products)
    } catch (err) {
        res.status(400).send({error: errorHandler(err)})
    }
}

const listRelated = async (req,res) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : 6

    try {
        const relatedProducts = await Product.find({_id: {$ne: req.product}, category: req.product.category})
        .limit(limit)
        .populate('category', '_id, name')
        res.status(200).send(relatedProducts)
    } catch (err) {
        res.status(400).send({error: 'Products not found'})
    }
}

const listCategories = async (req, res) => {
        Product.distinct('category', {}, (err, productCategories) => {
            if (err) {
                return res.status(400).send(errorHandler(err))
            }
            res.status(200).send(productCategories)
        })
}

const listBySearch = async (req, res) => {
    let order = req.body.order ? req.body.order : "desc";
    let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
    let limit = req.body.limit ? parseInt(req.body.limit) : 100;
    let skip = parseInt(req.body.skip);
    let findArgs = {};
 
    // console.log(order, sortBy, limit, skip, req.body.filters);
    //console.log("findArgs", findArgs);
 
    for (let key in req.body.filters) {
        if (req.body.filters[key].length > 0) {
            if (key === "price") {
                // gte -  greater than price [0-10]
                // lte - less than
                findArgs[key] = {
                    $gte: req.body.filters[key][0],
                    $lte: req.body.filters[key][1]
                };
            } else {
                findArgs[key] = req.body.filters[key];
            }
        }
    }
    
    try {
        const matchedProducts = await Product.find(findArgs)
        .select("-photo")
        .populate("category")
        .sort([[sortBy, order]])
        .skip(skip)
        .limit(limit)
        res.status(200).send({
            size: matchedProducts.length,
            matchedProducts
        })
    } catch (err) {
        return res.status(400).send({error: 'Products not found'})
    }
}

const listSearch = async (req, res) => {
    //criteria object for search
    let criteria = {}

    if (req.query.search) {
        criteria.name = {$regex: req.query.search, $options: 'i'}
        if (req.query.category && (!req.query.category !== 'All')) {
            criteria.category = req.query.category
        }
    }
    
    try {
        const matchedProducts = await Product.find(criteria).select('-photo')
        res.status(200).send(matchedProducts)
    } catch (err) {
        return res.status(400).send({error: 'No matched products found'})
    }
}

const update = async (req, res) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true

  
    form.parse(req, async (err, fields, files)=> {
        if (err) {
            return res.status(400).send({error:'Image can not be uploaded'})
        }

        const {sizes} = fields

        if (sizes && sizes[0].length < 1) {
            return res.status(400).send({error:'Sizes must be selected'})
        }
          
        let product = req.product
        product = _.extend(product, fields)

        if(files.photo) {
            if (files.photo.size > 1000000) {
                return res.status(400).send({error:'Image must be less than 1Mb in size'})
            }
            product.photo.data = fs.readFileSync(files.photo.path)
            product.photo.contentType = files.photo.type
        }

        try {
            await product.save()
            product.photo = undefined
            res.status(200).send(product)
        } catch (err) {
            res.status(400).send({error: errorHandler(err)})
        }
    })
}

const remove = async (req, res) => {
    const product = req.product
    try {
        await product.remove()
        res.status(200).send({success: 'Delete success'})
    } catch (err) {
        res.status(400).send({error: errorHandler(err)})
    }
}

module.exports = {
    create,
    read,
    list,
    listRelated,
    listCategories,
    listBySearch,
    listSearch,
    update,
    remove
}