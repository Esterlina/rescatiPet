import React from 'react';
import { StyleSheet, Text,View,ActivityIndicator,TouchableOpacity,Dimensions, ScrollView,Image, TextInput,Picker,Switch} from 'react-native';
import {API} from '../keys';
import Header from './Header';
import {connect} from 'react-redux'
import appStyle from '../styles/app.style'
import {Colors} from '../styles/colors'
import firebase from 'react-native-firebase'
import UserRequest from './UserRequest'
const {height, width} = Dimensions.get('window');
class UserRequests extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      requests:{},
      loading:true,
      token:''     
    };
}

async firebaseToken() {
    const currentUser = firebase.auth().currentUser
     if (currentUser) {
    // reaches here
      const idToken = await currentUser.getIdToken();
      console.log("IMPRIMIRE EL TOKEN A ENVIAR:");
      console.log(idToken);
    // never reaches here
    this.setState({token: idToken})
    return idToken
    }
}

componentDidMount(){
    this.firebaseToken();
    return fetch(API + 'users/requests')
      .then((response) => response.json())
      .then((responseJson) => {
      this.setState({
        requests: responseJson['solicitudes'],loading:false});
      })
      .catch((error) =>{
      console.error(error);
    });
}
updateRequests(request){
    const requests = this.state.requests.slice() //copy the array
    index = requests.findIndex(item => item.id === request.id);
    requests[index]= request
    console.log("VOY A HACER UPDATE REQUEST, YEL ANTES ES: ")
    console.log(this.state.requests)
    this.setState({requests:requests},()=>{console.log("Y AHORA: ");console.log(this.state.requests)})
  }
  render(){ 
    return(
        <View style={styles.container}>
            <Header {...this.props} stack={'true'}/> 
            {!this.state.loading?
             <ScrollView style={styles.container}>
                <View style={{marginTop:10}}>
                <Text style={[appStyle.textSemiBold, {color: Colors.primaryColor, fontSize:20,alignSelf:'center'}]}>SOLICITUDES</Text>
                   {this.state.requests.length > 0? 
                    this.state.requests.map((request)=>{
                       return(
                        <View key={request.id}>
                            <UserRequest key={request.id} update= {this.updateRequests.bind(this)} user_request={request} navigation={this.props.navigation}/>                    
                        </View>
                       )
                   })
                   :
                   <Text style={[appStyle.textSemiBold,{fontSize:16,alignSelf:'center'}]}>No hay solicitudes</Text>}
                </View>
            </ScrollView>
            : 
            <View style={{justifyContent:'center',flex:1}}>
                <ActivityIndicator size="large" color={Colors.primaryColor} />
            </View> }
      </View>
    );
    
  }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
  });

  const mapStateToProps = (state) => {
    console.log('State:');
    console.log(state);  // Redux Store --> Component
    console.log(state.userReducer)
    return {
      user: state.userReducer,
    };
  }
  
  export default connect(mapStateToProps)(UserRequests);