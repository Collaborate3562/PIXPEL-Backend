module.exports = {
  port: process.env.PORT || 5000,
  db: {
    main: process.env.MONGODB_URI || 'mongodb://localhost/yondomondobattle',
    test: 'mongodb://localhost/yondomondobattle',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true
    }
  },
  jwt: {
    //for players credentials
    secret: process.env.JWT_SECRET || 'development_secret',
    expiry: '1d'
  },
  credentials:{
    //for provider credential
    expiry: 10
  }
};
