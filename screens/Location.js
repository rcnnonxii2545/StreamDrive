import { View, Text, StyleSheet, Button, Linking ,TouchableOpacity} from 'react-native';
import React, { useState, useCallback, useEffect } from 'react';
import { useNavigation,useRoute } from '@react-navigation/native';
import Geolocation from 'react-native-geolocation-service';
import { PermissionsAndroid } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MapboxGL from '@rnmapbox/maps';
const Location = () => {
  const navigation = useNavigation();
  const [x, setX] = useState(null);
  const [y, setY] = useState(null);
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [currentDate, setCurrentDate] = useState(new Date());
  const [userLocation, setUserLocation] = useState([100.5417792,13.7248727]);
  const route = useRoute();
  // const {Name,Car,Number} = route.params;
  const token = 'sk.eyJ1IjoicmNubm9ueGlpMjU0NSIsImEiOiJjbG13NXVlNnYxNGJ5MmtwZW1vcXhuOHl2In0.SgazKeniv6PKJ3fnDP1QtQ';
MapboxGL.setConnected(true);
MapboxGL.setAccessToken(token);
MapboxGL.setTelemetryEnabled(false);
MapboxGL.setWellKnownTileServer('Mapbox');
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
        console.log('Position:', position);
        const { longitude, latitude } = position.coords;
        setUserLocation([longitude,latitude])
        setX(longitude);
        setY(latitude);
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
        console.log('Position:', position);
        const { longitude, latitude } = position.coords;
        setX(longitude);
        setY(latitude);
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
    const intervalId = setInterval(() => {
      const newDate = new Date();
      setCurrentDate(newDate);
      setTime(newDate.toLocaleTimeString());
    }, 1000); // อัพเดทเวลาทุก 1 วินาที

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const handleMap = useCallback(async () => {
    if (x && y) {
      const url = `https://www.google.com/maps?q=${y},${x}`;
      await Linking.openURL(url);
    }
  }, [x, y]);


 const nDate = currentDate.toLocaleDateString();



  return (
        <View style={styles.container}>
          <MapboxGL.MapView 
          style={styles.map} 
          zoomEnabled = {true}
          styleURL='mapbox://styles/mapbox/streets-v12'
          rotateEnabled ={true}
          onDidFinishLoadingMap={async () => {
          }}>
          <MapboxGL.Camera
          zoomLevel={20}
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
        </MapboxGL.MapView>
        
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#ffffff" />
        </TouchableOpacity>
      <Text>{time}</Text>
        <Text>{nDate}</Text>
        <Text>{userLocation[0]}</Text>
        <Text>{userLocation[1]}</Text>
      </View>
        
    
  );
}

const styles = StyleSheet.create({
  // textBox: {
  //   fontSize: 30,
  //   flex: 4,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   margin: 10,
  // },
  // locationMap: {
  //   margin: 20,
  // },
  // container: {
  //   flex: 1,
  //   justifyContent: 'center',
  //   alignItems: 'center',

  // },
  // dataContainer: {
  //   borderWidth: 1,
  //   padding: 10,
  //   borderRadius: 5,
  //   marginBottom: 10,
     
  // },
  // dataText: {
  //   fontSize: 16,
  //   marginBottom: 5,
  // },
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
  destinationIcon: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
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

export default Location;