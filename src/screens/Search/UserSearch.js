import React from 'react';
import {ScrollView,View,Text,ActivityIndicator,Dimensions,TouchableOpacity,Picker,Image} from 'react-native';
import Header from '../../components/Header';
import {API} from '../../keys';
import {Colors} from '../../styles/colors'
import appStyle from '../../styles/app.style'
const {height, width} = Dimensions.get('window');
import UserAvatar from 'react-native-user-avatar';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {connect} from 'react-redux'
import { SearchBar } from 'react-native-elements';
import {Fonts} from '../../utils/Fonts'
class UserSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      animal_type: '',
      type: '',
      search: '',
      types:["Normal","Fundacion","Rescatista","Admin"],
      users:[], 
      loading: true,
    }
    this.arrayholder = [];
  }

componentDidMount() {
  return fetch(API + 'users')
  .then( (response) => response.json() )
  .then( (responseJson ) => {
    this.setState({
        users: responseJson['users'],
        loading:false
    }, function() {
        this.arrayholder = responseJson['users'];
      })
  })
  .catch((error) => {
    console.log("HA OCURRIDO UN ERROR DE CONEXION")
    console.log(error)
    this.setState({loading: false})
  });
}

SearchFilterFunction(text,type) {
    console.log("PRIMERO BUSCARE POR PALABRAS")
    //passing the inserted text in textinput
    const newData = this.arrayholder.filter(function(user) {
      //applying filter for the inserted text in search bar
      const itemData = user.nombre ? user.nombre.toUpperCase() : ''.toUpperCase();
      console.log("IMPRIMIRE EL ITEM ADATA")
      console.log(itemData)
      const textData = text.toUpperCase();
      const typeFilter = type == "" ?  true: user.tipo == type
      console.log(textData)
      console.log("condicion usuario: " + type)
      console.log((itemData.indexOf(textData) > -1) && typeFilter)
      return (itemData.indexOf(textData) > -1) && typeFilter;
    });
    this.setState({
      //setting the filtered newData on datasource
      //After setting the data it will automatically re-render the view
      users: newData,
      search: text,
    });
  }   



  render(){ 
    return(
        <View style={{flex:1}}>
         <Header {...this.props} stack='true'/> 
            <View style={{backgroundColor:Colors.primaryColor, padding:10}}>
                <View style={{backgroundColor:'white', alignItems:'center',borderRadius:4}}>
                    <Text style={appStyle.textTitleCalipso}>BUSCAR USUARIOS</Text>
                </View>
            </View>
            <SearchBar
                placeholder="Buscar usuario..."
                onChangeText={text => this.SearchFilterFunction(text,this.state.type)}
                onClear={text => this.SearchFilterFunction('')}
                value={this.state.search}
                containerStyle={{backgroundColor:'white'}}
                inputContainerStyle={appStyle.searchInput}
                inputStyle={{fontSize:16, fontFamily:Fonts.OpenSansSemiBold}}
                lightTheme
            />
            <View style={{flexDirection:'row'}}>
                <Text style={[appStyle.textSemiBold,{marginHorizontal:10,alignSelf:'center'}]}>Tipo de usuario</Text>
            <View style={[appStyle.input,appStyle.inputFilters,{width:120,marginBottom:0,paddingBottom:0}]}>
                <Picker
                    selectedValue={this.state.type}
                    style={[appStyle.pickerFilter,{width:120,marginBottom:0,paddingBottom:0}]}
                    onValueChange={(itemValue, itemIndex) =>{
                    this.setState({type: itemValue},()=>{console.log(this.state.type);this.SearchFilterFunction(this.state.search,this.state.type)})
                    }
                    }>
                    <Picker.Item key={0} color= "#a0a0a0" label="Todos" value= "" />
                    {this.state.types.map( type => (<Picker.Item key={type} color="gray" label={type} value={type} />))}              
                </Picker>
            </View>
            </View>
            
            {!this.state.loading ?
            this.state.users.length == 0?
            <View style={{flex:1,justifyContent:'center',alignItems:'center',marginHorizontal:20}}>
                    <Image
                    source={require('../../icons/search/no-encontrado.png')}
                    style= {{width: height*0.2,height:height*0.2,marginBottom:20}}
                    />
                    <Text style={[appStyle.textBold,{fontSize:16,textAlign:'center'}]}>No se han encontrado usuarios</Text>
            </View>
            :<ScrollView style={{flex:1,marginVertical:10}}>
                <View>
                {this.state.users.map((user) => {
                    return (
                        <View key={user.id} style={[appStyle.containerPublication,{borderColor:Colors.primaryColor, padding:5}]}>
                          <View style={{flexDirection:'row'}}>
                          <UserAvatar size="50" name={user.nombre} src={user.profile_picture}/>
                          <View style={{flexDirection:'column', alignSelf:'center'}}>
                            <View style={{flexDirection:'row'}}>
                            <Text style={[appStyle.textSemiBold,{alignSelf:'center', marginLeft:10}]}>{user.nombre}</Text>
                            </View>
                           
                              <Text style={[appStyle.textRegular,{marginLeft:10}]}>Usuario: {user.tipo}</Text>
                            </View>
                            
                          </View>
                          <TouchableOpacity style={{position:'absolute',width:40,right:0,height:height*0.1,justifyContent:'center'}} onPress={() => {user.id == this.props.user.id? this.props.navigation.navigate('Perfil'):this.props.navigation.navigate('User', { user_id: user.id})}}>
                              <Icon name="chevron-right" size={25} color={Colors.primaryColor} style={{alignSelf:'center'}}/>
                          </TouchableOpacity>
                        </View>
                      )
            
          })}
                </View>
            </ScrollView>
            : 
            <View style={{flex:1,justifyContent:'center'}}>
              <ActivityIndicator size="large" color= {Colors.primaryColor} />
            </View> }
      </View>
    );
    
  }
}


const mapStateToProps = (state) => {
    console.log("EL USER EN SEARCH ES")
    console.log(state.userReducer)
    return {
      user: state.userReducer,
    };
  }
  
  export default connect(mapStateToProps)(UserSearch);