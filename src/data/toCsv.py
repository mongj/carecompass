import json
import csv

# Load the JSON data from a file
with open('raw.json', 'r', encoding='utf-8') as json_file:
    data = json.load(json_file)

# Define the CSV file header
csv_header = [
    "friendlyId", "buildingName", "email", "lat", "lng", "name", "operatingHours",
    "phone", "postalCode", "streetName", "unitNo", "website", "availability",
    "block", "about", "price", "dropoffPickupAvailability", "googleReviews", "distanceFromHome"
]

# Create and write to the CSV file
with open('daycare_centres.csv', 'w', newline='', encoding='utf-8') as csv_file:
    writer = csv.DictWriter(csv_file, fieldnames=csv_header)

    # Write the header
    writer.writeheader()

    # Write each record in the JSON array to the CSV
    for centre in data:
        writer.writerow({
            "friendlyId": centre.get("friendlyId", ""),
            "buildingName": centre.get("buildingName", ""),
            "email": centre.get("email", ""),
            "lat": centre.get("lat", ""),
            "lng": centre.get("lng", ""),
            "name": centre.get("name", ""),
            "operatingHours": ", ".join(centre.get("operatingHours", [])),
            "phone": centre.get("phone", ""),
            "postalCode": centre.get("postalCode", ""),
            "streetName": centre.get("streetName", ""),
            "unitNo": centre.get("unitNo", ""),
            "website": centre.get("website", ""),
            "availability": centre.get("availability", ""),
            "block": centre.get("block", ""),
            "about": centre.get("about", ""),
            "price": centre.get("price", ""),
            "dropoffPickupAvailability": ", ".join(centre.get("dropoffPickupAvailability", [])),
            "googleReviews": centre.get("googleReviews", ""),
            "distanceFromHome": centre.get("distanceFromHome", "")
        })

print("CSV file 'daycare_centres.csv' has been created successfully.")
