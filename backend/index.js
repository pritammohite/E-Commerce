// const port = 4000;
// const express = require ("express");
// const { JsonWebTokenError } = require("jsonwebtoken");
// const app = express();
// const mongoose = require("mongoose");
// const jwt = require("jsonwebtoken");
// const multer = require ("multer");
// const path = require("path");
// const cors = require("cors");

// app.use(express.json());
// app.use(cors());

// // Database Connection With MongoDB
// mongoose.connect("mongodb+srv://pritamohite4232:Pritu4232@cluster0.6qisv.mongodb.net/e-commerce")

// // API Creation

// app.get("/",(req,res)=>{
//     res.send("Express App is Running")
// })

// // Imagen Storage Engine

// const storage = multer.diskStorage({
//     destination: './upload/images',
//     filename:(req,file,cb)=>{
//         return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
//     }
// })

// const upload = multer({storage:storage})

// //Creating Upload Endpoint for images

// app.use('/images',express.static('upload/images'))

// app.post("/upload",upload.single('product'),(req,res)=>{
//     res.json({
//         success:1,
//         image_url:`http://localhost:${port}/images/${req.file.filename}`
//     })
// })


// app.listen(port,(error)=>{
//     if(!error){
//         console.log("Server Running on Port "+port)
//     }
//     else{
//         console.log("Error  :"+error)
//     }
// })

const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const fs = require('fs');
const cors = require("cors");

const app = express();
const port = 4000;

// Database Connection With MongoDB
mongoose.connect("mongodb+srv://pritamohite4232:Pritu4232@cluster0.6qisv.mongodb.net/e-commerce");

// CORS configuration
app.use(cors({
  origin: 'http://localhost:3005', // Replace with your frontend URL
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));

// Directory for storing uploaded images
const uploadDir = path.join(__dirname, 'upload', 'images');

// Ensure the upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Storage Engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Max file size 5MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Serve images from the 'images' directory
app.use('/images', express.static(uploadDir));

// API Route
app.get("/", (req, res) => {
  res.send("Express App is Running");
});

// Upload Route
app.post("/upload", upload.single('product'), (req, res) => {
  try {
    res.json({
      success: 1,
      image_url: `http://localhost:${port}/images/${req.file.filename}`
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start the server
app.listen(port, (error) => {
  if (!error) {
    console.log("Server Running on Port " + port);
  } else {
    console.log("Error: " + error);
  }
});
