import React from 'react';
import { StyleSheet, Text,View,Image, Dimensions,TouchableOpacity,KeyboardAvoidingView} from 'react-native';
import Header from '../components/Header';

const {width,height} = Dimensions.get('window');
export default class SearchScreen extends React.Component {
 
    static navigationOptions = {
        tabBarIcon:({tintColor}) => (
          <Image
            source={require('../icons/tabs/search.png')}
            style= {{width:25,height:25,tintColor:'white'}}
          >
          </Image>
        )
    }
  render(){ 
    
    return(
      
        <View style={styles.container}>
          <Header {...this.props} namePage="Mis cursos"/> 
          <Text style={styles.instructions}>Modulo busquedas</Text>           
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
    map:{
      width:width,
      height: height*0.3,
      backgroundColor:'red',
      marginVertical:10,
      marginBottom:100,
      paddingHorizontal:5,
  }
  });