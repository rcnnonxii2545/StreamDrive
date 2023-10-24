import axios from 'axios';
import { useRoute } from '@react-navigation/native';
import { View, Text, StyleSheet,Button, Linking ,TextInput,PermissionsAndroid,TouchableOpacity,Image} from 'react-native';
import React, { useState, useCallback, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import Geolocation from '@react-native-community/geolocation'
import Ionicons from 'react-native-vector-icons/Ionicons';
import MyButton5 from './Mybutton5';
import Icon from 'react-native-vector-icons/FontAwesome5';
const Driver = () => {
    const navigation = useNavigation();
    const [Busnumber, setBusnumber] = useState('');
    const [Name, setName] = useState('');
    const [Surname, setSurname] = useState('');
    const [Capacity, setCapacity] = useState('');
    const [Phonenumber, setPhonenumber] = useState('');
    const [Typecar, setTypecar] = useState('');
    const [x, setX] = useState([]);
    const [y, setY] = useState([]);
    const [time, setTime] = useState(new Date().toLocaleTimeString());
    const [currentDate, setCurrentDate] = useState(new Date());
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
          setX(latitude);
          setY(longitude);
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
          setX(latitude);
          setY(longitude);
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

    const nDate = currentDate.toLocaleDateString();

  return (
    <View style={styles.BG}>
      <View>
      <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#FF6666" />
        </TouchableOpacity>
        <Text style={styles.text1}>
          Please fill in the information for {'\n'}                   the driver
        </Text>
      </View>
      
        <View style={{ padding: 10}}>
            <TextInput style={styles.input1}
            placeholder="Enter your Name"
            onChangeText={setName}
            value={Name}
          />
          <TextInput style={styles.input1}
            placeholder="Enter your Surname"
            onChangeText={setSurname}
            value={Surname}
          />
          <TextInput style={styles.input1}
            placeholder="Enter your Phonenumber"
            onChangeText={setPhonenumber}
            value={Phonenumber}
          />
          <TextInput style={styles.input1}
            placeholder="Enter your Typecar"
            onChangeText={setTypecar}
            value={Typecar}
          />
          <TextInput style={styles.input1}
            placeholder="Enter your Bus Number"
            onChangeText={setBusnumber}
            value={Busnumber}
          />
          <TextInput style={styles.input1}
            placeholder="Enter Capacity on Bus or Car"
            onChangeText={setCapacity}
            value={Capacity}
          />
        </View>
      
      <View style = {{top : '1%',padding: 50}}>
        <MyButton5
          title="Submit"
          onPress={() => navigation.navigate('Postdata', { Busnumber,Name,Surname,Capacity,Phonenumber,Typecar,x,y,nDate,time })}
          backgroundColor="#FF6666"
        />
        <MyButton5
          title="Next"
          onPress={() => navigation.navigate('Driver2',)}
          backgroundColor="#FF6666"
        />
      </View>
      <TouchableOpacity
          style={styles. backButton1}
          onPress={() => navigation.navigate('Start')}>
          <Ionicons name="home" size={30} color="black" />
        </TouchableOpacity>
        <Image
          source={require('./image/stream.png')} 
          style={styles.image2}
        />
      
    </View>
  );
}
const styles = StyleSheet.create({
      input1: {
        height: 55,
        fontSize:9,
        // width : 350,
        margin: 5,
        borderWidth: 1,
        padding: 20,
        backgroundColor : 'white',
        borderColor: 'grey',
        borderWidth: 3,
        borderRadius: 50,
        top: '15%',
        // paddingHorizontal: 20,
        // paddingVertical: 20,
      },
      BG: {
        flex: 1,
        backgroundColor : 'white',
        
      },
      backButton: {
        position: 'absolute',
        top: 20,
        left: 10,
        zIndex: 1,
        borderRadius: 10,
        padding: 10,
      },
      backButton1: {
        position: 'absolute',
        bottom: 0, 
        left: 10,
        zIndex: 1,
        borderRadius: 10,
        padding: 10,
      },
    image2: {
        width: 200,
        height:50,
        position: 'absolute',
        right: 0, 
        bottom: 0, 
        resizeMode: 'cover',
    
    },
      text1: {
        color: '#FF6666',
        fontSize: 20,
        left : '5.5%',
        top: '125%',
        fontWeight: 'bold',
      }
    });
export default Driver