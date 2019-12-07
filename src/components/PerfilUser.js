import React, {PureComponent} from 'react';
import { StyleSheet, Dimensions,Text,View,ActivityIndicator,ScrollView, TouchableOpacity, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Header from '../components/Header';
import Helpers from '../../lib/helpers'
import firebase from 'react-native-firebase'
import {connect} from 'react-redux'
import UserAvatar from 'react-native-user-avatar';
import { Avatar,Rating, AirbnbRating  } from 'react-native-elements'
import appStyle from '../styles/app.style'
import ImagePicker from 'react-native-image-crop-picker';
import {API} from '../keys';
import {Fonts} from '../utils/Fonts';
import {Colors} from '../styles/colors'
import SmallEvent from '../components/SmallEvent'
const {height, width} = Dimensions.get('window');
import Publication from '../components/SmallPublication'
import Notice from '../components/Notice'
import {IndicatorViewPager, PagerTitleIndicator} from 'rn-viewpager';
import {NavigationEvents} from 'react-navigation';
import Modal from "react-native-modal";
class PerfilUser extends React.Component {
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
      loading:true,
      modalReputation:false,
      componentHeight:0,
    };
  }
  _onLayoutEvent(event) {
    this.setState({componentHeight: event.nativeEvent.layout.height});
  }
  componentDidMount(){
    if(this.props.user_id == undefined){
        user_id = this.props.navigation.getParam('user_id')
    }
    else{
        user_id = this.props.user_id
    }
    return fetch(API + 'users/' + user_id)
    .then( (response) => response.json() )
    .then( (responseJson ) => {
      this.setState({
        user: responseJson['usuario'],
        loading:false
      },() => {this.getPerfil()})
    })
    .catch((error) => {
      console.log("HA OCURRIDO UN ERROR DE CONEXION")
      console.log(error)
      this.setState({loading: false})
    });
    
  }
  getPerfil(){
    this.getPublications()
    if(this.state.user.tipo != "Normal"){
      this.getEvents()
      this.getRescueds()
    }else{this.setState({loadingEvents:false,loadingRescueds:false})}
  }
  getPublications(){
    console.log("ESTOY POR OBTENER LAS PUBLICACIONES!!!!!!!!1")
    return fetch(API + 'publications/user/' + this.state.user.id)
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
    console.log("ESTOY POR OBTENER LOS EVENTOS!!!!!!!!1")
    return fetch(API+'events/user/' + this.state.user.id)
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
    console.log("ESTOY POR OBTENER LOS RESCATADOS!!!!!!!!1")
    return fetch(API+'rescueds/user/' + this.state.user.id)
    .then( (response) => response.json() )
    .then( (responseJson ) => {
      console.log("LSO RESCATADOS SON: ")
      console.log(responseJson)
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
    const name = "user_" + this.state.user.id
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
    fetch(API + 'users/' + this.state.user.id, {
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
            <ScrollView style={{flexGrow:1,marginBottom:20}}>
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
    if(this.state.user.tipo != "Normal"){
      return(
        <View style={{marginVertical:10}}>
          {this.state.loadingEvents != true ?
            <ScrollView style={{flexGrow:1, marginHorizontal:10,marginBottom:20}}>
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
    if(this.state.user.tipo != "Normal"){
      return(
        <View style={{marginVertical:10}}>
          {this.state.loadingRescueds != true ?
            <ScrollView style={{flexGrow:1,marginHorizontal:10,marginBottom:20}}>
              {rescueds.map((rescued) => {
              return (
                <View key={rescued.id} style={[appStyle.containerPublication,{borderColor:Colors.primaryColor, padding:5}]}>
                  <View style={{flexDirection:'row'}}>
                  <UserAvatar size="50" name={rescued.nombre} src={rescued.profile_picture}/>
                  <View style={{flexDirection:'column', alignSelf:'center'}}>
                    <View style={{flexDirection:'row'}}>
                    <Text style={[appStyle.textSemiBold,{alignSelf:'center', marginLeft:10}]}>{rescued.nombre}</Text>
                      <View style={[styles.sexCircle,{backgroundColor:rescued.sexo == "Hembra"? Colors.primaryColor: Colors.violet}]}>
                            {rescued.sexo == "Hembra"? 
                              <Icon name="venus" size={15} color='white' regular/>
                              :<Icon name="mars" size={15} color='white' regular/>
                            }
                      </View>
                      <Icon name="circle" size={6} color={Colors.gray} style={{alignSelf:'center',marginLeft:4}} regular/>
                      <View style={[styles.tagState,{backgroundColor:rescued.estado == "En rehabilitación"? Colors.primaryColor:Colors.violet}]}>
                          <Text style={[appStyle.textSemiBold,{color:'white'}]}>{rescued.estado}</Text>
                      </View>
                    </View>
                   
                      <Text style={[appStyle.textRegular,{marginLeft:10}]}>Registro: {rescued.registro}</Text>
                    </View>
                    
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

  displayReputation(){
    console.log("ESTOY EN DIPSLAY REPUTATION")
    console.log("EL VALOR DEL MODAL ES ")

    if(!this.state.loading && this.state.modalReputation){
      let comments = this.state.user.reputacion.comentarios
      console.log("IMPRIMIENDO EL VALOR FLOTANTE")
      rating = parseFloat(this.state.user.reputacion.rating)
    return(
      <View style={{backgroundColor:'white',height:height*0.72,borderRadius:8}}>
            <View style={[appStyle.headerModal,{position:'absolute',top:0,width:width-40}]}>
              <Text style={{fontFamily:Fonts.OpenSansBold,color:'white',fontSize:20}}>Valoraciones</Text>
            </View>
            <View style={{flexDirection:'row',marginTop: 50,alignSelf:'center'}}>
              <Rating
                  readonly
                  startingValue={rating}
                  //style={{alignSelf:'center' }}
              />
              <Text style={[appStyle.textSemiBold,{alignSelf:'center',fontSize:25,marginLeft:5}]}>{this.state.user.reputacion.rating}</Text>
            </View>
            <View style={{flexDirection:'row',alignSelf:'center'}}>
              <Text style={[appStyle.textSemiBold,{alignSelf:'center'}]}>(Según {comments.length} personas)</Text>
              <Icon name="circle" size={6} color={Colors.gray} style={{alignSelf:'center',marginLeft:4}} regular/>
              <TouchableOpacity style={[appStyle.buttonLarge2,{paddingHorizontal:4,marginTop:2}]}>
                <Text style={[appStyle.buttonLargeText2]}>Dejar opinión</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={{marginTop:0,height:height*0.4}}>
            <View style={[appStyle.lineTop,{marginTop:5}]}>
              { comments.map( (comment) => {
                return(
                  <View key={comment.id} style={[appStyle.lineBottom]}>
                    <View style={{marginHorizontal:10,marginVertical:5}}>
                    <View style={{flexDirection:'row'}}>
                      <TouchableOpacity style={{marginRight:5}} onPress={() => this.setState({modalReputation:false},()=>{this.props.navigation.navigate('User',{user_id: comment.user_id})}) }>
                        <UserAvatar size="40" name={comment.nombre} src={comment.profile_picture}/>
                      </TouchableOpacity>
                      <View>
                        <View style={{flexDirection:'row'}}>
                          <Text style={[appStyle.textSemiBold]}>{comment.nombre}</Text>
                          <Text style={[appStyle.textSemiBold],{marginLeft:5}}>{comment.rating}</Text>
                          <Icon name="star" size={14} color='#ffd21c' style={{alignSelf:'center'}} solid/>
                        </View>
                        <Text style={[appStyle.textRegular]}>{comment.fecha}</Text>
                      </View>
                    </View>
                    <Text style={[appStyle.textRegular,{textAlign:'justify',marginTop:4}]}>{comment.comentario}</Text>
                    </View>
                  </View>
                )}
              )}
            </View>  
            </ScrollView>
            
            <View style={{justifyContent:'flex-end',marginBottom: 10,flex:1}}>
              <View style={{justifyContent: 'center',flexDirection:'row', alignSelf: 'stretch'}}>
              <TouchableOpacity style={[appStyle.buttonModal,appStyle.buttonsModal]}
                  onPress={() => this.setState({modalReputation:false})}>
                    <Text style={appStyle.TextModalButton}>Cerrar</Text>
                </TouchableOpacity>
              </View>
            </View>     
          </View>
    )}
  }

  render(){ 
    console.log("VOY A IMPRIMIR EL VALOR ALTO DEL COMPONENTE")
    console.log(this.state.componentHeight)
    return(
        <View style={{flex:1}}>
          <NavigationEvents onDidFocus={() => {this.setState({loading:true,modalReputation:false},()=>{this.componentDidMount()});}} />
          <Modal isVisible={this.state.modalReputation} style={{margin:20}}>
            {this.displayReputation()}
          </Modal>
          <Header {...this.props} signout={this.state.user.id == this.props.user.id? true:false}/> 
          {!this.state.loading ?
          <View>
          <View style={{backgroundColor:Colors.primaryColor,height:90,justifyContent:'flex-end'}}>
            <View  style={{height:60,paddingVertical:10,flexDirection:'row',justifyContent:'space-between'}}>
              <View style={{width:width*0.5-70,height:40,alignItems:'center'}}>
                {this.state.user.tipo != 'Admin' &&  this.state.user.tipo != 'Normal'?
                <View style={{alignItems:'center'}}>
                  <Icon name="paw" size={25} color='white' regular/>
                  <Text style={[appStyle.buttonLargeText2]}>{this.state.user.rescatados}</Text>
                </View>
                :
                <View style={{alignItems:'center'}}>
                  <Icon name="user-friends" size={25} color='white' regular/>
                  <Text style={[appStyle.buttonLargeText2]}>{this.state.user.seguidos.usuarios.length + this.state.user.seguidos.rescatados.length}</Text>
                </View>
                }
              </View>
              <View style={{width:width*0.5-70,height:40,alignItems:'center'}}>
                <Icon name="user" size={25} color='white' solid/>
                <Text style={[appStyle.buttonLargeText2]}>{this.state.user.seguidores.length}</Text>
              </View>
            </View>
          </View>
          <View style={{position: 'absolute',justifyContent: 'center'}}>
          <View style={{alignItems:'center'}} onLayout={(event) => {
            var {x, y, width, height} = event.nativeEvent.layout;
            console.log("EL ALTO Y ANCHO DEL COMPONENTE ES: ")
            this.setState({componentHeight: event.nativeEvent.layout.height})
            }} >
            {this.state.user.profile_picture || this.state.image? 
            <Avatar rounded size={140} source={{ uri: (this.state.image != "" ? this.state.image.uri : this.state.user.profile_picture) }}  containerStyle={{borderWidth:3,borderColor:'white'}} iconStyle={{}} showEditButton={this.state.user.id == this.props.user.id? true:false} onEditPress={() => this.uploadProfile()}/>
            :
            <Avatar rounded size={140} title={this.state.user.nombre[0]}  containerStyle={{borderWidth:3,borderColor:'white'}} showEditButton={this.state.user.id == this.props.user.id? true:false} onEditPress={() => this.uploadProfile()}/>
            }
            <View style={{flexDirection:'row'}}>  
              <Text style={[appStyle.textBold,{fontSize:16,alignSelf:'center'}]}>{this.state.user.nombre}</Text>
              {this.state.user.tipo != 'Admin' &&  this.state.user.tipo != 'Normal'?
              <View style={[styles.sexCircle,{backgroundColor:Colors.primaryColor}]}>
                  <Icon name="paw" size={15} color='white' regular/>
              </View>:null}
            </View>
              <View style={{alignItems:'center',marginHorizontal:10,paddingBottom:5}}>
              <View style={{flexDirection:'row'}}>
              {this.state.user.tipo != 'Admin' && this.state.user.tipo != 'Normal'?
                <TouchableOpacity  style={{alignSelf:'center',flexDirection:'row'}}  onPress={() => {this.state.user.reputacion != "0"? this.setState({modalReputation:true}):console.log("NO HAY NADA QUE MOSTRAR")}}>
                  <Text style={[appStyle.textSemiBold]}>{this.state.user.reputacion.rating}</Text>
                  <Icon name="star" size={18} color='#ffd21c' style={{marginHorizontal:4}} solid/>
                  <Text style={[appStyle.textRegular],{alignSelf:'center'}}>{this.state.user.reputacion.rating != "0"? "("+this.state.user.reputacion.comentarios.length.toString()+")" :"(0)"}</Text>
                  <Icon name="circle" size={6} color={Colors.gray} style={{alignSelf:'center',marginLeft:4}} regular/>
                </TouchableOpacity>
              :null}
              {this.state.user.id != this.props.user.id?
                <TouchableOpacity style={[appStyle.buttonLarge2,{width:80,marginTop:0}]} onPress={() => {console.log(this.state.componentHeight)}}>
                  <Text style={[appStyle.buttonLargeText2]}>Seguir</Text>
                </TouchableOpacity>
              : 
                <TouchableOpacity style={[appStyle.buttonLarge2,{width:120,marginTop:0}]} onPress={() =>{console.log(this.state.componentHeight)}}>
                  <Text style={[appStyle.buttonLargeText2]}>Editar perfil</Text>
                </TouchableOpacity>}
              </View>
              <Text includeFontPadding={false} style={[appStyle.textRegular,{textAlign:'justify'}]}>{this.state.user.detalles}</Text>
              </View>
          </View>
            <View style={{flex:0,marginHorizontal:5,height:this.state.user.id == this.props.user.id?height-this.state.componentHeight-90:height-this.state.componentHeight-40}}>
              {this.state.user.tipo != "Normal"?
                <IndicatorViewPager
                indicator={this._renderTitleIndicator()}
                style={{flex:1, backgroundColor:'white',flexDirection: 'column-reverse'}}
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
    sexCircle:{
      width:20,height:20,borderRadius:10,marginLeft:5,
      alignItems:'center',justifyContent:'center',alignSelf:'center'
    },
    tagState:{
      borderRadius:4,alignSelf:'center',marginLeft:6,
      paddingHorizontal:5,
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
export default connect(mapStateToProps, mapDispatchToProps)(PerfilUser);