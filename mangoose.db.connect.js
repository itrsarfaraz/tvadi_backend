const mongoose = require("mongoose");

function mongooseConnectDB() {
  mongoose
    .connect("mongodb+srv://TVADI:uzpVC0JeF1Wclbwj@cluster0.nvn9dm6.mongodb.net/oatvadmindb", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    })
    .then((result) =>
      ""
    )
    .catch((err) => console.log("error connecting to the database", err));
}

module.exports = mongooseConnectDB;