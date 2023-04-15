const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/user');
const articleRoutes = require('./routes/article');

//parse incoming request bodies in a middleware before your handlers
app.use(bodyParser.json());

//Connect to the database
const dbURI = 'mongodb://127.0.0.1:27017/mongooseApp'
mongoose.connect(dbURI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
      })
      .then(()=> console.log('Connected to Database: '))
      .catch(err => console.log(err));

      //Routes
      app.use('/api', userRoutes);
      app.use('/api', articleRoutes);

      //Start the server
      const PORT = process.env.PORT || 5000;
      app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));


      