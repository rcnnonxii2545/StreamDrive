import React, { useState, useCallback, useEffect } from 'react';
import { View, TextInput, FlatList, Text, StyleSheet ,Button,Alert,StatusBar,TouchableOpacity,Dimensions} from 'react-native';
import axios from 'axios';
import {  useNavigation,useRoute} from '@react-navigation/native';
import MyButton1 from './Mybutton1';
import MapboxGL from '@rnmapbox/maps';
import {Dropdown} from 'react-native-element-dropdown';
import Geolocation from '@react-native-community/geolocation';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { PermissionsAndroid } from 'react-native';
const token = 'sk.eyJ1IjoicmNubm9ueGlpMjU0NSIsImEiOiJjbG13NXVlNnYxNGJ5MmtwZW1vcXhuOHl2In0.SgazKeniv6PKJ3fnDP1QtQ';
MapboxGL.setConnected(true);
MapboxGL.setAccessToken(token);
MapboxGL.setTelemetryEnabled(false);
MapboxGL.setWellKnownTileServer('Mapbox');

const Bus = () => {
    
  const navigation = useNavigation();
  const route = useRoute();
  const [busnumber,setbusnumber] =useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isFocus, setIsFocus] = useState(false);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [data, setData] = useState([]);
  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);
  const [busstop,setbusstop] = useState([]);
  const [routeDirections, setrouteDirections] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  
//   useEffect(() => {
//     // Request location permissions
//     Geolocation.requestAuthorization();

//     // Watch for changes in location
//     const watchId = Geolocation.watchPosition(
//       (position) => {
//         const { latitude, longitude } = position.coords;
//         setLatitude(latitude);
//         setLongitude(longitude);
//       },
//       (error) => {
//         console.error(error);
//       },
//       { enableHighAccuracy: true, distanceFilter: 10 }
//     );

