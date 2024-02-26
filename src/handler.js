const { nanoid } = require('nanoid')
const books = require('./resource/books')

const addBookHandler = (request, h) => {
  const {
    name, year,
    author, summary,
    publisher, pageCount,
    readPage, reading
} = request.payload

  const id = nanoid(16)
  const finished  = pageCount === readPage
  const insertedAt  = new Date().toISOString()
  const updatedAt = insertedAt

  const newBook = {
    id,name,
    year, author,
    summary, publisher,
    pageCount, readPage,
    finished, reading,
    insertedAt, updatedAt
  }

  if (typeof name === 'undefined') {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku'
    }).code(400)
  }

  if (readPage > pageCount) {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
    }).code(400)
  }

  books.push(newBook)
  const isSuccess = books.filter((book) => book.id === id).length > 0

  if (isSuccess) {
    return h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId : id
      }
    }).code(201)
  }

  return h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan. Kesalahan pada sisi server',
  }).code(500)
}

const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query

  if (books.length === 0) {
    return h.response({
      status: 'success',
      data: {
        books: [],
      },
    }).code(200);
  }

  let filteredBooks = books

  if (name !== undefined) {
    filteredBooks = filteredBooks.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()))
  }
  if (reading !== undefined) {
    const isReading = reading === '1'
    filteredBooks = filteredBooks.filter((book) => book.reading === isReading)
  }
  if (finished !== undefined) {
    const isFinished = reading === '1'
    filteredBooks = filteredBooks.filter((book) => book.finished === isFinished)
  }

  const result = {
    status: 'success',
    data: {
      books: filteredBooks.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher
      }))
    }
  }

  return h.response(result).code(200)
}

const getBooksByIdHandler = (request, h) => {
  const { id } = request.params

  const book = books.filter((obj) => obj.id === id)[0]

  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book
      }
    }
  }
  const response = h.response({
    status: 'fail', message: 'Buku tidak ditemukan'
  })
  response.code(404)
  return response
}

const editBookByIdHandler = (request, h) => {
  const { id } = request.params
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  const updatedAt = new Date().toISOString()
  const index = books.findIndex((obj) => obj.id === id)

  // Validate books property
  if (name === undefined) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    }).code(400)
  }

  if (readPage > pageCount) {
    return h.response({
      status: 'fail',
      message:
        'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    }).code(400)
  }
  // End validate books property
  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    }
    return h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    }).code(200)
  }

  return h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  }).code(404)
}

const deleteBookByIdHandler = (request, h) => {
  const { id } = request.params

  const index = books.findIndex((obj) => obj.id === id)

  if (index !== -1) {
    books.splice(index, 1)
    return h.response({
      status: 'success',
      message: 'Buku berhasil dihapus'
    }).code(200)
  }
  return h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan'
  }).code(404)
}
module.exports = { addBookHandler, getAllBooksHandler, getBooksByIdHandler ,editBookByIdHandler, deleteBookByIdHandler }
