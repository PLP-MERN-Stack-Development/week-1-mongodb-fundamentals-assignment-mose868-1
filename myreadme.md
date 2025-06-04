# PLP Bookstore MongoDB Setup and Operations

This document provides a structured walkthrough of setting up and performing essential MongoDB operations for the `plp_bookstore` database, including data creation, CRUD operations, advanced queries, aggregations, and indexing for performance optimization.

---

## 📘 TASK ONE – MongoDB Setup

### ✅ Create a New Database
```js
use plp_bookstore
```

### ✅ Create the Book Collection
```js
db.books.insertOne({ 
    title: "Sample Book", 
    author: "Sample Author", 
    price: 9.99 
})
```

---

## 🛠️ TASK TWO – CRUD Operations

### 🔍 Find Operations

- **Find books in a specific genre**
```js
db.books.find({ genre: "Fantasy" })
```

- **Find books published after a certain year**
```js
db.books.find({ published_year: { $gt: 1950 } })
```

- **Find books by a specific author**
```js
db.books.find({ author: "George Orwell" })
```

### ✏️ Update Operation

- **Update the price of a specific book**
```js
db.books.updateOne(
  { title: "The Hobbit" },
  { $set: { price: 15.99 } }
)
```

### 🗑️ Delete Operation

- **Delete a book by its title**
```js
db.books.deleteOne({ title: "Moby Dick" })
```

---

## 📊 TASK THREE – Advanced Queries

### ✅ Find books that are both in stock and published after 2010
```js
db.books.find({
  in_stock: true,
  published_year: { $gt: 2010 }
})
```

### ✅ Projection – Return only specific fields
```js
db.books.find(
  { in_stock: true, published_year: { $gt: 2010 } },
  { title: 1, author: 1, price: 1, _id: 0 }
)
```

### 🔃 Sorting

- **Ascending order by price**
```js
db.books.find().sort({ price: 1 })
```

- **Descending order by price**
```js
db.books.find().sort({ price: -1 })
```

- **With projection**
```js
db.books.find({}, { title: 1, author: 1, price: 1, _id: 0 }).sort({ price: -1 })
```

### 📄 Pagination – Display books in chunks of 5

- **Page 1**
```js
db.books.find()
  .skip(0)
  .limit(5)
  .sort({ price: 1 })
```

- **Page 2**
```js
db.books.find()
  .skip(5)
  .limit(5)
```

- **With projection**
```js
db.books.find({}, { title: 1, price: 1, _id: 0 })
  .skip(5)
  .limit(5)
  .sort({ price: -1 })
```

---

## 📈 TASK FOUR – Aggregation Pipeline

### 📊 Average Price of Books by Genre
```js
db.books.aggregate([
  {
    $group: {
      _id: "$genre",
      averagePrice: { $avg: "$price" },
      count: { $sum: 1 }
    }
  },
  {
    $sort: { averagePrice: -1 }
  }
])
```

### 👨‍💼 Find the Author with the Most Books
```js
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
    $limit: 1
  }
])
```

### 🕰️ Group Books by Publication Decade
```js
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
      books: { $push: "$title" }
    }
  },
  {
    $sort: { _id: 1 }
  }
])
```

---

## ⚙️ TASK FIVE – Indexing

### 🏷️ Create Indexes

- **Create an index on the `title` field**
```js
db.books.createIndex({ title: 1 })
```

- **Create a compound index on `author` and `published_year`**
```js
db.books.createIndex({ author: 1, published_year: 1 })
```

### ✅ Verify Indexes
```js
db.books.getIndexes()
```

### 🔍 Use `explain()` to Analyze Query Performance

- **Without using index**
```js
db.books.find({ 
  author: "George Orwell", 
  published_year: { $gt: 1940 } 
}).explain("executionStats")
```

- **With index**
```js
db.books.find({ 
  author: "George Orwell", 
  published_year: { $gt: 1940 } 
}).explain("executionStats")
```

---

## ✅ Summary

This setup allows you to:
- Efficiently manage book records using MongoDB.
- Run optimized queries with indexes.
- Analyze data with aggregation pipelines.
- Support frontend pagination and sorting.