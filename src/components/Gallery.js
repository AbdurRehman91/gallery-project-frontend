// Gallery.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [sortBy, setSortBy] = useState('');
  const [filterBy, setFilterBy] = useState('');

  useEffect(() => {
    const apiUrl = filterBy ? `http://127.0.0.1:8000/api/images//?category=${filterBy}`
      : 'http://127.0.0.1:8000/api/images/';
    axios.get(apiUrl,
    {headers: {'Content-Type': 'application/json'}}).then(response => {
        setImages(response.data);
      })
      .catch(error => {
        console.error('Error fetching images:', error);
      });
    }, []);
  
    const handleSortChange = (event) => {
      setSortBy(event.target.value);
    };
    const handleFilterChange = (event) => {
      setFilterBy(event.target.value);
    };
    
    const filteredImages = images
    .filter(image => filterBy === '' || image.category === filterBy)
    .sort((a, b) => {
      switch (sortBy) {
        case 'titleAsc':
          return a.title.localeCompare(b.title);
        case 'titleDesc':
          return b.title.localeCompare(a.title);
        case 'createdAtAsc':
          return new Date(a.created_at?.$date) - new Date(b.created_date?.$date);
        case 'createdAtDesc':
          return new Date(b.created_at?.$date) - new Date(a.created_at?.$date);
        default:
          return 0;
      }
    });
  return (
    <div className="gallery">
      <div className="sidebar">
        <h2>Filter & Sort</h2>
        {/* Filter options */}
        <label>Filter by Category:</label>
        <select value={filterBy} onChange={handleFilterChange}>
          <option value="">All</option>
          <option value="nature">Nature</option>
          <option value="social">Social</option>
        </select>

        {/* Sort options */}
        <label>Sort by Title:</label>
      <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
        <option value="">None</option>
        <option value="titleAsc">A-Z</option>
        <option value="titleDesc">Z-A</option>
      </select>

      <label>Sort by Date:</label>
      <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
        <option value="">None</option>
        <option value="createdAtAsc">Oldest First</option>
        <option value="createdAtDesc">Newest First</option>
      </select>
      </div>
        <div className="gallery-container">
          {filteredImages.map(image => {
            const key = image._id.$oid;
            return (
              <div key={key} className="gallery-item">
                <img src={image.url} alt={image.title} />
                <p>{image.title}</p>
              </div>
            )

          })}
      </div>
      
    </div>
  );
};

export default Gallery;
