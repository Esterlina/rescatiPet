import React from 'react';
import { StyleSheet, Text,View,Image} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Header from '../components/Header';



export default class RescueScreen extends React.Component {
    static navigationOptions = {
        tabBarIcon:({tintColor}) => (
          <Icon name="paw" size={25} color="white"/>
        )
    }

  render(){ 
    
    return(
        <View style={styles.container}>
          <Header {...this.props}/> 
          <Text style={styles.instructions}>Modulo rescates</Text>
      </View>
    );
    
  }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F5FCFF',
    },
    welcome: {
      fontSize: 20,
      textAlign: 'center',
      margin: 10,
    },
    instructions: {
      textAlign: 'center',
      color: '#333333',
      marginBottom: 5,
    },
  });