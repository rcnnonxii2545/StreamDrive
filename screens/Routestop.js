
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
const Routestop = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {Namecustomer,Latitudecustomer,Longitudecustomer} = route.params;
  const [userLocation, setUserLocation] = useState([Longitudecustomer,Latitudecustomer]);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [routeDirections, setrouteDirections] = useState(null)
  const [selectedRouteProfile, setselectedRouteProfile] = useState('driving');
  const [latitude,setlatitude] = useState(null);
  const [longitude,setlongitude] = useState(null);
  const routeProfiles = [
    {id: 'walking', label: 'Walking', icon: 'walking'},
    {id: 'cycling', label: 'Cylcing', icon: 'bicycle'},
    {id: 'driving', label: 'Driving', icon: 'car'},
  ];
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
        setUserLocation([longitude,latitude]);
        setlatitude(latitude);
        setlongitude(longitude);
      },
      error => {
        console.log(error.code, error.message);
      },
      { enableHighAccuracy: true, timeout: 1000000, maximumAge: 10000 }

    );
  }, []);
  useEffect(() => {
    requestLocationPermission();
  }, [requestLocationPermission]);



  useEffect(() => {
    const watchId = Geolocation.watchPosition(
      position => {
        // console.log('Position:', position);
        const { longitude, latitude } = position.coords;
        setUserLocation([longitude,latitude])
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
    
      async function createRouterline(userLocation, routeProfile) {
        
        const startCoords = `${userLocation[0]},${userLocation[1]}`;
        const endCoords = `${Longitudecustomer},${Latitudecustomer}`;
        const geometries = 'geojson';
        const url = `https://api.mapbox.com/directions/v5/mapbox/${routeProfile}/${startCoords};${endCoords}?alternatives=true&geometries=${geometries}&steps=true&banner_instructions=true&overview=full&voice_instructions=true&access_token=${token}`;
      
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
      if (selectedRouteProfile !== null) {
        console.log("profile",selectedRouteProfile)
        createRouterline(userLocation,selectedRouteProfile);
      }
    }, [selectedRouteProfile]);

    const renderItem = ({item}) => {
      return (
        <TouchableOpacity
          style={[
            styles.routeProfileButton,
            item.id == selectedRouteProfile && styles.selectedRouteProfileButton,
          ]}
          onPress={() => setselectedRouteProfile(item.id)}>
            
          <Icon
            name={item.icon}
            size={24}
            color={
              item.id == selectedRouteProfile ? 'white' : 'rgba(255,255,255,0.6)'
            }
          />
          <Text
            style={[
              styles.routeProfileButtonText,
              item.id == selectedRouteProfile &&
                styles.selectedRouteProfileButtonText,
            ]}>
            {item.label}
          </Text>
        </TouchableOpacity>
      );
    };
    
    
  return (

      <View style={styles.container}>
          <MapboxGL.MapView 
          style={styles.map} 
          zoomEnabled = {true}
          styleURL='mapbox://styles/mapbox/streets-v12'
          rotateEnabled ={true}
          onDidFinishLoadingMap={async () => {
            await createRouterline(userLocation,selectedRouteProfile);
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
                <View style={styles.destinationIcon1}>
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
          style={styles.startButton}
          onPress={() => navigation.navigate('Routestop2', {
            RouteProfile : selectedRouteProfile,
            Latitudecustomer : Latitudecustomer,
            Longitudecustomer : Longitudecustomer,
          })}>
          <Ionicons name="caret-forward-circle-outline" size={30} color="red" />
        </TouchableOpacity>
          <FlatList
            data={routeProfiles}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            horizontal
            contentContainerStyle={styles.routeProfileList}
            showsHorizontalScrollIndicator={false}
            style={styles.flatList}
          />
        {/* <MyButton
            style={{ position: 'absolute', bottom: 30 }}
            title="Start"
            onPress={() => navigation.navigate('Routestop2', {
              RouteProfile : selectedRouteProfile,
              Latitudecustomer : Latitudecustomer,
              Longitudecustomer : Longitudecustomer,
            })}
            backgroundColor="black"
          /> */}
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
  backButton: {
    position: 'absolute',
    top: 40,
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

export default Routestop;