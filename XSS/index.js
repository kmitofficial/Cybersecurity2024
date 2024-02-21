const express = require("express");
const fs = require("fs")
const he = require("he")
const app = express();

const products = ["Apple"]
app.use(express.json())

app.get('/logo.png', (req, res) => {
    res.sendFile(__dirname + '/logo.png')
})

//SEARCH
app.get("/search", (req, res) => {
    let ind = fs.readFileSync(__dirname + "/index.html")
    
    // Reflected XSS possible -- BAD CODING
    const s = "Could not find product " + req.query.q

    // Reflected XSS prevented -- GOOD CODING
    // Using "he" (HTML entities)
    // const s = "Could not find product " + he.encode(req.query.q)

    ind = ind.toString().replace("<!-- SEARCH -->", s)
    res.send(ind);
})

app.get ("/js", (req, res )=> {
    res.sendFile(__dirname + "/src.js")
})

app.get("/", (req, res) => {
    let ind = fs.readFileSync(__dirname + "/index.html")
    
    const s = products.reduce((a, c) => {
        return `${a}<li>${c}</li>`
    }, "")

    ind = ind.toString().replace("<!-- LIST -->", s)
    
    res.send(ind)
})

app.get("/products", (req, res) => {
   res.send(products)
})

 
app.post("/products", (req, res) => {

    // Stored XSS possible -- BAD CODING
    products.push(req.body.name)

    // Stored XSS prevented -- GOOD CODING
    // Using "he" (HTML entities)
    // products.push(he.encode(req.body.name))

    res.send({"success":true})
})

app.listen(8080)
console.log("Listen to 8080")