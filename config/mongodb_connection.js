// const { MongoClient, ServerApiVersion } = require("mongodb");
const mongoose = require("mongoose");

try {
  mongoose
    .connect(process.env.URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log(
        "Pinged your deployment. You successfully connected to MongoDB!"
      );
    })
    .catch((err) => {
      console.log("Pinged your deployment. not connected to MongoDB!"+err);
    });
} catch (err) {
  // Ensures that the client will close when you finish/error
  console.log("catch / mongodb.js => " + err);
  client.close();
}
//run().catch(console.dir);
