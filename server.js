const PORT = process.env.PORT || 8080;
const express = require('express')
const cors = require("cors")
const axios = require("axios")
require("dotenv").config()

// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app")
const { collection, getDocs, getFirestore } = require("firebase/firestore")

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGEBUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Initialize Firebase
const fb = initializeApp(firebaseConfig);
const db = getFirestore(fb)

const app = express()

app.use(cors(
    {origin: "https://4homeowners.netlify.app"}
))

// Get roofers list from Firebase
app.get("/roofers", (req, res) => {
    const getRoofers = async () => {
        const querySnapshot = await getDocs(collection(db, 'roofers'))
        const roofersList = []
  
        querySnapshot.forEach((doc) => {
          roofersList.push(doc.data())
        });
        res.json(roofersList)
      }
      getRoofers()
})

// Get suggestions from Mapbox
app.get("/maps", (req, res) => {
    const addressQuery = req.query.addressQuery

    const options = {
        method: "GET",
        url: `https://api.mapbox.com/search/geocode/v6/forward?q=${addressQuery}&proximity=ip&access_token=${process.env.REACT_APP_MAPBOX_API_KEY}`,
    }   

    axios.request(options).then((respose) => {
        res.json(respose.data)
    }).catch((err) => {
        console.log(err)
    })
})

// Get distance from Mapbox
app.get("/directions", (req, res) => {
    const locationA = req.query.locationA
    const locationB = req.query.locationB

    const options = {
        method: "GET",
        url: `https://api.mapbox.com/directions/v5/mapbox/driving/${locationA.longitude}%2C${locationA.latitude}%3B${locationB.longitude}%2C${locationB.latitude}?alternatives=true&geometries=geojson&language=en&overview=full&steps=true&access_token=${process.env.REACT_APP_MAPBOX_API_KEY}`,
    }   

    axios.request(options).then((respose) => {
        res.json(respose.data)
    }).catch((err) => {
        console.log(err)
    })
})

app.listen(PORT, () => {
    console.log("Server running on port: ", PORT)
})