import requests
from bs4 import BeautifulSoup
import re
import json
from datetime import datetime
import time

class WordPressAPIScraper:
    def __init__(self, base_url):
        self.base_url = base_url
        self.posts_endpoint = f"{base_url}/wp-json/wp/v2/posts"
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }

    def clean_text(self, text):
        # Remove extra whitespace and newlines
        text = re.sub(r'\s+', ' ', text)
        # Remove special characters but keep basic punctuation
        text = re.sub(r'[^\w\s.,!?-]', '', text)
        return text.strip()

    def extract_text_from_html(self, html_content):
        # Create BeautifulSoup object
        soup = BeautifulSoup(html_content, 'html.parser')
        
        # Find all text elements
        text_elements = soup.stripped_strings
        
        # Join all text elements and clean
        extracted_text = ' '.join(text_elements)
        cleaned_text = self.clean_text(extracted_text)
        
        return cleaned_text

    def fetch_posts(self, page=1, per_page=10):
        """
        Fetch posts from WordPress API with pagination
        """
        params = {
            'page': page,
            'per_page': per_page,
            '_embed': 1  # Include embedded content like featured media
        }
        
        try:
            response = requests.get(
                self.posts_endpoint,
                headers=self.headers,
                params=params
            )
            response.raise_for_status()
            
            # Get total pages from headers
            total_pages = int(response.headers.get('X-WP-TotalPages', 1))
            
            return response.json(), total_pages
            
        except requests.RequestException as e:
            print(f"Error fetching posts: {e}")
            return None, 0

    def process_posts(self, start_page=1, max_pages=None):
        """
        Process all posts and extract cleaned content
        """
        processed_posts = []
        current_page = start_page
        total_pages = None
        
        while True:
            print(f"Fetching page {current_page}...")
            posts, total_pages = self.fetch_posts(page=current_page)
            
            if not posts:
                break
                
            for post in posts:
                processed_post = {
                    'id': post.get('id'),
                    'date': post.get('date'),
                    'modified': post.get('modified'),
                    'type': post.get('type'),
                    'title': post.get('title', {}).get('rendered', ''),
                    'slug': post.get('slug'),
                    'link': post.get('link'),
                    'cleaned_content': self.extract_text_from_html(
                        post.get('content', {}).get('rendered', '')
                    ),
                    'excerpt': post.get('excerpt', {}).get('rendered', ''),
                    'author': post.get('author', 0),
                    'featured_media': post.get('featured_media', 0),
                }
                processed_posts.append(processed_post)
            
            if max_pages and current_page >= max_pages:
                break
                
            if current_page >= total_pages:
                break
                
            current_page += 1
            time.sleep(1)  # Be nice to the API
            
        return processed_posts

    def save_to_file(self, processed_posts, output_file):
        """
        Save processed posts to a JSON file
        """
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(processed_posts, f, ensure_ascii=False, indent=2)

def main():
    # Initialize scraper
    base_url = "https://www.dementiahub.sg"
    scraper = WordPressAPIScraper(base_url)
    
    processed_posts = scraper.process_posts(max_pages=5)
    
    # Generate timestamp for filename
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    
    # Save results
    scraper.save_to_file(processed_posts, f'wordpress_posts_{timestamp}.json')
    
    # Print summary
    print(f"\nProcessed {len(processed_posts)} posts")
    print(f"Results saved to wordpress_posts_{timestamp}.json")
    

if __name__ == "__main__":
    main()