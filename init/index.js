require('dotenv').config();
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.model.js"); 
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = "pk.eyJ1IjoieGVuc2VuMDA4IiwiYSI6ImNsdm00cXd4ZjJvZTYybHFmdzQ2bW1sNmgifQ.h1ONYd8Vc8beTePMCPxzCQ"
const geoCodingClient = mbxGeocoding({ accessToken: mapBoxToken });

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("db connected");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDb = async () => {
  await Listing.deleteMany({});

  for (let obj of initData.data) {
    let geoData = await geoCodingClient.forwardGeocode({
      query: obj.location,
      limit: 1
    }).send();

    if (geoData.body.features.length) {
      obj.geometry = geoData.body.features[0].geometry;
    }

    obj.owner = "662cf6b53c91245b5668d599";
    obj.createdAt = Date.now();
    obj.updatedAt = Date.now();
  }

  await Listing.insertMany(initData.data);
  console.log("data was initialised");
};

initDb();