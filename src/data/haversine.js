// function haversineDistance(lat1, lon1, lat2, lon2) {
//   // Convert degrees to radians
//   function toRad(value) {
//       return value * Math.PI / 180;
//   }

//   const R = 6371; // Radius of the Earth in kilometers
//   const dLat = toRad(lat2 - lat1);
//   const dLon = toRad(lon2 - lon1);
//   const a = Math.pow(Math.sin(dLat / 2), 2) + 
//             Math.pow(Math.sin(dLon / 2), 2) * 
//             Math.cos(lat1) * 
//             Math.cos(lat2);
//   const c = 2 * Math.asin(Math.sqrt(a));

//   return parseFloat((R * c).toFixed(1)); // Distance in kilometers
// }

function haversineDistance(lat1, lon1, lat2, lon2) {
  function toRad(value) {
      return value * Math.PI / 180;
  }

  const R = 6371; // Radius of the Earth in kilometers
  const c = Math.acos((Math.sin(toRad(lat1)) * Math.sin(toRad(lat2))) + 
                      (Math.cos(toRad(lat1)) * Math.cos(toRad(lat2))) * 
                      (Math.cos(toRad(lon2) - toRad(lon1))))

  return parseFloat((R * c).toFixed(4)); // Distance in kilometers
}



const lat1 = 1.31245345250019
const lon1 = 103.93815560014
const lat2 = 1.34967446991628
const lon2 = 103.711680539382
console.log(haversineDistance(lat1, lon1, lat2, lon2));