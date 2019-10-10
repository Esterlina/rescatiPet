import React from 'react';
import { StyleSheet, Text,TouchableOpacity, ScrollView,View,Image,ActivityIndicator} from 'react-native';
import Header from '../components/Header';
import {API} from '../keys';
import SmallNotice from '../components/Notice'

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    console.ignoredYellowBox = [
      'Setting a timer'
    ];
    this.state = {
      notices:[], 
      loading: true,
    }
  }
static navigationOptions = {
  tabBarIcon:({tintColor}) => (
    <Image
      source={require('../icons/tabs/kennel.png')}
      style= {{width:25,height:25,tintColor:'white'}}
    >
    </Image>
  )
}

componentDidMount() {
  return fetch(API+'notices')
  .then( (response) => response.json() )
  .then( (responseJson ) => {
    this.setState({
      notices: responseJson['notices'],
    },() => this.setState({loading: false}))
  })
  .catch((error) => {
    console.log("HA OCURRIDO UN ERROR DE CONEXION")
    console.log(error)
    this.setState({loading: false})
  });
}

  render(){ 
    
    return(
        <View style={styles.container}>
          <Header {...this.props}/> 
          {!this.state.loading ?
            <ScrollView style={styles.container}>
              {this.state.notices.map((item) => {
                console.log(item)
                return (
                  <SmallNotice key={item.id} dataJson={item}
                    navigation={this.props.navigation}
                    /> 
                  
                )
              })}
            </ScrollView>
            
            : <ActivityIndicator size="large" color="#66D2C5" />}
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