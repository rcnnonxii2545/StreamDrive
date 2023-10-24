import axios from 'axios';
import { Text,StyleSheet,View,TouchableOpacity,Image} from 'react-native';
import React, { useState, useEffect} from 'react';
import {  useNavigation,useRoute } from '@react-navigation/native';
import MyButton6 from './MyButton6';
import Icon from 'react-native-vector-icons/FontAwesome5';
const Sitecustomer = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [sitecustomer, setsitecustomer] = useState([]);

  useEffect(() => {
    const query1 = `
    {
      Sitecustomer {
       id
       Name
       Latitude
       Longitude
      }
    }
    `;
    
    axios
      .post('http://13.236.182.88:8055/graphql', {
        query: query1,
      })
      .then((response) => {
        setsitecustomer(response.data.data.Sitecustomer);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);  
return (

        <View style={styles.BG}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={24} color="#FF6666" />
        </TouchableOpacity>
        <View>
          <Text style = {styles.text1}>
            Please choose the place {'\n'}         you want to go
          </Text>
          <Image
          source={require('./image/business.png')} 
          style={styles.image}
        />
        </View>
        <View style={styles.container}>
        {sitecustomer.map((item) => (
            <MyButton6
            key = {item.id}
              title={item.Name}
              onPress={() => navigation.navigate('Routestop', {
                Namecustomer : item.Name,
                Latitudecustomer: parseFloat(item.Latitude),
                Longitudecustomer: parseFloat(item.Longitude), 
              })}
              backgroundColor="white"
          />
          ))

          }
        </View>
          
            
        </View>
);
}


const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 0,
    position: 'absolute',
    bottom: '2%',
    margin: 5,
},
text1: {
  color: '#FF6666',
  fontSize: 20,
  left: '12%',
  top: '25%',
  fontWeight: 'bold',
},
backButton: {
  position: 'absolute',
  top: 20,
  left: 10,
  zIndex: 1,
  borderRadius: 10,
  padding: 10,
},
BG: {
  flex: 1,
  backgroundColor : 'white',
},
image: {
  width: 240,
  height: 240,
  left: '17%',
  resizeMode: 'cover',
  top: '35%',
},

});


export default Sitecustomer;
