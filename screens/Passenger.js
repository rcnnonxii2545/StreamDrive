import { View, Text,Button ,StyleSheet,TouchableHighlight,Image,TouchableOpacity} from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import MyButton3 from './Mybutton3';
import MyButton4 from './Mybutton4';
import MyButton from './Mybutton';
import Ionicons from 'react-native-vector-icons/Ionicons';
const Passenger = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.BG}>
      <View>
      <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#FF6666" />
        </TouchableOpacity>
      <Image
          source={require('./image/man.png')} 
          style={styles.image}
        />
        
        <Text style = {styles.text1}>
          Please select Mode for {'\n'}             routing
        </Text>
        </View>
      <View style={styles.container}>
        <MyButton3
          title="Bus"
          onPress={() => navigation.navigate('Busline')}
          backgroundColor="#FF6666"
        />
        <MyButton4
          title="Driving & Walking"
          onPress={() => navigation.navigate('Sitecustomer')}
          backgroundColor="white"
        />
        <MyButton3
          title="Deliverly"
          onPress={() => navigation.navigate('Deliverly2')}
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
       
  )
};
const styles = StyleSheet.create({
  container: {
    padding : 50,
    justifyContent : 'center',
    alignContent : 'center',
    top: '36%',
    
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
  
  BG: {
    flex: 1,
    backgroundColor : 'white',
    
  },
  image: {
    width: 260,
    height: 250,
    left: '14%',
    resizeMode: 'cover',
    top: '50%',
    position: 'absolute',
  },
  image1: {
    width: 230,
    height: 80,
    left: 80,
    resizeMode: 'cover',
    top: 130,
    backgroundColor : 'black',
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
    fontSize: 25,
    left : '10%',
    top: '390%',
    fontWeight: 'bold',
  }
  
});
export default Passenger