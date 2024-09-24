import json
import random

# Function to generate random price and dropoff/pickup options
def transform_data(data):
    transformed = []
    for center in data:
        transformed_center = {
            "friendlyId": center["friendlyId"],
            "buildingName": center["buildingName"] if center["buildingName"] else None,
            "email": center["email"] if center["email"] else None,
            "lat": center["lat"],
            "lng": center["lng"],
            "name": center["name"],
            "operatingHours": center["operatingHours"],
            "phone": center["phone"],
            "postalCode": center["postalCode"],
            "streetName": center["streetName"],
            "unitNo": center["unitNo"] if center["unitNo"] else None,
            "website": center["website"] if center["website"] else None,
            "availability": center["availability"],
            "block": center["block"] if center["block"] else None,
            "about": center["about"] if center["about"] else "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            "price": round(random.uniform(20, 300) / 10) * 10,  # Random price between 20 and 300, rounded to nearest 10
            "dropoffPickupAvailability": random.sample(["Pickup", "Dropoff"], random.randint(1, 2)),  # Random choice of Pickup, Dropoff, or both
            "googleReviews": round(random.uniform(3, 5), 1),
            "distanceFromHome": round(random.uniform(1, 20))
        }
        transformed.append(transformed_center)
    return transformed

# Load the data from file
with open("raw.json") as f:
    data = json.load(f)

# Parse and transform the data
parsed_data = transform_data(data)

# Output the transformed data
with open("ddc.json", "w") as f:
    json.dump(parsed_data, f, indent=4)