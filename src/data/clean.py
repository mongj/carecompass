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
            "priceNoTransport": round(random.uniform(20, 30)),
            "priceWithOneWayTransport": round(random.uniform(23, 31)),
            "priceWithTwoWayTransport": round(random.uniform(25, 33)),
            "dropoffPickupAvailability": random.sample(["Pickup", "Dropoff"], random.randint(1, 2)),  # Random choice of Pickup, Dropoff, or both
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