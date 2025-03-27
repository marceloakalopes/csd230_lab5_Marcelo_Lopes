import { useState, useEffect } from 'react';
import axios from 'axios';

function DiscMag() {
  const [selectedDiscMagId, setSelectedDiscMagId] = useState(null);
  const [discMagsUpdated, setDiscMagsUpdated] = useState(false);

  const handleDiscMagSelect = (id) => {
    setSelectedDiscMagId(id);
  };

  const handleDiscMagSubmit = (newDiscMag) => {
    setDiscMagsUpdated(!discMagsUpdated);
  };

  const handleDiscMagDelete = () => {
    setSelectedDiscMagId(null);
    setDiscMagsUpdated(!discMagsUpdated);
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
  };

  const sectionStyle = {
    flex: '1',
    padding: '20px',
    borderRadius: '8px',
    backgroundColor: '#fdfdfd',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
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
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  };

  const buttonStyle = {
    padding: '10px 15px',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: '#007BFF',
    color: '#fff',
    cursor: 'pointer',
  };

  // DiscMagList Component: displays all DiscMags in a list
  const DiscMagList = ({ onSelect, updated }) => {
    const [discMags, setDiscMags] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      const fetchDiscMags = async () => {
        try {
          const response = await axios.get('http://localhost:8080/rest/discMag');
          setDiscMags(response.data);
          setLoading(false);
        } catch (err) {
          setError(err.message || 'Failed to fetch discMags.');
          setLoading(false);
        }
      };

      fetchDiscMags();
    }, [updated]);

    if (loading) return <p>Loading discMags...</p>;
    if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

    return (
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {discMags.map((discMag) => (
          <li
            key={discMag.id}
            style={listItemStyle}
            onClick={() => onSelect(discMag.id)}
          >
            {discMag.title} (Has Disc: {discMag.hasDisc ? 'Yes' : 'No'})
          </li>
        ))}
      </ul>
    );
  };

  // DiscMagDetail Component: shows the details of a selected DiscMag
  const DiscMagDetail = ({ discMagId }) => {
    const [discMag, setDiscMag] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      const fetchDiscMag = async () => {
        try {
          const response = await axios.get(`http://localhost:8080/rest/discMag/${discMagId}`);
          setDiscMag(response.data);
          setLoading(false);
        } catch (err) {
          setError(err.message || `Failed to fetch discMag with ID ${discMagId}.`);
          setLoading(false);
        }
      };

      if (discMagId) {
        fetchDiscMag();
      } else {
        setLoading(false);
      }
    }, [discMagId]);

    if (!discMagId) return <p>Please select a DiscMag to view details.</p>;
    if (loading) return <p>Loading discMag details...</p>;
    if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;
    if (!discMag) return <p>DiscMag not found.</p>;

    return (
      <div>
        <h3>{discMag.title}</h3>
        <p>
          <strong>Has Disc:</strong> {discMag.hasDisc ? 'Yes' : 'No'}
        </p>
        <p>
          <strong>Description:</strong> {discMag.description}
        </p>
      </div>
    );
  };

  // DiscMagForm Component: handles add/update operations
  const DiscMagForm = ({ onSubmit, initialValues }) => {
    const [formData, setFormData] = useState(
      initialValues || { title: '', hasDisc: false, description: '' }
    );
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
      if (initialValues) {
        setFormData(initialValues);
      }
    }, [initialValues]);

    const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsSubmitting(true);
      setError(null);

      try {
        const url = initialValues?.id
          ? `http://localhost:8080/rest/discMag/${initialValues.id}`
          : 'http://localhost:8080/rest/discMag';
        const method = initialValues?.id ? 'put' : 'post';

        const response = await axios[method](url, formData);
        onSubmit(response.data);
        setFormData({ title: '', hasDisc: false, description: '' });
      } catch (err) {
        setError(err.message || 'Failed to submit discMag.');
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
              border: '1px solid #ccc',
            }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="hasDisc" style={{ display: 'block', marginBottom: '5px' }}>
            Has Disc:
          </label>
          <input
            type="checkbox"
            id="hasDisc"
            name="hasDisc"
            checked={formData.hasDisc}
            onChange={handleChange}
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
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ccc',
            }}
          />
        </div>
        <button type="submit" disabled={isSubmitting} style={buttonStyle}>
          {isSubmitting ? 'Submitting...' : initialValues?.id ? 'Update DiscMag' : 'Add DiscMag'}
        </button>
      </form>
    );
  };

  // DeleteDiscMag Component: deletes a DiscMag and notifies the parent
  const DeleteDiscMag = ({ discMagId, onDelete }) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState(null);

    const handleDelete = async () => {
      setIsDeleting(true);
      setError(null);
      try {
        await axios.delete(`http://localhost:8080/rest/discMag/${discMagId}`);
        onDelete();
      } catch (err) {
        setError(err.message || `Failed to delete discMag with ID ${discMagId}.`);
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
          {isDeleting ? 'Deleting...' : 'Delete DiscMag'}
        </button>
      </div>
    );
  };

  return (
    <div style={containerStyle}>
      <h1 style={headerStyle}>DiscMag</h1>
      <div style={flexContainer}>
        <div style={sectionStyle}>
          <h2 style={sectionHeaderStyle}>DiscMag List</h2>
          <DiscMagList onSelect={handleDiscMagSelect} updated={discMagsUpdated} />
        </div>
        <div style={sectionStyle}>
          <h2 style={sectionHeaderStyle}>DiscMag Details</h2>
          <DiscMagDetail discMagId={selectedDiscMagId} />
          {selectedDiscMagId && (
            <DeleteDiscMag discMagId={selectedDiscMagId} onDelete={handleDiscMagDelete} />
          )}
        </div>
        <div style={sectionStyle}>
          <h2 style={sectionHeaderStyle}>Add/Update DiscMag</h2>
          <DiscMagForm
            onSubmit={handleDiscMagSubmit}
            initialValues={selectedDiscMagId ? { id: selectedDiscMagId } : null}
          />
        </div>
      </div>
    </div>
  );
}

export default DiscMag;
