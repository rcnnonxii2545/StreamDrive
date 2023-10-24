import axios from 'axios';
import {View, Text, StyleSheet, Button, Linking,PermissionsAndroid } from 'react-native';
import React, { useState, useCallback, useEffect } from 'react';
import {  useNavigation,useRoute } from '@react-navigation/native';
import Geolocation from 'react-native-geolocation-service';

const Post = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [currentDate, setCurrentDate] = useState(new Date());
  const {Busnumber,Name,Surname,Capacity,Phonenumber,Typecar,nDate,x,y,time} = route.params;
  const apiKey = '42hOVCKcUHoAx8T0DDMNony4duoS9DcR';
  // const baseUrl = 'http://10.10.99.9:8055/items/Bus'; 
  const baseUrl1 = 'http://13.236.182.88:8055/items/Buslocation';

  // const requestLocationPermission = async () => {
  //   try {
  //     const granted = await PermissionsAndroid.request(
  //       PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
  //     );

  //     if (granted === PermissionsAndroid.RESULTS.GRANTED) {
  //       getCurrentLocation();
  //     } else {
  //       console.log('Location permission denied');
  //     }
  //   } catch (error) {
  //     console.log('Error requesting location permission:', error);
  //   }
  // };

  // const getCurrentLocation = useCallback(() => {
  //   Geolocation.getCurrentPosition(
  //     position => {
  //       console.log('Position:', position);
  //       const { longitude, latitude } = position.coords;
  //       setX(longitude);
  //       setY(latitude);
  //     },
  //     error => {
  //       console.log(error.code, error.message);
  //     },
  //     { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
  //   );
  // }, []);

  // useEffect(() => {
  //   requestLocationPermission();
  // }, [requestLocationPermission]);

  // useEffect(() => {
  //   const watchId = Geolocation.watchPosition(
  //     position => {
  //       console.log('Position:', position);
  //       const { longitude, latitude } = position.coords;
  //       setX(longitude);
  //       setY(latitude);
  //     },
  //     error => {
  //       console.log(error.code, error.message);
  //     },
  //     { enableHighAccuracy: true, distanceFilter: 10 }
  //   );

  //   return () => {
  //     Geolocation.clearWatch(watchId);
  //   };
  // }, []);

  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     const newDate = new Date();
  //     setCurrentDate(newDate);
  //     setTime(newDate.toLocaleTimeString());
  //   }, 1000); // อัพเดทเวลาทุก 1 วินาที

  //   return () => {
  //     clearInterval(intervalId);
  //   };
  // }, []);
  // const nDate = currentDate.toLocaleDateString();
  
  // const newItem = {
  //   // Name : Name,
  //   // Surname : Surname,
  //   // Phonenumber : Phonenumber,
  //   Typecar : Typecar,
  //   Busnumber : Busnumber,
  //   Capacity : Capacity,
  // };
 
  // const newItem1 = {
  //   Latitude : x,
  //   Longitude : y,
  //   Time : time,
  //   Date : nDate,
  //   Busnumber : Busnumber,
  // }
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${apiKey}`,
  };
  
  useEffect(() => {
    const newItem1 = {
      Latitude: x,
      Longitude: y,
      Time: time,
      Date: nDate,
      BusID: {
        Busnumber: Busnumber,
        Capacity : Capacity,
        Model : Typecar,
        Name : Name,
        Surname : Surname,
        Phonenumber : Phonenumber,
      }
    };
  
    fetch(baseUrl1, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(newItem1),
    })
      .then(response => response.json())
      .then(data => {
        console.log('New item added to Buslocation:', data);
      })
      .catch(error => {
        console.error('Error adding item to Buslocation:', error);
      });
  }, [x, y, time, nDate, Busnumber]);
  
  return (
      <View style={styles.locationMap}>
        <View>
          {/* <Text>Send Name: {Name}</Text>
          <Text>Send Surname: {Surname}</Text>
          <Text>Send Phonenumber: {Phonenumber}</Text> */}
          <Text>Send Latitude: {x}</Text>
          <Text>Send Typecar: {y}</Text>
          <Text>Send Typecar: {Typecar}</Text>
          <Text>Send Busnumber: {Busnumber}</Text>
          <Text>Send Capacity: {Capacity}</Text>
          <Text>Send Date: {nDate}</Text>
          <Text>Send Time: {time}</Text>
        </View>
        <Button
          title="Next"
          onPress={() => navigation.navigate('Start')}
        />
      </View>
  );
}
const styles = StyleSheet.create({
  locationMap: {
    margin: 10,
  },
});

export default Post;