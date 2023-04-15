const express = require('express');
const router = express.Router();
const Article = require('../models/article');

//routes

//Get /articles
router.get('/articles', async(req, res) => {
    try {
        const article = await Article.find();
        res.send(article);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

//POST /articles
router.post('/articles', async(req, res) => {
    try {
        const article = await Article(req.body);
        await article.save();
        res.status(201).send(article);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

//PUT /articles/:id
router.put('/articles/:id', async(req, res) => {
    try {
        const article = await Article.findByIdAndUpdate(req.params.id, req.body, {new: true});
        res.send(article);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

//DELETE /articles/:id
router.delete('/articles/:id', async(req, res) => {
    try {
        const article = await Article.findByIdAndDelete(req.params.id);
        res.send(article);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});
module.exports = router;