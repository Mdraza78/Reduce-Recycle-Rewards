import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './LocationMap.css';

const fixedLocationsMP = [
  { name: 'Indore', latitude: 22.7196, longitude: 75.8577, address: 'Nagar Nigam Office, MG Road, Indore, MP', mobile: '+91 7440440103' },
  { name: 'Bhopal', latitude: 23.2599, longitude: 77.4126, address: 'Municipal Office, TT Nagar, Bhopal, MP', mobile: '+91-755-2701222' },
  { name: 'Gwalior', latitude: 26.2183, longitude: 78.1828, address: 'Nagar Nigam Office, City Center, Gwalior, MP', mobile: '0751-2438300' },
  { name: 'Jabalpur', latitude: 23.1815, longitude: 79.9864, address: 'Civic Center, Wright Town, Jabalpur, MP', mobile: '076126 11611' },
  { name: 'Ujjain', latitude: 23.1793, longitude: 75.7849, address: 'Municipal Corporation, Freeganj, Ujjain, MP', mobile: '0734-2535244' },
  { name: 'Sehore', latitude: 23.2048, longitude: 77.0822, address: 'Municipal Office, Main Road, Sehore, MP', mobile: '07564-234549' },
  { name: 'Sagar', latitude: 23.8315, longitude: 78.7378, address: 'Nagar Palika Office, Civil Lines, Sagar, MP', mobile: '07582-229454' },
  { name: 'Satna', latitude: 24.5822, longitude: 80.8248, address: 'Nagar Nigam Office, Rewa Road, Satna, MP', mobile: '18005724060' },
  { name: 'Chhindwara', latitude: 22.0574, longitude: 78.9382, address: 'Municipal Office, Parasia Road, Chhindwara, MP', mobile: '07162-222346' },
  { name: 'Shivpuri', latitude: 25.4358, longitude: 77.6642, address: 'Municipal Office, Court Road, Shivpuri, MP', mobile: '07492-233249' },
];

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const LocationMap = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [nearbyRecyclingUnits, setNearbyRecyclingUnits] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [highlightedRadius, setHighlightedRadius] = useState(null);
  const [locationRadius, setLocationRadius] = useState([0, 0]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
          setLocationRadius([latitude, longitude]);
        },
        (err) => setError(err.message)
      );
    } else {
      setError('Geolocation not supported');
    }
  }, []);

  useEffect(() => {
    if (location) {
      const nearbyUnits = fixedLocationsMP.filter((unit) => {
        const distance = calculateDistance(location.latitude, location.longitude, unit.latitude, unit.longitude);
        return distance <= 50; // Within 50 km
      });
      setNearbyRecyclingUnits(nearbyUnits);
    }
  }, [location]);

  const fontAwesomeMarker = (iconColor, isFlickering = false, size = 20) => 
    L.divIcon({
      html: `<i class="fa-solid fa-location-dot ${isFlickering ? 'flicker' : ''}" style="color: ${iconColor}; font-size: ${size}px;"></i>`,
      className: 'custom-icon',
    });

  const handleUnitClick = (unit) => {
    setSelectedUnit(unit);
    setHighlightedRadius([unit.latitude, unit.longitude]);
  };

  if (error) return <p>Error: {error}</p>;

  return (
    <div className="location-container">
      <h1>Your Location on the Map</h1>
      {location ? (
        <>
          <p>Your Latitude: {location.latitude}</p>
          <p>Your Longitude: {location.longitude}</p>
          <MapContainer
            center={[location.latitude, location.longitude]}
            zoom={6}
            style={{ height: '400px', width: '100%' }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Circle center={locationRadius} radius={50000} color="blue" fillColor="blue" fillOpacity={0.2} />
            {highlightedRadius && (
              <Circle center={highlightedRadius} radius={50000} color="green" fillColor="green" fillOpacity={0.2} />
            )}
            <Marker position={[location.latitude, location.longitude]} icon={fontAwesomeMarker('blue', true, 40)}>
              <Popup>Your location</Popup>
            </Marker>
            {fixedLocationsMP.map((loc, index) => (
              <Marker key={index} position={[loc.latitude, loc.longitude]} icon={fontAwesomeMarker('red')} eventHandlers={{ click: () => handleUnitClick(loc) }}>
                <Popup>{loc.name}</Popup>
              </Marker>
            ))}
          </MapContainer>
          <div className="recycling-units-container">
            <h2>Recycling Units within 50 km</h2>
            <ul>
              {nearbyRecyclingUnits.map((unit, index) => (
                <li
                  key={index}
                  onClick={() => handleUnitClick(unit)}
                  style={{
                    cursor: 'pointer',
                    color: selectedUnit === unit ? 'blue' : 'black',
                    fontWeight: selectedUnit === unit ? 'bold' : 'normal',
                  }}
                >
                  <div>
                    <strong>{unit.name} - (Garbage Unit)</strong>
                  </div>
                  <div>{unit.address}</div>
                  <div>
                    <a href={`tel:${unit.mobile}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      {unit.mobile}
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </>
      ) : (
        <p>Getting your location...</p>
      )}
    </div>
  );
};

export default LocationMap;