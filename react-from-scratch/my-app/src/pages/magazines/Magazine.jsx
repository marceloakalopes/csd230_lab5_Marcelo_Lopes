import { useState, useEffect } from 'react';
import axios from 'axios';

function Magazine() {
  const [selectedMagazineId, setSelectedMagazineId] = useState(null);
  const [magazinesUpdated, setMagazinesUpdated] = useState(false);

  const handleMagazineSelect = (id) => {
    setSelectedMagazineId(id);
  };

  const handleMagazineSubmit = (newMagazine) => {
    setMagazinesUpdated(!magazinesUpdated);
  };

  const handleMagazineDelete = () => {
    setSelectedMagazineId(null);
    setMagazinesUpdated(!magazinesUpdated);
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
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
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

  // MagazineList Component: displays all magazines in a list
  const MagazineList = ({ onSelect, updated }) => {
    const [magazines, setMagazines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      const fetchMagazines = async () => {
        try {
          const response = await axios.get('http://localhost:8080/rest/magazine');
          setMagazines(response.data);
          setLoading(false);
        } catch (err) {
          setError(err.message || 'Failed to fetch magazines.');
          setLoading(false);
        }
      };

      fetchMagazines();
    }, [updated]);

    if (loading) return <p>Loading magazines...</p>;
    if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

    return (
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {magazines.map((magazine) => (
          <li
            key={magazine.id}
            style={listItemStyle}
            onClick={() => onSelect(magazine.id)}
          >
            {magazine.title} (Issue: {magazine.currIssue})
          </li>
        ))}
      </ul>
    );
  };

  // MagazineDetail Component: shows details of a selected magazine
  const MagazineDetail = ({ magazineId }) => {
    const [magazine, setMagazine] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      const fetchMagazine = async () => {
        try {
          const response = await axios.get(`http://localhost:8080/rest/magazine/${magazineId}`);
          setMagazine(response.data);
          setLoading(false);
        } catch (err) {
          setError(err.message || `Failed to fetch magazine with ID ${magazineId}.`);
          setLoading(false);
        }
      };

      if (magazineId) {
        fetchMagazine();
      } else {
        setLoading(false);
      }
    }, [magazineId]);

    if (!magazineId) return <p>Please select a magazine to view details.</p>;
    if (loading) return <p>Loading magazine details...</p>;
    if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;
    if (!magazine) return <p>Magazine not found.</p>;

    return (
      <div>
        <h3>{magazine.title}</h3>
        <p>
          <strong>Current Issue:</strong> {magazine.currIssue}
        </p>
        <p>
          <strong>Description:</strong> {magazine.description}
        </p>
      </div>
    );
  };

  // MagazineForm Component: handles add/update operations
  const MagazineForm = ({ onSubmit, initialValues }) => {
    const [formData, setFormData] = useState(
      initialValues || { title: '', currIssue: '', description: '' }
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
          ? `http://localhost:8080/rest/magazine/${initialValues.id}`
          : 'http://localhost:8080/rest/magazine';
        const method = initialValues?.id ? 'put' : 'post';

        const response = await axios[method](url, formData);
        onSubmit(response.data);
        setFormData({ title: '', currIssue: '', description: '' });
      } catch (err) {
        setError(err.message || 'Failed to submit magazine.');
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
            style={inputStyle}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="currIssue" style={{ display: 'block', marginBottom: '5px' }}>
            Current Issue:
          </label>
          <input
            type="text"
            id="currIssue"
            name="currIssue"
            value={formData.currIssue}
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
          {isSubmitting ? 'Submitting...' : initialValues?.id ? 'Update Magazine' : 'Add Magazine'}
        </button>
      </form>
    );
  };

  // DeleteMagazine Component: deletes a magazine and notifies the parent
  const DeleteMagazine = ({ magazineId, onDelete }) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState(null);

    const handleDelete = async () => {
      setIsDeleting(true);
      setError(null);
      try {
        await axios.delete(`http://localhost:8080/rest/magazine/${magazineId}`);
        onDelete();
      } catch (err) {
        setError(err.message || `Failed to delete magazine with ID ${magazineId}.`);
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
          {isDeleting ? 'Deleting...' : 'Delete Magazine'}
        </button>
      </div>
    );
  };

  return (
    <div style={containerStyle}>
      <h1 style={headerStyle}>Magazine</h1>
      <div style={flexContainer}>
        <div style={sectionStyle}>
          <h2 style={sectionHeaderStyle}>Magazine List</h2>
          <MagazineList onSelect={handleMagazineSelect} updated={magazinesUpdated} />
        </div>
        <div style={sectionStyle}>
          <h2 style={sectionHeaderStyle}>Magazine Details</h2>
          <MagazineDetail magazineId={selectedMagazineId} />
          {selectedMagazineId && (
            <DeleteMagazine magazineId={selectedMagazineId} onDelete={handleMagazineDelete} />
          )}
        </div>
        <div style={sectionStyle}>
          <h2 style={sectionHeaderStyle}>Add/Update Magazine</h2>
          <MagazineForm
            onSubmit={handleMagazineSubmit}
            initialValues={selectedMagazineId ? { id: selectedMagazineId } : null}
          />
        </div>
      </div>
    </div>
  );
}

export default Magazine;
