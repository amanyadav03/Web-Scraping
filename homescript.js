        document.addEventListener('DOMContentLoaded', function(){
            const togglebutton = document.querySelector('.toggle-button');
            const navbar= document.getElementById('navbar');
            togglebutton.addEventListener('click',function(){
                navbar.classList.togglebutton('active');
            });
        });
// Function to download the fetched data as a text file
function downloadData() {
  const resultElement = document.getElementById("result");
  const downloadLink = document.createElement("a");
  downloadLink.href = "data:text/plain;charset=utf-8," + encodeURIComponent(JSON.stringify(window.fetchedData));
  downloadLink.download = "data.txt";

  // Trigger a download of the fetched data
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  window.fetchedData=null
}

// Function to fetch data from the server
async function fetchData() {
  const url = document.getElementById("url-area").value;
  try {
    const response = await fetch(`http://127.0.0.1:5000/scrape?url=${encodeURIComponent(url)}`, { mode: 'cors' });

    // Check if the response is successful
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Parse the response as JSON
    const data = await response.json();
    displayData(data);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Function to display the fetched data on the web page
function displayData(data) {
  const resultElement = document.getElementById("result");
  resultElement.value = JSON.stringify(data, null, 2);
  window.fetchedData=data;
}

// Add event listener to the scrape button
document
  .getElementById("scrape-button")
  .addEventListener("click", fetchData);

// Add event listener to the download button
document
  .getElementById("down")
  .addEventListener("click", downloadData); 
