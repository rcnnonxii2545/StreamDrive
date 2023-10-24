import React, { useState,useEffect } from 'react';
import { View, StyleSheet,StatusBar,TouchableOpacity,Image,Text} from 'react-native';
import axios from 'axios';
import {  useNavigation,useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import MyButton2 from './Mybutton2';
import MyButton1 from './Mybutton1';
import MyButton from './Mybutton';
import {Dropdown} from 'react-native-element-dropdown';
import Geolocation from '@react-native-community/geolocation';
const Deliverly3 = () => { 
  const navigation = useNavigation();
  const [Name, setName] = useState('');
  const [isFocus, setIsFocus] = useState(false);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [data, setData] = useState([]);
  const [data1, setData1] = useState([]);

  useEffect(() => {
    Geolocation.requestAuthorization();
    const watchId = Geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLatitude(latitude);
        setLongitude(longitude);
      },
      (error) => {
        console.error(error);
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
        Deliverly {
          Name
          
        }
      }
    `;
    axios
      .post('http://13.236.182.88:8055/graphql', {
        query: query1,
      })
      .then((response) => {

        setData1(response.data.data.Deliverly);

      })
      .catch((error) => {
        console.error('Error fetching dataaaaa:', error);
      });
    }, []);
  
    const suggestionData = data1.map(item => ({
      label: item.Name,
      value: item.Name
    }));
    
//   const filteredData = data.filter((item) => item.BusID.Busnumber === busnumber);
//   const latestLocationDataByBusnumber = {};
//   filteredData.forEach((item) => {
//     const currentBusnumber = item.BusID.Busnumber;
//     if (
//       !latestLocationDataByBusnumber[currentBusnumber] ||
//       item.LocationID > latestLocationDataByBusnumber[currentBusnumber].LocationID
//     ) {
//       latestLocationDataByBusnumber[currentBusnumber] = item;
//     }
//   });
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
              placeholder={!isFocus ? 'Select Name' : '...'}
              searchPlaceholder="Search..."
              value={Name}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={(item) => {
                setName(item.value);
                setIsFocus(false);
              }}
            />
          </View>
          <Image
          source={require('./image/delivering.png')} 
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
          <MyButton
            
            style={{ position: 'absolute', bottom: 0 }}
            title="Next"
            onPress={() => navigation.navigate('Startstop', {Name})}
            backgroundColor="#FF6666"
          />
        </View>
        
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
    left: '17%',
    resizeMode: 'cover',
    top: '35%',
  },

});

export default Deliverly3;