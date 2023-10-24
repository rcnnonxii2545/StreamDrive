import { View, Text, Pressable, ScrollView,StyleSheet ,Image} from 'react-native'
import React from 'react'
import data from './attractions.json'
const Home = ({navigation}) => {
  const pressDetail = (id) => {navigation.navigate('Detail', {id : id})}
  return (
    <ScrollView>
      {data.map(d =>(
        <View key={d.id} style={{ marginBottom: 10 }}>
          <Pressable onPress={() => pressDetail(d.id)}>
            <Image
              style={styles.stretch}
              source={{uri : d.coverimage}}
            />
            <View style={styles.textBox}>
              <Text style ={{ fontSize: 20}}>{d.name}</Text>
              <Text>{d.detail}</Text>
            </View>
          </Pressable>
       </View>
      ))}
    </ScrollView>
  )
}
const styles = StyleSheet.create({
  container: {
    paddingTop: 100,
  },
  stretch: {
    width: "100%",
    height: 300,
    resizeMode: 'stretch',
  },
  textBox: {
    margin: 5
  }
});
export default Home