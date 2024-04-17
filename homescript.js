document.addEventListener('DOMContentLoaded', function(){
  const toggleButton = document.getElementById('toggle-button');
  const navbar = document.getElementById('navbar');
  toggleButton.addEventListener('click', function(){
      navbar.classList.toggle('active');
  });
});

// Function to download the fetched data as a text file
function downloadData(content_type) {
  const resultElement = document.getElementById("result");
  const downloadLink = document.createElement("a");
  if (content_type === 'html') {
      downloadLink.href = "data:text/plain;charset=utf-8," + encodeURIComponent(resultElement.value);
  } else {
      downloadLink.href = "data:text/plain;charset=utf-8," + encodeURIComponent(JSON.stringify(JSON.parse(resultElement.value), null, 2));
  }
  downloadLink.download = "data.txt";
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}

// Function to fetch data from the server
async function fetchData(url, content_type) {
  try {
      const response = await fetch(`http://127.0.0.1:5000/scrape?url=${encodeURIComponent(url)}&content_type=${content_type}`, { mode: 'cors' });

      // Check if the response is successful
      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Parse the response as JSON
      const data = await response.json();
      displayData(data, content_type);
  } catch (error) {
      console.error("Error fetching data:", error);
  }
}

// Function to display the fetched data on the web page
function displayData(data, content_type) {
  const resultElement = document.getElementById("result");
  if (content_type === 'text') {
      resultElement.value = data.text_content;
  } else if (content_type === 'titles' || content_type == 'headings' ) {
      resultElement.value = data.titles.join('\n');
  } else if (content_type === 'paragraphs') {
      resultElement.value = data.paragraphs.join('\n\n');
  } else if (content_type === 'html') {
      resultElement.value = data.html_content;
  } else {
      resultElement.value = JSON.stringify(data, null, 2);
  }
}

// Add event listener to the scrape-button
document
.getElementById("search-button")
.addEventListener("click", function() {
  const url = document.getElementById('url-area').value;
  const contentType = document.getElementById('content-type').value;
  fetchData(url, contentType);
});

// Add event listener to the download-button
document
.getElementById("download-text")
.addEventListener("click", function() {
  downloadData('html');
});
