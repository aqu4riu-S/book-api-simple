const express = require('express')
const { ObjectId } = require('mongodb')
const { connectToDb, getDb } = require('./db')


// init app & middleware
const app = express()
// passes json coming from requests (from body on POST req, for example)
app.use(express.json())


// db connection
let db

connectToDb((err) => {
    if (!err) {
        app.listen(3000, () => {
            console.log('app listening on port 3000')
        })
        db = getDb()
    }
    else {
        console.log("dfsjiofdsijodfsjidsfijodsfi")
    }
    
})


// routes
app.get('/books', (req, res) => {

    const page = req.query.p || 0
    const booksPerPage = 3

    let books = []

    db.collection('books')
        .find() // returns a cursor
        .sort({ author: 1 }) // returns a cursor
        .skip(page * booksPerPage)
        .limit(booksPerPage)
        .forEach(book => books.push(book)) // cursor method (fetches documents in batches)
        .then(() => {
            res.status(200).json(books)
        })
        .catch(() => {
            res.status(500).json({error: "Could not fetch the documents"})
        })
})


app.get('/books/:id', (req, res) => {

    if (ObjectId.isValid(req.params.id)) {
        db.collection('books')
            .findOne({ _id: new ObjectId(req.params.id)})
            .then(doc => {
                if (doc) {
                    res.status(200).json(doc)
                }
                else {
                    res.status(404).json({error: "Book not found"})
                }
                
            })
            .catch(err => {
                res.status(500).json({error: "Could not fetch the document"})
            })
    }

    else {
        res.status(500).json({error: "Invalid book ID"})
    }
})


app.post('/books', (req, res) => {
    const book = req.body

    db.collection('books')
        .insertOne(book)
        .then(result => {
            res.status(201).json(result)
        })
        .catch(err => {
            res.status(500).json({error: "Could not insert the book"})
        })
})


app.delete('/books/:id', (req, res) => {

    if (ObjectId.isValid(req.params.id)) {
        db.collection('books')
            .deleteOne({ _id: new ObjectId(req.params.id)})
            .then(result => {
                if (result) {
                    res.status(200).json(result)
                }
                else {
                    res.status(404).json({error: "Book does not exist"})
                }
            })
            .catch(err => {
                res.status(500).json({error: "Could not delete the document"})
            })
    }

    else {
        res.status(500).json({error: "Invalid book ID"})
    }
})


app.patch('/books/:id', (req, res) => {

    const updates = req.body

    if (ObjectId.isValid(req.params.id)) {
        db.collection('books')
            .updateOne({ _id: new ObjectId(req.params.id)}, {$set: updates})
            .then(result => {
                if (result) {
                    res.status(200).json(result)
                }
                else {
                    res.status(404).json({error: "Book does not exist"})
                }
            })
            .catch(err => {
                res.status(500).json({error: "Could not update the document"})
            })
    }

    else {
        res.status(500).json({error: "Invalid book ID"})
    }
})