async function fetchUpcomingDates() {
    try {
        const response = await fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vQXQR7xd5Srf1TD5c5oe2dFyShgze3cFIbnBUo3RlWMHM8gc-VSposbH0v4XbH5Pge6TKc3GEgV7Q9a/pub?gid=0&single=true&output=csv');
        const data = await response.text();
        const rows = data.split('\n').map(row => row.split(','));
        
        // Remove header row
        rows.shift();
        
        // Sort by date
        rows.sort((a, b) => new Date(b[0]) - new Date(a[0]));
        
        // Create table HTML
        const tableBody = document.getElementById('upcoming-dates-body');
        tableBody.innerHTML = '';
        
        rows.forEach(row => {
            const date = new Date(row[0]);
            const formattedDate = date.toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric'
            });
            
            const tr = document.createElement('tr');
            const statusClass = row[1].toLowerCase().includes('closed') ? 'status-closed' : 
                              row[1].toLowerCase().includes('tournament') ? 'status-special' : 'status-open';
            
            tr.innerHTML = `
                <td>${formattedDate}</td>
                <td class="${statusClass}">${row[1]}</td>
                <td>${row[2] || ''}</td>
            `;
            tableBody.appendChild(tr);
        });
    } catch (error) {
        console.error('Error fetching calendar data:', error);
        document.getElementById('upcoming-dates').innerHTML = '<p>Unable to load calendar data. Please check back later.</p>';
    }
}

// Fetch data initially and every 5 minutes
fetchUpcomingDates();
setInterval(fetchUpcomingDates, 300000);