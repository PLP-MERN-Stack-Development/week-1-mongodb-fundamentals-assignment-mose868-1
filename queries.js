// 1. TASK ONE - MONGO SETUP

// create new database
use plp_bookstore

// create the book collections
db.books.insertOne({ 
    title: "Sample Book", 
    author: "Sample Author", 
    price: 9.99 
})


// 2. TASK TWO - CRUD OPERATIONS

// Find books in a specific genre.
db.books.find({ genre: "Fantasy" })

// Find books published after a certain year.
db.books.find({ published_year: { $gt: 1950 } })

// Find books by a specific author.
db.books.find({ author: "George Orwell" })

// Update the price of a specific book.
db.books.updateOne(
  { title: "The Hobbit" },
  { $set: { price: 15.99 } }
)

// Delete a book by its title.
db.books.deleteOne({ title: "Moby Dick" })


// 3. TASK THREE - ADVANCED QUERIES

// find books that are both in stock and published after 2010
db.books.find({
  in_stock: true,
  published_year: { $gt: 2010 }
})

// Use projection to return only the title, author, and price fields in your queries
db.books.find(
  { in_stock: true, published_year: { $gt: 2010 } },
  { title: 1, author: 1, price: 1, _id: 0 }  // _id:0 excludes the default ID
)

// Implement sorting to display books by price (both ascending and descending)
// ascending low to high
db.books.find().sort({ price: 1 })

// descending high to low
db.books.find().sort({ price: -1 })

// with projection
db.books.find({}, { title: 1, author: 1, price: 1, _id: 0 }).sort({ price: -1 })


// Use the limit and skip methods to implement pagination (5 books per page)
// Page 1 (skip 0, limit 5):
db.books.find()
  .skip(0)
  .limit(5)
  .sort({ price: 1 }) 

  // Page 2 (skip 5, limit 5):
  db.books.find()
  .skip(5)
  .limit(5)

  // with projection
  db.books.find({}, { title: 1, price: 1, _id: 0 })
  .skip(5)
  .limit(5)
  .sort({ price: -1 })
  

// TASK FOUR - AGGREGATION PIPELINE.
// average price of books by genre
db.books.aggregate([
  {
    $group: {
      _id: "$genre",
      averagePrice: { $avg: "$price" },
      count: { $sum: 1 }  // Optional: include book count per genre
    }
  },
  {
    $sort: { averagePrice: -1 }  // Optional: sort by highest avg price
  }
])

// find the author with the most books in the collection
db.books.aggregate([
  {
    $group: {
      _id: "$author",
      bookCount: { $sum: 1 }
    }
  },
  {
    $sort: { bookCount: -1 }
  },
  {
    $limit: 1  // Get only the top author
  }
])

// Implement a pipeline that groups books by publication decade and counts them
db.books.aggregate([
  {
    $addFields: {
      decade: {
        $subtract: [
          "$published_year",
          { $mod: ["$published_year", 10] }
        ]
      }
    }
  },
  {
    $group: {
      _id: "$decade",
      bookCount: { $sum: 1 },
      books: { $push: "$title" }  // Optional: list titles
    }
  },
  {
    $sort: { _id: 1 }  // Sort by decade (ascending)
  }
])


// TASK FIVE - INDEXING.
// Create an index on the title field for faster searches
db.books.createIndex({ title: 1 })

// Verify the index was created
db.books.getIndexes()


// Create a compound index on author and published_year
db.books.createIndex({ author: 1, published_year: 1 })

// Verify the compound index
db.books.getIndexes()


// Use the explain() method to demonstrate the performance improvement with your indexes
// without index
db.books.find({ 
  author: "George Orwell", 
  published_year: { $gt: 1940 } 
}).explain("executionStats")

// with index
db.books.find({ 
  author: "George Orwell", 
  published_year: { $gt: 1940 } 
}).explain("executionStats")