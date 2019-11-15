import React from 'react';
import {ScrollView,View,Text,ActivityIndicator,Dimensions,TouchableOpacity,Picker,Image} from 'react-native';
import Header from '../../components/Header';
import {API} from '../../keys';
import RequestHome from '../../components/DetailRequestHome'
import {Colors} from '../../styles/colors'
import appStyle from '../../styles/app.style'
const {height, width} = Dimensions.get('window');
export default class RequestHomes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      request_homes:[], 
      loading: true,
    }
  }

componentDidMount() {
  return fetch(API+'temporary_homes/requests')
  .then( (response) => response.json() )
  .then( (responseJson ) => {
    this.setState({
      request_homes: responseJson['request_homes'],
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
        <View style={{flex:1}}>
         <Header {...this.props} stack='true'/> 
            {!this.state.loading ?
            this.state.request_homes.length == 0?
            <View style={{flex:1,justifyContent:'center',alignItems:'center',marginHorizontal:20}}>
                    <Image
                    source={require('../../icons/search/no-encontrado.png')}
                    style= {{width: height*0.2,height:height*0.2,marginBottom:20}}
                    />
                    <Text style={[appStyle.textBold,{fontSize:16,textAlign:'center'}]}>No se han encontrado solicitudes de hogares temporales</Text>
            </View>
            :<ScrollView style={{flex:1}}>
                <View style={{marginVertical:10}}>
                    {this.state.request_homes.map((request_home) => {
                    console.log(request_home)
                        return (
                        <RequestHome key={request_home.id} request_home={request_home}
                            navigation={this.props.navigation}
                            /> 
                        )
                    })}
                </View>
            </ScrollView>
            : 
            <View style={{flex:1,justifyContent:'center'}}>
              <ActivityIndicator size="large" color= {Colors.violet} />
            </View> }
      </View>
    );
    
  }
}
