import requests

url = 'https://places.googleapis.com/v1/places:searchText'
headers = {
    'Content-Type': 'application/json',
    'X-Goog-Api-Key': 'AIzaSyDLbsEteD1XnMvDNRdXHOgGWlxHTSIT9I4',
    'X-Goog-FieldMask': 'places.id,places.displayName,places.photos,places.reviews,places.userRatingCount'
}
data = {
    'textQuery': 'Vanguard Senior Care Centre (Woodlands) Woodlands Rise 737749'
}

response = requests.post(url, headers=headers, json=data)

res = response.json()

# Define a parser function
def parse_google_map_response(data):
    places_data = []
    
    for place in data.get('places', []):
        place_info = {
            'place_id': place.get('id'),
            'display_name': place.get('displayName', {}).get('text'),
            'rating_count': place.get('userRatingCount'),
            'reviews': [],
            'photos': []
        }
        
        # Parse reviews
        for review in place.get('reviews', []):
            review_info = {
                'author': review.get('authorAttribution', {}).get('displayName'),
                'rating': review.get('rating'),
                'review_text': review.get('text', {}).get('text'),
                'relative_time': review.get('relativePublishTimeDescription'),
                'publish_time': review.get('publishTime'),
                'author_photo': review.get('authorAttribution', {}).get('photoUri'),
                'author_uri': review.get('authorAttribution', {}).get('uri')
            }
            place_info['reviews'].append(review_info)
        
        # Parse photos
        for photo in place.get('photos', []):
            photo_info = {
                'photo_name': photo.get('name'),
                'width': photo.get('widthPx'),
                'height': photo.get('heightPx'),
            }
            place_info['photos'].append(photo_info)
        
        places_data.append(place_info)
    
    return places_data

# Parse the response
parsed_data = parse_google_map_response(res)

# Print the parsed data
for place in parsed_data:
    print(f"Place ID: {place['place_id']}")
    print(f"Display Name: {place['display_name']}")
    print(f"Rating Count: {place['rating_count']}\n")
    
    print("Reviews:")
    for review in place['reviews']:
        print(f" - Author: {review['author']}, Rating: {review['rating']}")
        print(f"   Review: {review['review_text']}")
        print(f"   Published: {review['relative_time']}")
        print(f"   Author URI: {review['author_uri']}")
        print(f"   Author Photo: {review['author_photo']}\n")
    
    print("Photos:")
    for photo in place['photos']:
        print(f" - Photo Name: {photo['photo_name']}, Size: {photo['width']}x{photo['height']}")
    print("\n")