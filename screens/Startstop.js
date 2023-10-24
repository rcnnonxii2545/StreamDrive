import axios from 'axios';
import { useRoute } from '@react-navigation/native';
import { View, Text, StyleSheet, Button, Linking ,TextInput,PermissionsAndroid,TouchableOpacity,Image} from 'react-native';
import React, { useState, useCallback, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import Geolocation from '@react-native-community/geolocation'
import MyButton from './Mybutton';
import MyButton1 from './Mybutton1';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome5';
const Startstop = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const {Name} = route.params;

    const [latitude,setlatitude] = useState(null);
    const [longitude,setlongitude] = useState(null);
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
    const [isSendingData, setIsSendingData] = useState(false);
    const [intervalId, setIntervalId] = useState(null);
  
    const startSendingData = useCallback(() => {
      setIsSendingData(true);
      const id = setInterval(async () => {
        try {
          const newPosition = await getCurrentLocation(); // ดึงค่า latitude และ longitude ใหม่
          const postData = {
            Name: Name,
            Latitude: newPosition.latitude,
            Longitude: newPosition.longitude,
            Date: nDate,
            Time: time,
            // เพิ่มข้อมูลอื่น ๆ ที่ต้องการส่งไปยัง Directus ตามต้องการ
          };
    
          // ส่งข้อมูลไปยัง Directus
          await axios.post('http://13.236.182.88:8055/items/Deliverly1', postData);
    
          console.log('Data sent successfully to Directus:', postData);
        } catch (error) {
          console.error('Error sending data to Directus:', error);
        }
      }, 3000); // ส่งข้อมูลทุก 3 วินาที
    
      setIntervalId(id);
    }, [Name, nDate, time]);
    
  
    const stopSendingData = () => {
      setIsSendingData(false);
      clearInterval(intervalId);
      setIntervalId(null);
    };
  
    
      

  return (
    <View style={styles.BG}>
      <View>
      <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#FF6666" />
        </TouchableOpacity>
      </View>
      <Text style={styles.text1}>
        Press the Start when starting the route{'\n'}
         and press the Stop when stopping the route  {'\n'}
        
     </Text>
      <View style = {{top : 600}}>
      {isSendingData ? (
        <MyButton1 
            title="Stop" 
            style={styles.stopButton} 
            onPress={stopSendingData}
            backgroundColor="white"
        />
        ) : (
        <MyButton1 
            title="Start" 
            style={styles.startButton} 
            onPress={startSendingData}
            backgroundColor="black"
        />
        )}
      </View>
      

      
     
      
    </View>
  );
}
const styles = StyleSheet.create({
      input1: {
        height: 60,

        // width : 350,
        margin: 10,
        borderWidth: 1,
        padding: 20,
        backgroundColor : 'white',
        borderColor: 'grey',
        borderWidth: 3,
        borderRadius: 50,
        top: 120,
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
      text1: {
        color: '#FF6666',
        fontSize: 18,
        left : 35,
        fontWeight: 'bold',
        position: 'absolute', 
        bottom: 50,
      },
      text2: {
        color: 'black',
        fontSize: 20,
        left : 20,
        top: 90,
        fontWeight: 'bold',
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
      stopButton: {
        backgroundColor: '#FF6666',
        padding: 20,
        borderRadius: 10,
        top:150,
        fontSize : 20,
        fontWeight: 'bold',
      },
    });
export default Startstop