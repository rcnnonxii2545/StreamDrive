import React, { useState,useEffect,useCallback } from 'react';
import { View, StyleSheet,StatusBar,TouchableOpacity,Image,Text,PermissionsAndroid} from 'react-native';
import axios from 'axios';
import {  useNavigation,useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import MyButton2 from './Mybutton2';
import MyButton1 from './Mybutton1';
import MyButton from './Mybutton';
import {Dropdown} from 'react-native-element-dropdown';
import Geolocation from '@react-native-community/geolocation';
const Busline = () => { 
  const navigation = useNavigation();
  const [busnumber,setbusnumber] =useState('');
  const [isFocus, setIsFocus] = useState(false);
  const [latitude, setlatitude] = useState(null);
  const [longitude, setlongitude] = useState(null);
  const [data, setData] = useState([]);
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
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        position => {
          const { longitude, latitude } = position.coords;
          resolve({ latitude, longitude });
        },
        error => {
          reject(error);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    });
  }, []);

  useEffect(() => {
    requestLocationPermission();
  }, [requestLocationPermission]);

  useEffect(() => {
    const watchId = Geolocation.watchPosition(
      position => {
        // console.log('Position:', position);
        const { longitude, latitude } = position.coords;
        setlatitude(latitude);
        setlongitude(longitude);
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
        id
        BusID {
          Busnumber
          Capacity
          Model
        }
        Latitude
        Longitude
      }
    }
  `;
    axios.post('http://13.236.182.88:8055/graphql', { query })
      .then((response) => {
        setData(response.data.data.Buslocation);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);
  const filteredData = data.filter((item) => item.BusID.Busnumber === busnumber);
  const latestLocationDataByBusnumber = {};
  filteredData.forEach((item) => {
    const currentBusnumber = item.BusID.Busnumber;
    if (
      !latestLocationDataByBusnumber[currentBusnumber] ||
      item.id > latestLocationDataByBusnumber[currentBusnumber].id
    ) {
      latestLocationDataByBusnumber[currentBusnumber] = item;
    }
  });
  return (
    <View style={styles.BG}>
        <View>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={24} color="#FF6666" />
          </TouchableOpacity>
          
          <StatusBar barStyle="light-content" />
          <View style={{  padding: 20, borderRadius: 20 }}>
            <Dropdown
              style={[styles.dropdown, isFocus && { borderColor: '#FF6666',backgroundColor:'white' }]}
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
          <Image
          source={require('./image/bus1.png')} 
          style={styles.image}
        />
        </View>
        <View style ={styles.container}>
        {/* {Object.values(latestLocationDataByBusnumber).map((latestLocationData) => (
          <MyButton1
            key={latestLocationData.LocationID}
            style={{ position: 'absolute', bottom: 0 }}
            title="Busstop"
            onPress={() => navigation.navigate('Busstop', {
              busnumber,
              latitudebus: parseFloat(latestLocationData.Latitude),
              longitudebus: parseFloat(latestLocationData.Longitude), 
            })}
            backgroundColor="#FF3333"
          />
        ))} */}
        {Object.values(latestLocationDataByBusnumber).map((latestLocationData) => (
          <MyButton
            key={latestLocationData.id}
            style={{ position: 'absolute', bottom: 0 }}
            title="Busstop"
            onPress={() => navigation.navigate('Test', {
              busnumber,
              latitude: parseFloat(latitude),
              longitude: parseFloat(longitude),
              latitudebus: parseFloat(latestLocationData.Latitude),
              longitudebus: parseFloat(latestLocationData.Longitude), 
            })}
            backgroundColor="#FF6666"
          />
        ))}
        </View>
        {/* <Text>{latitude}{longitude}</Text> */}

    </View>
    
  );
};

const styles = StyleSheet.create({
  backButton: {
    position: 'absolute',
    top: 20,
    left: 10,
    zIndex: 1,
    borderRadius: 10,
    padding: 10,
  },
  container: {
    flex: 1,
    padding: 35,
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    margin: 5,
},

  input: {
    borderWidth: 1,
    borderColor: '#FF6666',
    padding: 10,
    fontSize: 20,
  },
  suggestionList: {
    marginTop: 10,
    borderColor: '#FF6666',
    fontSize: 20,
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FF6666',
    fontSize: 20,
  },
  dropdown: {
    height: 60,
    borderColor: '#FF6666',
    borderWidth: 3,
    borderRadius: 20,
    paddingHorizontal: 10,
    marginBottom: 1,
    borderBlockStartColor : '#FF6666',
    backgroundColor : 'white',
    top: 70,
    padding : 10,
    fontSize: 20,
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
    fontSize: 20,
  },
  placeholderStyle: {
    fontSize: 20,
    color : 'grey'
  },
  selectedTextStyle: {
    fontSize: 20,
    
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 20,
    
  },
  BG: {
    flex: 1,
    backgroundColor : 'white',
  },
  image: {
    width: 250,
    height: 250,
    left: '15%',
    resizeMode: 'cover',
    top:'50%',
  },

});

export default Busline;