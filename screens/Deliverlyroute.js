import axios from 'axios';
import { Text,StyleSheet,View,TouchableOpacity,FlatList} from 'react-native';
import React, { useState, useCallback, useEffect } from 'react';
import MapboxGL from '@rnmapbox/maps';
import {  useNavigation,useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Geolocation from '@react-native-community/geolocation';
import { PermissionsAndroid } from 'react-native';
const token = 'sk.eyJ1IjoicmNubm9ueGlpMjU0NSIsImEiOiJjbG13NXVlNnYxNGJ5MmtwZW1vcXhuOHl2In0.SgazKeniv6PKJ3fnDP1QtQ';
MapboxGL.setConnected(true);
MapboxGL.setAccessToken(token);
MapboxGL.setTelemetryEnabled(false);
MapboxGL.setWellKnownTileServer('Mapbox');
const Deliverlyroute = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {Name,Longitude1,Latitude1,Licenseplate,Package} = route.params;
  const [userLocation, setUserLocation] = useState([Longitude1,Latitude1]);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [routeDirections, setrouteDirections] = useState(null)
  const [latitude,setlatitude] = useState(null);

  const [longitude,setlongitude] = useState(null);
  const [data1, setData1] = useState([]);
  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        getCurrentLocation();
      } else {
        console.log('Location permission denied');
      }
    } catch (error) {
      console.log('Error requesting location permission:', error);
    }
  };

  const getCurrentLocation = useCallback(() => {
    Geolocation.getCurrentPosition(
      position => {
        // console.log('Position:', position);
        const { longitude, latitude } = position.coords;
        setUserLocation([longitude,latitude])
      },
      error => {
        console.log(error.code, error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  }, []);
  useEffect(() => {
    requestLocationPermission();

    const watchId = Geolocation.watchPosition(
      position => {
        const { longitude, latitude } = position.coords;
        setUserLocation([longitude, latitude]);
        createRouterline(); // Call the function when the user's location changes
      },
      error => {
        console.log(error.code, error.message);
      },
      { enableHighAccuracy: true, distanceFilter: 10 }
    );

    return () => {
      Geolocation.clearWatch(watchId);
    };
  }, []);

  
  

  useEffect(() => {
    // Function to fetch data
    const fetchData = async () => {
      try {
        const response = await axios.post('http://13.236.182.88:8055/graphql', {
          query: `
            {
              Deliverly1 {
                Name
                Latitude
                Longitude
                id
              }
            }
          `
        });
        setData1(response.data.data.Deliverly1);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    // Fetch data initially
    fetchData();
  
    // Set interval to fetch data every 3 seconds
    const interval = setInterval(() => {
      fetchData();
    }, 3000);
    
    // Clear interval on component unmount to avoid memory leaks
    return () => clearInterval(interval);
  }, []);
  //  console.log(data1)
    const filteredData = data1.filter(item => item.Name === Name );
    const latestLocationData = {};

filteredData.forEach((item) => {
  const currentName = item.Name;

  if (!latestLocationData[currentName] || item.id > latestLocationData[currentName].id) {
    // ถ้าไม่มีข้อมูลสำหรับชื่อนี้ หรือ ข้อมูลที่มีอยู่มีค่า id น้อยกว่า id ในข้อมูลปัจจุบัน
    latestLocationData[currentName] = item;
  }
});

// latestLocationData object ตอนนี้เก็บข้อมูลที่มีชื่อตรงกับ Name และมีค่า id มากที่สุดสำหรับแต่ละชื่อใน filteredData array
  // console.log(userLocation)
  // console.log("last",latestLocationData)
  function makeRoute(coordinates) {
    let route = {
      type : 'FeatureCollection',
      features : [
        {
          type : 'Feature',
          properties : {},
          geometry : {
            type : 'LineString',
            coordinates : coordinates,
          },
        },
      ],
      };
      return route;
    }
    async function createRouterline(userLocation) {
        Object.values(latestLocationData).map(async (driver) => {
          const startCoords = `${driver.Longitude},${driver.Latitude}`;
          const endCoords = `${userLocation[0]},${userLocation[1]}`;
          const geometries = 'geojson';
          const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${startCoords};${endCoords}?alternatives=true&geometries=${geometries}&steps=true&banner_instructions=true&overview=full&voice_instructions=true&access_token=${token}`;
      
          
      
          try {
            let response = await fetch(url);
            let json = await response.json();
      
            if (json.routes && Array.isArray(json.routes)) {
              const calculatedDistance = (json.routes[0].distance / 1000).toFixed(1);
              const calculatedDurationInMinutes = (json.routes[0].duration / 60).toFixed(0);
              const calculatedDurationInHours = Math.floor(calculatedDurationInMinutes / 60);
              const remainingMinutes = calculatedDurationInMinutes % 60;
      
              // Assuming these functions are defined elsewhere in your code
              setDistance(calculatedDistance);
              if (calculatedDurationInHours > 0) {
                setDuration(`${calculatedDurationInHours} Hr ${remainingMinutes} min`);
              } else {
                setDuration(`${remainingMinutes} min`);
              }
      
              const coordinates = json.routes[0].geometry.coordinates;
              if (coordinates.length) {
                const route = makeRoute([...coordinates]);
                setrouteDirections(route);
              }
            } else {
              console.log("No routes found in the JSON response.");
            }
          } catch (error) {
            console.error("Error fetching or processing data:", error);
          }
        });
      }
      
    
      
  
    useEffect(() => {
        {Object.values(latestLocationData).map((driver) => (
            createRouterline(userLocation,driver.Longitude,driver.latitude)
            ))};
    });

    // console.log(filteredData)
    
  return (

      <View style={styles.container}>
          <MapboxGL.MapView 
          style={styles.map} 
          zoomEnabled = {true}
          styleURL='mapbox://styles/mapbox/streets-v12'
          rotateEnabled ={true}
          onDidFinishLoadingMap={async () => {
            await createRouterline(userLocation);
          }}>
          <MapboxGL.Camera
          zoomLevel={14}
          centerCoordinate={userLocation}
          pitch={68}
          animationMode={'flyTo'}
          animationDuration={6000}
          />
          {routeDirections && (
            <MapboxGL.ShapeSource id = "line1" shape={routeDirections}
            >
              <MapboxGL.LineLayer
              id = "routerline01"
              style={{lineWidth : 4, lineColor : 'blue'}}
              />
            </MapboxGL.ShapeSource>
          )}
          {userLocation && (
                    <MapboxGL.PointAnnotation    
                    id="userLocation"
                    coordinate={userLocation}
                    >
                <View style={styles.destinationIcon1}>
                        <Ionicons name="accessibility" size={30} color="#FF6666"/>
                    </View>
                    
                    </MapboxGL.PointAnnotation>
                )}
            {Object.values(latestLocationData).map((driver) => (
                <MapboxGL.PointAnnotation
                key = {driver.id}
                id = "Driver"
                coordinate={[parseFloat(driver.Longitude),parseFloat(driver.Latitude)]}>
                  <View style={styles.busIcon}>
                              <Ionicons name="car" size={30} color="white"/>
                          </View>
                </MapboxGL.PointAnnotation>
        ))}     
          
        </MapboxGL.MapView>
          {/* {Object.values(latestLocationData).map((driver) => (
        <Text key={driver.id}>
            Name: {driver.Name}, Latitude: {driver.Latitude}, Longitude: {driver.Longitude}
        </Text>
        ))} */}

       
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#ffffff" />
        </TouchableOpacity>
        
        <View style={styles.distanceDurationContainer}>
          <Text style={styles.distanceDurationText}>
              Distance: {distance} Km
          </Text>
          <Text style={styles.distanceDurationText}>
              Duration: {duration} 
          </Text>
        </View>
        <View style={styles.distanceDurationContainer1}>
          <Text style={styles.distanceDurationText}>
            Licenseplate: {Licenseplate} 
          </Text>
          <Text style={styles.distanceDurationText}>
              Package: {Package} 
          </Text>
        </View>

      </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  distanceDurationContainer: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: 5,
    padding: 8,
  },
  distanceDurationContainer1: {
    position: "absolute",
    top: 100,
    right: 20,
    zIndex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: 5,
    padding: 8,
  },
  distanceDurationText: {
    color: "white",
    fontSize: 16,
    marginBottom: 4,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1,
    backgroundColor: 'rgba(0, 0 ,0 , 0.5)',
    borderRadius: 10,
    padding: 10,
  },
  loadingIndicator: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    zIndex: 2,
  },
  cardContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
  },
  busIcon: {
    width: 33,
    height: 33,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: '#FF6666',
    borderColor: 'black',
    borderWidth: 2,
  },
  destinationIcon1: {
    width: 33,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: 'white',
    borderColor: 'red',
    borderWidth: 1,
  },
  routeProfileList: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: 'transparent',
    zIndex: 1,
  },
  flatList: {
    position: 'absolute',
    bottom: 20,
    left: 90,
    marginLeft: -40,
    backgroundColor: 'transparent',
    zIndex: 1,
  },
  routeProfileButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginHorizontal: 8,
    borderColor: '#fff',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  selectedRouteProfileButton: {
    backgroundColor: '#FA9E14',
    borderColor: '#FA9E14',
  },
  routeProfileButtonText: {
    color: '#fff',
    marginTop: 5,
  },
  selectedRouteProfileButtonText: {
    color: 'white',
  },
});

export default Deliverlyroute;