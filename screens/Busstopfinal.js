import axios from 'axios';
import { Text,StyleSheet,View,Dimensions,TouchableOpacity,ActivityIndicator,FlatList,Modal} from 'react-native';
import React, { useState, useCallback, useEffect ,useRef} from 'react';
import MapboxGL from '@rnmapbox/maps';
import { PermissionsAndroid } from 'react-native';
import {  useNavigation,useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Geolocation from '@react-native-community/geolocation';
const token = 'sk.eyJ1IjoicmNubm9ueGlpMjU0NSIsImEiOiJjbG13NXVlNnYxNGJ5MmtwZW1vcXhuOHl2In0.SgazKeniv6PKJ3fnDP1QtQ';
MapboxGL.setConnected(true);
MapboxGL.setAccessToken(token);
MapboxGL.setTelemetryEnabled(false);
MapboxGL.setWellKnownTileServer('Mapbox');

const Test = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {busnumber,latitudebus,longitudebus,latitude,longitude} = route.params;
  const [routeDirections, setrouteDirections] = useState(null)
  const [busrouteDirections, setbusrouteDirections] = useState(null)
  const [data1, setData1] = useState([]);
  const [userLocation, setUserLocation] = useState([longitude,latitude]);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [distance1, setDistance1] = useState(null);
  const [duration1, setDuration1] = useState(null);
  const [routeCoordinates1, setRouteCoordinates1] = useState([]);
  const [busLocation, setBusLocation] = useState({
    latitude: latitudebus,
    longitude: longitudebus,
  });
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
        console.log("sssssss",error.code, error.message);
      },
      { enableHighAccuracy: true, timeout: 30000, maximumAge: 10000 }

    );
  }, []);
  useEffect(() => {
    requestLocationPermission();

    const watchId = Geolocation.watchPosition(
      position => {
        const { longitude, latitude } = position.coords;
        setUserLocation([longitude, latitude]);
        createRouterline(); 
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
  useEffect( () => {
    const query1 = `
    {
        Route_Stop {
          Route_id{Busnumber}
          Stop_id {
            id
            Latitude
            Longitude
            Name
          }
        }
      }
    `;
    axios
      .post('http://13.236.182.88:8055/graphql', {
        query: query1,
      })
      .then((response) => {
        
        setData1(response.data.data.Route_Stop);
        console.log (data1)
      })
      .catch((error) => {
        console.error('Error fetching dataaaaa:', error);
      });
    }, []);
    const filteredData = data1.filter(item => item.Route_id.Busnumber === busnumber);
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
   
    
    
    
      
    async function createRouterline() {
        if (userLocation && filteredData.length > 0) {
          let totalDistance = 0;
          let totalDuration = 0;
          let routeCoordinates = [];
          for (let i = 0; i < filteredData.length - 1; i++) {
            console.log(i)
            const startCoords = `${filteredData[i].Stop_id.Longitude},${filteredData[i].Stop_id.Latitude}`;
            const endCoords = `${filteredData[i + 1].Stop_id.Longitude},${filteredData[i + 1].Stop_id.Latitude}`;
            const geometries = 'geojson';
            const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${startCoords};${endCoords}?alternatives=true&geometries=${geometries}&steps=true&banner_instructions=true&overview=full&voice_instructions=true&access_token=${token}`;
      
            try {
              let response = await fetch(url);
              let json = await response.json();
              if (json.routes && Array.isArray(json.routes)) {
                const route = json.routes[0];
                totalDistance += route.distance;
                totalDuration += route.duration;
                if (route.geometry && route.geometry.coordinates) {
                  routeCoordinates = routeCoordinates.concat(route.geometry.coordinates);
                }
              } else {
                console.log("No routes found in the JSON response.");
              }
            } catch (error) {
              console.log("Error:", error.message);
            }
            let routeCoordinates1 = [];
      if (userLocation && busLocation) {
        const startCoords = `${busLocation.longitude},${busLocation.latitude}`;
        const endCoords = `${userLocation[0]},${userLocation[1]}`;
        const geometries = 'geojson';
        const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${startCoords};${endCoords}?alternatives=true&geometries=${geometries}&steps=true&banner_instructions=true&overview=full&voice_instructions=true&access_token=${token}`;
    
        try {
          let response = await fetch(url);
          let json = await response.json();
          if (json.routes && Array.isArray(json.routes)) {
            const route = json.routes[0];
            const totalDistance = (route.distance / 1000).toFixed(1);
            const totalDuration = (route.duration / 60).toFixed(0);
    
            setDistance(totalDistance);
            setDuration(totalDuration);
    
            if (route.geometry && route.geometry.coordinates) {
              routeCoordinates1 = route.geometry.coordinates;
              const route1 = makeRoute(routeCoordinates1);
              setbusrouteDirections(route1); // ตั้งค่าข้อมูลเส้นทางใน busrouteDirections
            } else {
              console.log("No route coordinates found for bus to user.");
            }
          } else {
            console.log("No routes found in the JSON response.");
          }
        } catch (error) {
          console.log("Error:", error.message);
        }
      } 
          }
          
          if (routeCoordinates.length > 0) {
            const route = makeRoute(routeCoordinates);
            setrouteDirections(route);

           
          } else {
            console.log("No route coordinates found.");
          }
        } else {
          console.log("Insufficient bus stop data to create route.");
        }
        
      }
      useEffect(() => {
        createRouterline();
      },[busLocation,userLocation]);
      
      
return (

        <View style={styles.container}>
          {/* {data1.map((busstop) => (
                    
                        <View >
                          <Text> {busstop.Stop_id.Name}</Text>
                        </View>
  
                ))} */}
            <MapboxGL.MapView   
                style={styles.map} 
                zoomEnabled={true}
                styleURL='mapbox://styles/mapbox/streets-v12'
                rotateEnabled={true}
                onDidFinishLoadingMap={async () => {
                    await createRouterline();
                    // await calculateTime();
                }}
                >
                  
                <MapboxGL.Camera
                    zoomLevel={15}
                    centerCoordinate={userLocation}
                    pitch={68}
                    animationMode={'flyTo'}
                    animationDuration={6000}
                />
                {userLocation && (
                    <MapboxGL.PointAnnotation    
                    id="userLocation"
                    coordinate={userLocation}
                    >
                <View >
                        <Ionicons name="accessibility" size={30} color="red"/>
                    </View>
                    
                    </MapboxGL.PointAnnotation>
                )}
                
                
                {busrouteDirections && (
                  <MapboxGL.ShapeSource id="busrouteDirections" shape={busrouteDirections}>
                    <MapboxGL.LineLayer
                      id="busrouteDirections1"
                      style={{
                        lineWidth: 10,
                        lineColor: '#00BFFF',

                
                      }}
                    />
                  </MapboxGL.ShapeSource>
                )}
                {routeDirections && (
                    <MapboxGL.ShapeSource id = "line1" shape={routeDirections}>
                        <MapboxGL.LineLayer
                            id = "routerline01"
                            style={{lineWidth : 5, 
                            lineColor : 'blue',
                            }}
                        />
                    </MapboxGL.ShapeSource>
                )}

                {filteredData.map((busstop) => (
                    <MapboxGL.PointAnnotation
                        key={busstop.Stop_id.id}
                        id="marker"
                        coordinate={[parseFloat(busstop.Stop_id.Longitude), parseFloat(busstop.Stop_id.Latitude)]}
                    >
                        <View style={styles.destinationIcon}>
                            <Ionicons name="bus-outline" size={20} color="white"/>
                        </View>
                    </MapboxGL.PointAnnotation>
                ))}
                 
                <MapboxGL.PointAnnotation
                    id="marker"
                    coordinate={[parseFloat(longitudebus), parseFloat(latitudebus)]}
                >
                    <View style={styles.destinationIcon1}>
                    <Ionicons name="logo-vercel" size={20} color="black"/>
                    </View>
                </MapboxGL.PointAnnotation>
               
              </MapboxGL.MapView>
              <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}>
                    <Icon name="arrow-left" size={24} color="white" />
                </TouchableOpacity>
                 <View style={styles.distanceDurationContainer}>
                    <Text style={styles.distanceDurationText}>
                        Distance : {distance} km
                    </Text>
                    <Text style={styles.distanceDurationText}>
                        Time : {duration} min
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
    calloutContent: {
      backgroundColor: 'white',
      padding: 10,
      borderRadius: 5,
      borderColor: 'gray',
      borderWidth: 1,
    },
    backButton: {
      position: 'absolute',
      top: 20,
      left: 20,
      zIndex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      borderRadius: 10,
      padding: 8,
    },
    destinationIcon: {
      width: 30,
      height: 30,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 15,
      backgroundColor: 'black',
      borderColor: 'red',
      borderWidth: 1,
    },
    destinationIcon1: {
      width: 30,
      height: 30,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 15,
      backgroundColor: '#FF33FF',
      borderColor: 'red',
      borderWidth: 1,
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
      distanceDurationText: {
        color: "white",
        fontSize: 20,
        marginBottom: 4,
      },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      backgroundColor: 'white',
      padding: 20,
      borderRadius: 10,
    },
    userLocationIcon: {
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: 'blue',
    },
  })
  
export default Test
