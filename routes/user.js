const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Article = require('../models/article');

//routes

//GET /users
router.get('/users', async (req, res) => {
    try {
        const users = await User.find().populate('articles');
        res.send(users);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

//GET /users/:id/articles
router.get('/users/:id/articles', async (req, res) =>{
    const {id} = req.params;
    try {
        const user = await User.findById(id).populate('articles');
        if(!user){
            return res.status(404).json({message: 'User not found'})
        }
        res.status(200).json(user.articles);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({message: 'Server Error'});
    }
});

//POST /users
router.post('/users', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).send(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

//POST /users/:id/articles
router.post('/users/:id/articles', async (req, res) => {
    const {title, description} = req.body;
    const {id} = req.params;
    try {
        const user = await User.findById(id);
        if(!user){
            return res.status(404).send('User not found');
        }
        const article = new Article({title, description});
        await article.save();
        user.articles.push(article._id);
        await user.save();
        res.status(201).send(article)
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

//Puts /users/:id
router.put('/users/:id', async(req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true});
        res.send(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

//DELETE /users/:id
router.delete('/users/:id', async(req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        //const user = await User.findById(req.params.id);
        //await user.remove();
        res.send(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

// DELETE /users/:id/articles/:aId
router.delete("/users/:id/articles/:aId", async (req, res) => {
    const userId = req.params.id;
    const articleId = req.params.aId;
  
    try {
      // Récupérer l'utilisateur et vérifier s'il a l'article spécifié
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }
      const articleIndex = user.articles.findIndex(
        (id) => id.toString() === articleId
      );
      if (articleIndex === -1) {
        return res.status(404).json({ message: "Article non trouvé" });
      }
  
      // Supprimer l'article de la liste des articles de l'utilisateur
      user.articles.splice(articleIndex, 1);
      await user.save();
  
      // Supprimer l'article de la collection "Articles"
      const deletedArticle = await Article.findByIdAndDelete(articleId);
      if (!deletedArticle) {
        return res.status(404).json({ message: "Article non trouvé" });
      }
  
      res.json({ message: "Article supprimé avec succès" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

module.exports = router;
