
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
const Routestop2 = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {RouteProfile,Latitudecustomer,Longitudecustomer} = route.params;
  const [userLocation, setUserLocation] = useState([Longitudecustomer,Latitudecustomer]);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [routeDirections, setrouteDirections] = useState(null)
  const [selectedRouteProfile, setselectedRouteProfile] = useState(RouteProfile);
  const [latitude,setlatitude] = useState(null);
  const [longitude,setlongitude] = useState(null);
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
        
        const startCoords = `${userLocation[0]},${userLocation[1]}`;
        const endCoords = `${Longitudecustomer},${Latitudecustomer}`;
        const geometries = 'geojson';
        const url = `https://api.mapbox.com/directions/v5/mapbox/${RouteProfile}/${startCoords};${endCoords}?alternatives=true&geometries=${geometries}&steps=true&banner_instructions=true&overview=full&voice_instructions=true&access_token=${token}`;
      
        try {
          let response = await fetch(url);
          
          let json = await response.json();
          const data = json.routes.map((data) => {
            // console.log(data);
            const calculatedDistance = (data.distance / 1000).toFixed(1);
            const calculatedDurationInMinutes = (data.duration / 60).toFixed(0);
            const calculatedDurationInHours = Math.floor(calculatedDurationInMinutes / 60);
            const remainingMinutes = calculatedDurationInMinutes % 60;
          
            setDistance(calculatedDistance);
            if (calculatedDurationInHours > 0) {
              setDuration(`${calculatedDurationInHours} Hr ${remainingMinutes} min`);
            } else {
              setDuration(`${remainingMinutes} min`);
            }
          });
          if (json.routes && Array.isArray(json.routes)) {
            
            const coordinates = json.routes[0].geometry.coordinates;
            if (coordinates.length) {
              const route = makeRoute([...coordinates]);
              setrouteDirections(route);
              // console.log(routeDirections)
            }
          } else {
            console.log("No routes found in the JSON response.");
          }
        } catch (error) {
          console.log("Error:", error.message);
        }
      }
  
    useEffect(() => {
        console.log("profile",selectedRouteProfile)
        createRouterline();
    }, [userLocation]);

    
    
    
  return (

      <View style={styles.container}>
          <MapboxGL.MapView 
          style={styles.map} 
          zoomEnabled = {true}
          styleURL='mapbox://styles/mapbox/streets-v12'
          rotateEnabled ={true}
          onDidFinishLoadingMap={async () => {
            await createRouterline();
          }}>
          <MapboxGL.Camera
          zoomLevel={12}
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
                <View style={styles.destinationIcon1} >
                        <Ionicons name="accessibility" size={30} color="#FF6666"/>
                    </View>
                    
                    </MapboxGL.PointAnnotation>
                )}
          <MapboxGL.PointAnnotation
          id = "SiteCustomer"
          coordinate={[Longitudecustomer,Latitudecustomer]}>
            <View style={styles.busIcon}>
                        <Ionicons name="location" size={28} color="white"/>
                    </View>
          </MapboxGL.PointAnnotation>
        </MapboxGL.MapView>
        
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
  startButton: {
    backgroundColor : '#FF6666',
    borderColor: 'black',
    padding: 20,
    borderRadius: 50,
    top:100,
    fontSize : 20,
    borderWidth: 1,
    fontWeight: 'bold',
    margin: 50,
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

export default Routestop2;