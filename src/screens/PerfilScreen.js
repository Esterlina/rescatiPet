import React, {PureComponent} from 'react';
import { StyleSheet, Dimensions,Text,View,ActivityIndicator,ScrollView, TouchableOpacity, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Header from '../components/Header';
import Helpers from '../../lib/helpers'
import firebase from 'react-native-firebase'
import {connect} from 'react-redux'
import UserAvatar from 'react-native-user-avatar';
import { Avatar } from 'react-native-elements'
import appStyle from '../styles/app.style'
import ImagePicker from 'react-native-image-crop-picker';
import {API} from '../keys';
import {Colors} from '../styles/colors'
import SmallEvent from '../components/SmallEvent'
const {height, width} = Dimensions.get('window');
import Publication from '../components/SmallPublication'
import Notice from '../components/Notice'
import {IndicatorViewPager, PagerTitleIndicator} from 'rn-viewpager';
class PerfilScreen extends PureComponent {
  _isMounted = false;
  constructor(props){
    super(props)
    this.state={
      response: '',
      image: '',
      url_image: '',
      user:{},
      publications:[],
      events:[],
      rescueds:[],
      loadingEvents: true,
      loadingRescueds: true,
      loadingPublications:true,
      loading:false,
    };
    this.signOut = this.signOut.bind(this)
  }
  static navigationOptions = {
    tabBarIcon:({tintColor}) => (
      <Icon name="user-circle" size={25} color="white"/>
    )
  }
  componentDidMount(){
    this.getPublications()
    if(this.props.user.tipo != "Normal"){
      this.getEvents()
      this.getRescueds()
    }
  }
  getPublications(){
    return fetch(API + 'publications/user/' + this.props.user.id)
    .then( (response) => response.json() )
    .then( (responseJson ) => {
      this.setState({
        publications: responseJson['publicaciones'],
      },() => this.setState({loadingPublications: false}))
    })
    .catch((error) => {
      console.log("HA OCURRIDO UN ERROR DE CONEXION")
      console.log(error)
      this.setState({loadingPublications: false})
    });
  }
  getEvents(){
    return fetch(API+'events/user/' + this.props.user.id)
    .then( (response) => response.json() )
    .then( (responseJson ) => {
      this.setState({
        events: responseJson['events'],
      },() => this.setState({loadingEvents: false}))
    })
    .catch((error) => {
      console.log("HA OCURRIDO UN ERROR DE CONEXION")
      console.log(error)
      this.setState({loadingEvents: false})
    });
  }
  getRescueds(){
    return fetch(API+'rescueds/user/' + this.props.user.id)
    .then( (response) => response.json() )
    .then( (responseJson ) => {
      this.setState({
        rescueds: responseJson['rescueds'],
      },() => this.setState({loadingRescueds: false}))
    })
    .catch((error) => {
      console.log("HA OCURRIDO UN ERROR DE CONEXION")
      console.log(error)
      this.setState({loadingRescueds: false})
    });
  }


  pickSingle() {
    ImagePicker.openPicker({
      width: 200,
      height: 200,
      //cropping: cropit,
      cropperCircleOverlay: true,
      includeExif: true,
    }).then(image => {
      console.log('received image', image);
      this.setState({
        image: {uri: image.path, width: image.width, height: image.height, mime: image.mime},
      }, ()=>{this.uploadImage(this.state.image.uri)});
    }).catch(e => {
      console.log(e);
      Alert.alert(e.message ? e.message : e);
    });
  }
  async uploadImage(uri) {
    console.log("ESTOY SUBIENDO LA FOTO " );
    const name = "user_" + this.props.user.id
    firebase.storage().ref("images/profiles/users/" + name ).putFile(uri)
    .then(file => {console.log("TERMINE DE SUBIR LA IMAGEN");
    Helpers.getImageUrl(file.ref, (imageUrl)=>{
      this.setState({
        url_image: imageUrl
      },()=> {this.firebaseToken()})
    });
    console.log(file.ref)})
    .catch(error => console.log(error));
  }
  uploadProfile(){
    this.pickSingle()

  }

  async firebaseToken() {
    const currentUser = firebase.auth().currentUser
     if (currentUser) {
      const idToken = await currentUser.getIdToken();
      console.log("IMPRIMIRE EL TOKEN:");
      console.log(idToken);
      this.getUserData(idToken)
    }
  }

  getUserData(idToken){
    console.log("AHORA OBTENDRE LOS DATOS DEL USUARIO")
    fetch(API + 'users/data_user', {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': idToken,
      },
      body: JSON.stringify({
        profile_picture: this.state.url_image
      }),
    })
    .then((response) => response.json())
    .then((responseJson) => {
      let user = responseJson['usuario']
      console.log(user)
      this.setState({user: user},() => {this.props.updateUser(this.state.user)})
    }).catch((error) =>{
      console.error(error);
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  displayPublications(publications){
      return(
        <View style={{marginVertical:10}}>
          {this.state.loadingpublications != true ?
            <ScrollView style={{flexGrow:1}}>
              {publications.map((publication) => {
              if(publication.tipo_publicacion == "Notice" && publication.tipo != 'Adopcion'){
                  return (
                    <Notice key={publication.publication_id} notice={publication}
                      navigation={this.props.navigation}
                      /> 
                  )
              }
              else{
                return(
                    <Publication key={publication.publication_id} publication={publication}
                          navigation={this.props.navigation}
                    /> 
                )
              }
            })}
            </ScrollView>
            : 
            <View style={{flex:1,justifyContent:'center'}}>
              <ActivityIndicator size="large" color= {Colors.primaryColor} />
            </View>
          }
        </View>
      )
  }
  displayEvents(events){
    if(this.props.user.tipo != "Normal"){
      return(
        <View style={{marginVertical:10}}>
          {this.state.loadingEvents != true ?
            <ScrollView style={{flexGrow:1, marginHorizontal:10}}>
              {events.map((event) => {
              return (
                <SmallEvent key={event.id} event={event}
                navigation={this.props.navigation}
                />
              )
            })}
            </ScrollView>
            : 
            <View style={{flex:1,justifyContent:'center'}}>
              <ActivityIndicator size="large" color= {Colors.primaryColor} />
            </View>
          }
        </View>
      )
    }
  }
  displayRescueds(rescueds){
    if(this.props.user.tipo != "Normal"){
      return(
        <View style={{marginVertical:10}}>
          {this.state.loadingRescueds != true ?
            <ScrollView style={{flexGrow:1,marginHorizontal:10}}>
              {rescueds.map((rescued) => {
              return (
                <View key={rescued.id} style={[appStyle.containerPublication,{borderColor:Colors.primaryColor, padding:5}]}>
                  <View style={{flexDirection:'row'}}>
                  <UserAvatar size="50" name={rescued.nombre} src={rescued.profile_picture}/>
                    <Text style={[appStyle.textSemiBold,{alignSelf:'center', marginLeft:10}]}>{rescued.nombre}</Text>
                  </View>
                  <TouchableOpacity style={{position:'absolute',width:40,right:0,height:height*0.1,justifyContent:'center'}} onPress={() =>  this.props.navigation.navigate('Rescued', { rescued_id: rescued.id})}>
                      <Icon name="chevron-right" size={25} color={Colors.primaryColor} style={{alignSelf:'center'}}/>
                  </TouchableOpacity>
                </View>
              )
            })}
            </ScrollView>
            : 
            <View style={{flex:1,justifyContent:'center'}}>
              <ActivityIndicator size="large" color= {Colors.primaryColor} />
            </View>
          }
        </View>
      )
    }
  }
  render(){ 
    console.log("IMPRIMIRE EL VALOR DE LA FOTO DE PERFIL")
    console.log(this.props.user.profile_picture)
    return(
        <View style={{flex:1}}>
          <Header {...this.props} signout={true}/> 
          {!this.state.loading ?
          <View>
          <View style={{backgroundColor:Colors.primaryColor,height:90,}}></View>
          <View style={{position: 'absolute',justifyContent: 'center'}}>
          <View style={{alignItems:'center'}}>
            {this.props.user.profile_picture || this.state.image? 
            <Avatar rounded size={140} source={{ uri: (this.state.image != "" ? this.state.image.uri : this.props.user.profile_picture) }}  containerStyle={{borderWidth:3,borderColor:'white'}} iconStyle={{}} editButton={{ name: 'mode-edit', type: 'material', color: '#fff', underlayColor: '#000' }} showEditButton/>
            :
            <Avatar rounded size={140} title={this.props.user.nombre[0]}  containerStyle={{borderWidth:3,borderColor:'white'}} showEditButton/>
            }
            
            <Text style={[appStyle.textBold,{fontSize:16,alignSelf:'center'}]}>{this.props.user.nombre}</Text>
          </View>
            <View style={{flex:1,marginHorizontal:5}}>
              {this.props.user.tipo != "Normal"?
                <IndicatorViewPager
                indicator={this._renderTitleIndicator()}
                style={{flex:1, paddingTop:20, backgroundColor:'white',flexDirection: 'column-reverse'}}
                >
                  <View>
                      {this.displayPublications(this.state.publications)}
                  </View>
                  <View>
                      {this.displayEvents(this.state.events)}
                  </View>
                  <View>
                      {this.displayRescueds(this.state.rescueds)}
                  </View>
                </IndicatorViewPager>
              :
              <View style={{marginVertical:15,paddingBottom:30}}>
                <Text style={[appStyle.buttonLargeText2,{color: Colors.primaryColor,width:width/3,textAlign: 'center'}]}>Publicaciones</Text>
                {this.displayPublications(this.state.publications)}
              </View>
              }
              </View>
            </View>
          </View>
          : 
          <View style={{flex:1,justifyContent:'center'}}>
            <ActivityIndicator size="large" color= {Colors.primaryColor} />
          </View> }   
      </View>
    );
    
  }

  _renderTitleIndicator() {
    return <PagerTitleIndicator
    titles={['Publicaciones', 'Eventos', 'Rescatados']}
    style={styles.indicatorContainer}
    trackScroll={true}
    itemTextStyle={[appStyle.buttonLargeText2,{color: Colors.lightGray,textAlign: 'center'}]}
    itemStyle={{width:width/3}}
    selectedItemTextStyle={[appStyle.buttonLargeText2,{color: Colors.primaryColor,width:width/3,textAlign: 'center'}]}
    selectedBorderStyle={styles.selectedBorderStyle}
    />;
}

}

const styles = StyleSheet.create({
    indicatorContainer: {
      backgroundColor: 'white',
      width:width-10,
      height: 30,
  },
    selectedBorderStyle: {
        height: 3,
        backgroundColor: Colors.primaryColor,
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

const mapDispatchToProps = (dispatch) => {
  // Action
    return {
      // update user
      updateUser: (user) => dispatch({
        type: 'UPDATE_USER',
        userReducer: user,
       // payload: payload,
      }),
   };
};
export default connect(mapStateToProps, mapDispatchToProps)(PerfilScreen);