//     // Clean up the watcher when the component unmounts
//     return () => {
//       Geolocation.clearWatch(watchId);
//     };
//   }, []);
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

  useEffect( () => {
    const query1 = `
    {
        Route {
          Busnumber
        }
      }
    `;
    axios
      .post('http://13.236.182.88:8055/graphql', {
        query: query1,
      })
      .then((response) => {

        setData1(response.data.data.Route);

      })
      .catch((error) => {
        console.error('Error fetching dataaaaa:', error);
      });
    }, []);
  
  const suggestionData = data1.map(item => ({
    label: item.Busnumber,
    value: item.Busnumber
  }));


  useEffect(() => {
    const query = `
    query {
      Buslocation {
        BusID {
          Busnumber
          Capacity
          Model
        }
        LocationID
        Latitude
        Longitude
      }
    }
  `;
    axios.post('http://10.10.99.9:8055/graphql', { query })
      .then((response) => {
        setData(response.data.data.Buslocation);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);
  useEffect( () => {
    const query2 = `
    {
        Route_Stop {
          Route_RouteID{Busnumber}
          Stop_StopID {
            Latitude
            Longitude
            Name
          }
        }
      }
    `;
    axios
      .post('http://10.10.99.9:8055/graphql', {
        query: query2,
      })
      .then((response) => {

        setData2(response.data.data.Route_Stop);

      })
      .catch((error) => {
        console.error('Error fetching dataaaaa:', error);
      });
    }, []);
    // console.log(data2)
    // console.log(busnumber)
  const filteredData = data.filter((item) => item.BusID.Busnumber === busnumber);
  const filteredData2 = data2.filter((item) => item.Route_RouteID.Busnumber === busnumber);
//   console.log(filteredData2)
  const latestLocationDataByBusnumber = {};
  filteredData.forEach((item) => {
    const currentBusnumber = item.BusID.Busnumber;
    if (
      !latestLocationDataByBusnumber[currentBusnumber] ||
      item.LocationID > latestLocationDataByBusnumber[currentBusnumber].LocationID
    ) {
      latestLocationDataByBusnumber[currentBusnumber] = item;
    }
  });
///
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
        if (userLocation && filteredData2.length > 0) {
          let totalDistance = 0;
          let totalDuration = 0;
          let routeCoordinates = [];
          for (let i = 0; i < filteredData2.length - 1; i++) {
            const startCoords = `${filteredData2[i].Stop_StopID.Longitude},${filteredData2[i].Stop_StopID.Latitude}`;
            const endCoords = `${filteredData2[i + 1].Stop_StopID.Longitude},${filteredData2[i + 1].Stop_StopID.Latitude}`;
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
          }
      
          if (routeCoordinates.length > 0) {
            const route = makeRoute(routeCoordinates);
            setrouteDirections(route);
            setDistance((totalDistance / 1000).toFixed(1)); // ระยะทางในหน่วยเมตรแปลงเป็น กิโลเมตร
            setDuration((totalDuration/60 ).toFixed(0)); // เวลาในหน่วยวินาทีแปลงเป็น ชั่วโมง
          } else {
            console.log("No route coordinates found.");
          }
        } else {
          console.log("Insufficient bus stop data to create route.");
        }
      }
      useEffect(() => {
    createRouterline();
}, [busnumber]);

  
  

  return (
    
        
        <View style={styles.container}>
            <View>
          <StatusBar barStyle="light-content" />
          <View style={{  padding: 20, borderRadius: 15 }}>
            <Dropdown
              style={[styles.dropdown, isFocus && { borderColor: 'white',backgroundColor:'white' }]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={suggestionData}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={!isFocus ? 'Select Busline' : '...'}
              searchPlaceholder="Search..."
              value={busnumber}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={(item) => {
                setbusnumber(item.value);
                setIsFocus(false);
              }}
            />
          </View>

        </View>
            <MapboxGL.MapView   
                style={styles.map} 
                zoomEnabled={true}
                styleURL='mapbox://styles/mapbox/streets-v12'
                rotateEnabled={true}
                onDidFinishLoadingMap={async () => {
                    await createRouterline();
                }}
                >

                <MapboxGL.Camera
                    zoomLevel={15}
                    centerCoordinate={[100.5417,13.7248]}
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
                        <Ionicons name="location" size={30} color="red"/>
                    </View>
                    
                    </MapboxGL.PointAnnotation>
                )}
                {/* {distance && duration && (
                    <View style={styles.distanceDurationContainer}>
                        <Text style={styles.distanceDurationText}>
                        Distance: {distance} km
                        </Text>
                        <Text style={styles.distanceDurationText}>
                        Duration: {duration} h
                        </Text>
                    </View>
                )} */}
                {routeDirections && (
                    <MapboxGL.ShapeSource id = "line1" shape={routeDirections}>
                        <MapboxGL.LineLayer
                            id = "routerline01"
                            style={{lineWidth : 7, 
                            lineColor : '#9932CC',
                            lineBlur: 1,
                            lineJoin: 'round', // ตั้งค่าขอบเส้นให้เป็นรูปร่างวงกลม
                            lineCap: 'round', // ตั้งค่าจุดสิ้นสุดของเส้นเป็นรูปร่างวงกลม
                            lineOpacity: 1, // ความโปร่งใสของเส้น
                            }}
                        />
                    </MapboxGL.ShapeSource>
                )}
                {filteredData2.map((busstop) => (
                    <MapboxGL.PointAnnotation
                        key={busstop.Stop_StopID.StopID}
                        id="marker"
                        coordinate={[parseFloat(busstop.Stop_StopID.Longitude), parseFloat(busstop.Stop_StopID.Latitude)]}
                    >
                        <View style={styles.destinationIcon}>
                            <Ionicons name="bus-outline" size={16} color="white"/>
                        </View>
                    </MapboxGL.PointAnnotation>
                ))}
                 {/* {Object.values(latestLocationDataByBusnumber).map((bus) => (
                    <MapboxGL.PointAnnotation
                    id="marker"
                    coordinate={[parseFloat(bus.Longitude), parseFloat(bus.Latitude)]}
                >
                    <View style={styles.destinationIcon1}>
                    <Ionicons name="logo-vercel" size={20} color="white"/>
                    </View>
                </MapboxGL.PointAnnotation>
                 ))} */}
                
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}>
                    <Icon name="arrow-left" size={24} color="#ffffff" />
                </TouchableOpacity>
            </MapboxGL.MapView>
             {/* {filteredData.map((stop, index) => (
          <Text key={index}>
            {stop.Stop_StopID.Latitude}
            {stop.Stop_StopID.Longitude}
            {stop.Stop_StopID.Name}
            {stop.Route_RouteID.Busnumber}
          </Text>
        ))} */}
            {/* <Text>
            {filteredData}
            </Text> */}
     {/* <View style={styles.distanceDurationContainer}>
        <Text style={styles.distanceDurationText}>
            Distance: {distance} km
        </Text>
        <Text style={styles.distanceDurationText}>
            Duration: {duration} min
        </Text>
      </View> */}
        </View>
    
    
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    margin: 10,
    alignContent : 'center',
    justifyContent : 'center',
    backgroundColor : 'white',
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
  },
  suggestionList: {
    marginTop: 10,
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  dropdown: {
    height: 60,
    borderColor: 'white',
    borderWidth: 3,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 1,
    borderBlockStartColor : 'white',
    backgroundColor : 'white',
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
    color : 'black'
  },
  selectedTextStyle: {
    fontSize: 16,
    
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    
  },
  BG: {
    flex: 1,
    backgroundColor : 'black',
    padding : 16,
    // justifyContent : 'center',
    // alignContent : 'center'
    
  },
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
    backgroundColor: 'rgba(0, 0 ,0 , 0.5)',
    borderRadius: 20,
    padding: 8,
  },
  destinationIcon: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    backgroundColor: 'black',
  },
  destinationIcon1: {
    width: 25,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    backgroundColor: 'blue',
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
  routeProfileList: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: 'transparent',
    zIndex: 1,
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
  flatList: {
    position: 'absolute',
    bottom: 20,
    left: Dimensions.get('window').width / 2 - 40,
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
  userLocationIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'blue',
  },

});

export default Bus;