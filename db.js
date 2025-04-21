const mongoose = require('mongoose');
require('dotenv').config()


module.exports = () => {
     const connectionParams = {
          useNewUrlParser: true,
          useUnifiedTopology: true,
     };

     mongoose.set('strictQuery', true);

     mongoose
          .connect(process.env.MONGODB_URL)
          .then(() => {
               console.log('You have successfully connected to the database');
          })
          .catch((error) => {
               console.error(`An error occurred: ${error.message}\nCould not connect to database`);
          });
};
