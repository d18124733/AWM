// LAB work for gis_frontend, not used for world app

const fetchData = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/v1/Counties/', {
        headers: {
          Accept: 'application/json',
          'X-Requested-With': 'XMLHttpRequest', 
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
  
      const container = document.getElementById('data-container');
      container.innerHTML = ''; 
  
      data.forEach((item) => {
        const listItem = document.createElement('div');
        listItem.innerHTML = `<p>${item.name_tag}</p>
                              <p>${item.area}</p>
                              <p>${item.latitude}</p>
                              <p>${item.longitude}</p>
                              <p>${item.geom}</p>`;
        container.appendChild(listItem);
      });
    } catch (error) {
      console.error('Error fetching counties:', error);
      alert('Failed to fetch counties. Check the console for details.');
    }
  };
  
  document.addEventListener('DOMContentLoaded', () => {
    fetchData();
  });
  