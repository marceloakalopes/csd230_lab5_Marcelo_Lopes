import { useState, useEffect } from 'react';
import axios from 'axios';

function Book() {
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [booksUpdated, setBooksUpdated] = useState(false);

  const handleBookSelect = (id) => {
    setSelectedBookId(id);
  };

  const handleBookSubmit = (newBook) => {
    setBooksUpdated(!booksUpdated);
  };

  const handleBookDelete = () => {
    setSelectedBookId(null);
    setBooksUpdated(!booksUpdated);
  };

  // Style Objects
  const containerStyle = {
    maxWidth: '1200px',
    margin: '40px auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    color: '#333'
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '30px'
  };

  const flexContainer = {
    display: 'flex',
    gap: '20px',
    justifyContent: 'space-between'
  };

  const sectionStyle = {
    flex: '1',
    padding: '20px',
    borderRadius: '8px',
    backgroundColor: '#fdfdfd',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)'
  };

  const sectionHeaderStyle = {
    borderBottom: '2px solid #eee',
    marginBottom: '15px',
    paddingBottom: '10px'
  };

  const listItemStyle = {
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '4px',
    backgroundColor: '#fff',
    cursor: 'pointer',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  };

  const buttonStyle = {
    padding: '10px 15px',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: '#007BFF',
    color: '#fff',
    cursor: 'pointer'
  };

  // BookList Component: Displays all books in a list
  const BookList = ({ onSelect, updated }) => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      const fetchBooks = async () => {
        try {
          const response = await axios.get('http://localhost:8080/rest/books');
          setBooks(response.data);
          setLoading(false);
        } catch (err) {
          setError(err.message || 'Failed to fetch books.');
          setLoading(false);
        }
      };
      fetchBooks();
    }, [updated]);

    if (loading) return <p>Loading books...</p>;
    if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

    return (
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {books.map((book) => (
          <li
            key={book.id}
            style={listItemStyle}
            onClick={() => onSelect(book.id)}
          >
            {book.title}
          </li>
        ))}
      </ul>
    );
  };

  // BookDetail Component: Displays the details of a selected book
  const BookDetail = ({ bookId }) => {
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      const fetchBook = async () => {
        try {
          const response = await axios.get(`http://localhost:8080/rest/book/${bookId}`);
          setBook(response.data);
          setLoading(false);
        } catch (err) {
          setError(err.message || `Failed to fetch book with ID ${bookId}.`);
          setLoading(false);
        }
      };

      if (bookId) {
        fetchBook();
      } else {
        setLoading(false);
      }
    }, [bookId]);

    if (!bookId) return <p>Please select a book to view details.</p>;
    if (loading) return <p>Loading book details...</p>;
    if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;
    if (!book) return <p>Book not found.</p>;

    return (
      <div>
        <h3>{book.title}</h3>
        <p>
          <strong>Author:</strong> {book.author}
        </p>
        <p>
          <strong>ISBN:</strong> {book.isbn}
        </p>
      </div>
    );
  };

  // BookForm Component: Adds or updates a book
  const BookForm = ({ onSubmit, initialValues }) => {
    const [formData, setFormData] = useState(
      initialValues || { title: '', author: '', isbn: '' }
    );
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
      if (initialValues) {
        setFormData(initialValues);
      }
    }, [initialValues]);

    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsSubmitting(true);
      setError(null);

      try {
        const url = initialValues?.id
          ? `http://localhost:8080/rest/book/${initialValues.id}`
          : 'http://localhost:8080/rest/book';
        const method = initialValues?.id ? 'put' : 'post';

        const response = await axios[method](url, formData);
        onSubmit(response.data);
        setFormData({ title: '', author: '', isbn: '' });
      } catch (err) {
        setError(err.message || 'Failed to submit book.');
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <form onSubmit={handleSubmit}>
        {error && <p style={{ color: 'red' }}>Error: {error}</p>}
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="title" style={{ display: 'block', marginBottom: '5px' }}>
            Title:
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ccc'
            }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="author" style={{ display: 'block', marginBottom: '5px' }}>
            Author:
          </label>
          <input
            type="text"
            id="author"
            name="author"
            value={formData.author}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ccc'
            }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="isbn" style={{ display: 'block', marginBottom: '5px' }}>
            ISBN:
          </label>
          <input
            type="text"
            id="isbn"
            name="isbn"
            value={formData.isbn}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ccc'
            }}
          />
        </div>
        <button type="submit" disabled={isSubmitting} style={buttonStyle}>
          {isSubmitting ? 'Submitting...' : initialValues?.id ? 'Update Book' : 'Add Book'}
        </button>
      </form>
    );
  };

  // DeleteBook Component: Deletes a book
  const DeleteBook = ({ bookId, onDelete }) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState(null);

    const handleDelete = async () => {
      setIsDeleting(true);
      setError(null);
      try {
        await axios.delete(`http://localhost:8080/rest/book/${bookId}`);
        onDelete();
      } catch (err) {
        setError(err.message || `Failed to delete book with ID ${bookId}.`);
      } finally {
        setIsDeleting(false);
      }
    };

    return (
      <div>
        {error && <p style={{ color: 'red' }}>Error: {error}</p>}
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          style={{ ...buttonStyle, backgroundColor: '#dc3545', marginTop: '10px' }}
        >
          {isDeleting ? 'Deleting...' : 'Delete Book'}
        </button>
      </div>
    );
  };

  return (
    <div style={containerStyle}>
      <h1 style={headerStyle}>Books</h1>
      <div style={flexContainer}>
        <div style={sectionStyle}>
          <h2 style={sectionHeaderStyle}>Book List</h2>
          <BookList onSelect={handleBookSelect} updated={booksUpdated} />
        </div>
        <div style={sectionStyle}>
          <h2 style={sectionHeaderStyle}>Book Details</h2>
          <BookDetail bookId={selectedBookId} />
          {selectedBookId && (
            <DeleteBook bookId={selectedBookId} onDelete={handleBookDelete} />
          )}
        </div>
        <div style={sectionStyle}>
          <h2 style={sectionHeaderStyle}>Add Book</h2>
          <BookForm
            onSubmit={handleBookSubmit}
            initialValues={selectedBookId ? { id: selectedBookId } : null}
          />
        </div>
      </div>
    </div>
  );
}

export default Book;
