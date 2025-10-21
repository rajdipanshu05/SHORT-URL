const mongoose = require("mongoose");

async function connectToMongoDB(url) {
  return mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    ssl: true,
    tlsAllowInvalidCertificates: true, // Optional: helps with TLS errors in dev
  });
}

module.exports = { connectToMongoDB };
