const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  port: process.env.PORT || 5000,
  db: {
    main: process.env.MONGODB_URI || 'mongodb://localhost/pixpel',
    test: 'mongodb://localhost/pixpel',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true
    }
  },
  jwt: {
    //for players credentials
    secret: process.env.TOKEN_SECRET || 'pixpel_development_secret',
    expiry: '1d'
  },
  credentials:{
    //for provider credential
    expiry: 10
  }
};
