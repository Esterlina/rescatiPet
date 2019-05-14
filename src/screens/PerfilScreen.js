import React from 'react';
import { StyleSheet, Text,View,Button,Image} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Header from '../components/Header';

export default class PerfilScreen extends React.Component {
  static navigationOptions = {
    tabBarIcon:({tintColor}) => (
      <Icon name="user-circle" size={25} color="white"/>
    )
  }
    go(){
        this.props.navigation.navigate('Login');  
      }

  render(){ 
    
    return(
        <View style={styles.container}>
          <Header {...this.props} /> 
          <Text style={styles.welcome}>PERFIL</Text>
          <Button
                    backgroundColor="#03A9F4"
                    title="SIGN OUT"
                    onPress={() => this.go()}
            />
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