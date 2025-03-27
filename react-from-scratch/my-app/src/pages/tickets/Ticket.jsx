import { useState, useEffect } from 'react';
import axios from 'axios';

function Ticket() {
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [ticketsUpdated, setTicketsUpdated] = useState(false);

  const handleTicketSelect = (id) => {
    setSelectedTicketId(id);
  };

  const handleTicketSubmit = (newTicket) => {
    setTicketsUpdated(!ticketsUpdated);
  };

  const handleTicketDelete = () => {
    setSelectedTicketId(null);
    setTicketsUpdated(!ticketsUpdated);
  };

  // Styling objects
  const containerStyle = {
    maxWidth: '1200px',
    margin: '40px auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    color: '#333',
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '30px',
  };

  const flexContainer = {
    display: 'flex',
    gap: '20px',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  };

  const sectionStyle = {
    flex: '1',
    minWidth: '280px',
    padding: '20px',
    borderRadius: '8px',
    backgroundColor: '#fdfdfd',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
    marginBottom: '20px',
  };

  const sectionHeaderStyle = {
    borderBottom: '2px solid #eee',
    marginBottom: '15px',
    paddingBottom: '10px',
  };

  const listItemStyle = {
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '4px',
    backgroundColor: '#fff',
    cursor: 'pointer',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  };

  const inputStyle = {
    width: '100%',
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  };

  const buttonStyle = {
    padding: '10px 15px',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: '#007BFF',
    color: '#fff',
    cursor: 'pointer',
  };

  // TicketList Component: lists tickets
  const TicketList = ({ onSelect, updated }) => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      const fetchTickets = async () => {
        try {
          const response = await axios.get('http://localhost:8080/rest/ticket');
          setTickets(response.data);
          setLoading(false);
        } catch (err) {
          setError(err.message || 'Failed to fetch tickets.');
          setLoading(false);
        }
      };
      fetchTickets();
    }, [updated]);

    if (loading) return <p>Loading tickets...</p>;
    if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

    return (
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {tickets.map((ticket) => (
          <li
            key={ticket.id}
            style={listItemStyle}
            onClick={() => onSelect(ticket.id)}
          >
            {ticket.text} (Price: {ticket.price}, Quantity: {ticket.quantity})
          </li>
        ))}
      </ul>
    );
  };

  // TicketDetail Component: displays details for a selected ticket
  const TicketDetail = ({ ticketId }) => {
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      const fetchTicket = async () => {
        try {
          const response = await axios.get(`http://localhost:8080/rest/ticket/${ticketId}`);
          setTicket(response.data);
          setLoading(false);
        } catch (err) {
          setError(err.message || `Failed to fetch ticket with ID ${ticketId}.`);
          setLoading(false);
        }
      };

      if (ticketId) {
        fetchTicket();
      } else {
        setLoading(false);
      }
    }, [ticketId]);

    if (!ticketId) return <p>Please select a ticket to view details.</p>;
    if (loading) return <p>Loading ticket details...</p>;
    if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;
    if (!ticket) return <p>Ticket not found.</p>;

    return (
      <div>
        <h3>{ticket.text}</h3>
        <p>
          <strong>Price:</strong> {ticket.price}
        </p>
        <p>
          <strong>Quantity:</strong> {ticket.quantity}
        </p>
        <p>
          <strong>Description:</strong> {ticket.description}
        </p>
      </div>
    );
  };

  // TicketForm Component: handles adding/updating tickets
  const TicketForm = ({ onSubmit, initialValues }) => {
    const [formData, setFormData] = useState(
      initialValues || { text: '', price: '', quantity: '', description: '' }
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
          ? `http://localhost:8080/rest/ticket/${initialValues.id}`
          : 'http://localhost:8080/rest/ticket';
        const method = initialValues?.id ? 'put' : 'post';

        const response = await axios[method](url, formData);
        onSubmit(response.data);
        setFormData({ text: '', price: '', quantity: '', description: '' });
      } catch (err) {
        setError(err.message || 'Failed to submit ticket.');
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <form onSubmit={handleSubmit}>
        {error && <p style={{ color: 'red' }}>Error: {error}</p>}
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="text" style={{ display: 'block', marginBottom: '5px' }}>
            Text:
          </label>
          <input
            type="text"
            id="text"
            name="text"
            value={formData.text}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="price" style={{ display: 'block', marginBottom: '5px' }}>
            Price:
          </label>
          <input
            type="text"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="quantity" style={{ display: 'block', marginBottom: '5px' }}>
            Quantity:
          </label>
          <input
            type="text"
            id="quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="description" style={{ display: 'block', marginBottom: '5px' }}>
            Description:
          </label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>
        <button type="submit" disabled={isSubmitting} style={buttonStyle}>
          {isSubmitting ? 'Submitting...' : initialValues?.id ? 'Update Ticket' : 'Add Ticket'}
        </button>
      </form>
    );
  };

  // DeleteTicket Component: deletes a ticket
  const DeleteTicket = ({ ticketId, onDelete }) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState(null);

    const handleDelete = async () => {
      setIsDeleting(true);
      setError(null);
      try {
        await axios.delete(`http://localhost:8080/rest/ticket/${ticketId}`);
        onDelete();
      } catch (err) {
        setError(err.message || `Failed to delete ticket with ID ${ticketId}.`);
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
          {isDeleting ? 'Deleting...' : 'Delete Ticket'}
        </button>
      </div>
    );
  };

  return (
    <div style={containerStyle}>
      <h1 style={headerStyle}>Tickets</h1>
      <div style={flexContainer}>
        <div style={sectionStyle}>
          <h2 style={sectionHeaderStyle}>Ticket List</h2>
          <TicketList onSelect={handleTicketSelect} updated={ticketsUpdated} />
        </div>
        <div style={sectionStyle}>
          <h2 style={sectionHeaderStyle}>Ticket Details</h2>
          <TicketDetail ticketId={selectedTicketId} />
          {selectedTicketId && (
            <DeleteTicket ticketId={selectedTicketId} onDelete={handleTicketDelete} />
          )}
        </div>
        <div style={sectionStyle}>
          <h2 style={sectionHeaderStyle}>Add/Update Ticket</h2>
          <TicketForm
            onSubmit={handleTicketSubmit}
            initialValues={selectedTicketId ? { id: selectedTicketId } : null}
          />
        </div>
      </div>
    </div>
  );
}

export default Ticket;
