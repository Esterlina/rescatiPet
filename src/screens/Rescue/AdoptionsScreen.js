import React from 'react';
import {ScrollView,View,Image,ActivityIndicator} from 'react-native';
import Header from '../../components/Header';
import {API} from '../../keys';
import Adoption from '../../components/DetailAdoption'
import {Colors} from '../../styles/colors'
import firebase from 'react-native-firebase'


export default class AdoptionsScreen extends React.Component {
  constructor(props) {
    super(props);
    console.ignoredYellowBox = [
      'Setting a timer'
    ];
    this.state = {
      adoptions:[], 
      loading: true,
    }
  }

componentDidMount() {
  return fetch(API+'notices/adoptions')
  .then( (response) => response.json() )
  .then( (responseJson ) => {
    this.setState({
      adoptions: responseJson['adoptions'],
    },() => this.setState({loading: false}))
  })
  .catch((error) => {
    console.log("HA OCURRIDO UN ERROR DE CONEXION")
    console.log(error)
    this.setState({loading: false})
  });
}

  render(){ 
    console.log(this.state.adoptions)
    return(
        <View style={{flex:1}}>
         <Header {...this.props} stack='true'/> 
          {!this.state.loading ?
            <ScrollView style={{flex:1,marginTop:10}}>
              {this.state.adoptions.map((adoption) => {
                console.log(adoption)
                return (
                  <Adoption key={adoption.id} adoption={adoption}
                    navigation={this.props.navigation}
                    /> 
                )
              })}
            </ScrollView>
            : 
            <View style={{flex:1,justifyContent:'center'}}>
              <ActivityIndicator size="large" color= {Colors.violet} />
            </View> }
      </View>
    );
    
  }
}
