import os
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin

# URL of the page to scrape
url = 'https://www.dementiahub.sg/resources/'

# Folder to save the downloaded PDFs
download_folder = 'pdf'

# Create the folder if it doesn't exist
if not os.path.exists(download_folder):
    os.makedirs(download_folder)

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
}

# Fetch the webpage content
response = requests.get(url, headers=headers)

# Check if the request was successful
if response.status_code == 200:
    soup = BeautifulSoup(response.content, 'html.parser')
    
    # Find all anchor tags with links ending in .pdf
    pdf_links = soup.find_all('a', href=lambda href: href and href.endswith('.pdf'))
    
    for link in pdf_links:
        pdf_url = urljoin(url, link['href'])  # Construct the full URL
        pdf_name = os.path.join(download_folder, pdf_url.split('/')[-1])  # Extract file name
        
        # Download the PDF
        pdf_response = requests.get(pdf_url, headers=headers)
        
        if pdf_response.status_code == 200:
            with open(pdf_name, 'wb') as pdf_file:
                pdf_file.write(pdf_response.content)
                print(f"Downloaded: {pdf_name}")
        else:
            print(f"Failed to download: {pdf_url} Status code: {pdf_response.status_code}")
else:
    print(f"Failed to retrieve the webpage. Status code: {response.status_code}")
