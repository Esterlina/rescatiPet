import React from 'react';
import { StyleSheet, Dimensions,Text,View,ActivityIndicator,ScrollView, TouchableOpacity, Alert,Image} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Header from './Header';
import {connect} from 'react-redux'
import { Avatar } from 'react-native-elements'
import appStyle from '../styles/app.style'
import {API} from '../keys';
import {Colors} from '../styles/colors'
const {height, width} = Dimensions.get('window');
import Publication from './XS_Publication'
import Notice from './Notice'
import {IndicatorViewPager, PagerTitleIndicator} from 'rn-viewpager';
import {NavigationEvents} from 'react-navigation';
import Helpers from '../../lib/helpers'
import RNFetchBlob from 'react-native-fetch-blob';

class PerfilRescued extends React.Component {
  _isMounted = false;
  constructor(props){
    super(props)
    this.state={
      rescued: this.props.navigation.getParam('rescued'),
      loading: true,
      publications:[],
      files:[],
      images:[],
      background: '',
      loadingPublications: true,
      loadingBackground:true,
      loadingFiles: true,
      loadingImages: true,
    };
  }

  componentDidMount(){
    this.getPerfil()
  }
  
  componentWillUnmount() {
    this._isMounted = false;
  }
  getPerfil(){
    if (this.props.navigation.getParam('rescued') == undefined){
      this.getRescued();
    }else{
      this.setState({loading:false})
      this.getPublications();
      this.getBackground();
    }
  }

  getDocuments(){
    if(this.state.files.length == 0){
      for (i=0; i < this.state.background.file_num ; i++) {
        try{
          let path = this.state.background.file_dir + 'file_' + i
          Helpers.getDocument(path, (document)=>{
            this.setState({files: this.state.files.concat([document])})
          })
        }
        catch(error){console.log(error)}}
    }
    this.setState({loadingFiles: false})
  }
  getImages(){
    if(this.state.images.length == 0){
      for (i=0; i < this.state.background.img_num ; i++) {
        try{
          let path = this.state.background.img_dir + 'image_' + i + '.jpg'
          Helpers.getImageUrl(path, (imageUrl)=>{
            this.setState({images: this.state.images.concat([imageUrl])})
          })
        }
        catch(error){console.log(error)}}
    }
    this.setState({loadingImages: false})
  }

  getRescued(){
    let id = this.props.navigation.getParam('rescued_id')
    return fetch(API+'rescueds/' + id)
    .then( (response) => response.json() )
    .then( (responseJson ) => {
    this.setState({
        rescued: responseJson,
    },() => this.setState({loading: false},()=>{this.getPublications();this.getBackground()}))
    })
    .catch((error) => {
    console.log("HA OCURRIDO UN ERROR DE CONEXION")
    console.log(error)
    this.setState({loading: false})
    });
  }
  getBackground(){
    if (this.props.navigation.getParam('background') == undefined){
      return fetch(API+'rescueds/' + this.state.rescued.id + "/background")
        .then( (response) => response.json() )
        .then( (responseJson ) => {
        this.setState({
            background: responseJson['background'],
        },() => {this.setState({loadingBackground: false});this.getDocuments();this.getImages()})
        })
        .catch((error) => {
        console.log("HA OCURRIDO UN ERROR DE CONEXION")
        console.log(error)
        this.setState({loadingBackground: false})
        });
    }else{
      this.setState({background:this.props.navigation.getParam('background'),loadingBackground:false},()=>{this.getDocuments();this.getImages()})
    }
  }

  getPublications(){
    return fetch(API+'publications/rescued/' + this.state.rescued.id)
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
  download(url,name){
    const { config, fs } = RNFetchBlob
    let DownloadDir = fs.dirs.DownloadDir
    let options = {
      fileCache: true,
      addAndroidDownloads : {
        useDownloadManager : true,
        notification : true,
        path:  DownloadDir + "/"+ name,
        description : 'File'
      }
    }
    config(options).fetch('GET', url).then((res) => {
      Alert.alert("La descarga ha sido completada con exito.");
    });
  }
  
  displayImages(){
    return(
      <View>
        <Text style={[appStyle.textSemiBold]}>Imagenes</Text>
        {this.state.loadingImages != true ?
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{marginVertical:10}}>
            {this.state.images.map((image,i) =>{
              console.log("RENDERIZANDO IMAGEN")
              console.log(image)
              return(
                <View key={i} style={styles.imageContainer}> 
                  <Image style={{width: 130, height: 130}} source={{ uri: image }} />
                </View>  
              )
            })}
          </ScrollView>
          :
          <View style={{flex:1,justifyContent:'center'}}>
            <ActivityIndicator size="large" color= {Colors.primaryColor} />
          </View>}
      </View>
    )
  }
  displayFiles(){
    return(
      <View>
        <Text style={[appStyle.textSemiBold]}>Documentos</Text>
        {this.state.loadingFiles != true ?
          <View>
            {this.state.files.map((file,i) => {
            return(
              <View key={i} style={{flexDirection:'row',borderWidth:1,borderColor:Colors.lightGray,padding:5,marginVertical:5}}>
                {file.type == "application/pdf" || file.type == "com.adobe.pdf"? 
                    <Icon name="file-pdf" size={25} color={Colors.red} style={{marginRight:4,alignSelf:'center'}}  solid/>
                :
                <Icon name="file-alt" size={25} color={Colors.gray} style={{marginRight:4,alignSelf:'center'}}  regular/>
                }
                <Text style={[appStyle.textRegular,{flexWrap:'wrap',flex:1}]}>{file.name}</Text>
                <TouchableOpacity style={{width:25,justifyContent:'center'}} onPress={() => this.download(file.url,file.name)}>
                  <View style={{right:0,position:'absolute'}}>
                    <Icon name="download" size={25}/>
                  </View>
                </TouchableOpacity>
              </View>
            )
          })}
          </View>
          :
          <View style={{flex:1,justifyContent:'center'}}>
            <ActivityIndicator size="large" color= {Colors.primaryColor} />
          </View>}
      </View>
    )
  }
  displayPublications(publications){
    return(
      <View style={{marginVertical:10}}>
        {this.state.loadingPublications != true ?
          <ScrollView style={{flexGrow:1, marginHorizontal:5}}>
            {publications.map((publication) => {
            if(publication.tipo_publicacion == "Notice" && publication.tipo != 'Adopcion'){
                return (
                  <Notice key={publication.publication_id} dataJson={publication}
                    navigation={this.props.navigation}
                    /> 
                )
            }
            else if(publication.tipo_publicacion != "Event"){
              return(
                <View key={publication.publication_id} style={{marginHorizontal:5}}>
                  <Publication key={publication.publication_id} publication={publication}
                        navigation={this.props.navigation}
                  /> 
                </View>
              )
            }
          })}
          </ScrollView>
          : 
          <View style={{flex:1,justifyContent:'center',marginTop:50}}>
            <ActivityIndicator size="large" color= {Colors.primaryColor} />
          </View>
        }
      </View>
    )
}
displayBackground(background,rescued){
  return(
    <View style={{marginVertical:10}}>
      {this.state.loadingBackground != true ?
        <ScrollView style={{margin:5,marginBottom:10,flexGrow:1}}>
          <Text style={[appStyle.textSemiBold],{fontSize:16}}>Caracteristicas</Text>
          {rescued.raza?
            <View style={{flexDirection:'row',flexWrap:'wrap'}}>
              <Icon name="paw" size={16} color={Colors.primaryColor} regular/>
              <Text style={appStyle.textRegular}> Raza: {rescued.raza} </Text>
            </View> 
          :null}
          {rescued.colores?
          <View style={{flexDirection:'row'}}>
            <Icon name="palette" size={16} color={Colors.primaryColor} style={{marginRight:4}}  regular/>
              <Text style={appStyle.textRegular}>Colores: {rescued.colores}</Text>               
            </View>
          : null}
          <Text style={[appStyle.textSemiBold],{fontSize:16,marginTop:10}}>Antecedentes</Text>
          {background == 0? 
          <View style={{alignItems:'center',paddingBottom:20}}>
            <Text style={[appStyle.textSemiBold]}>No hay antecedentes asociados a {this.state.rescued.nombre}</Text>
            <Text style={[appStyle.textRegular],{textAlign:'center'}}>Puedes agregar antecedentes/historial, datos veterinarios o relevantes sobre tu rescatado, para que los interesados puedan leerlo.</Text>
            <TouchableOpacity style={[appStyle.buttonLarge2,{paddingHorizontal:10}]} onPress={() =>  this.props.navigation.navigate('BackgroundForm', { rescued: rescued})}>
                <Text style={appStyle.buttonLargeText2}>+ agregar antecedentes</Text>
              </TouchableOpacity>
          </View>
          :
          <View style={{paddingBottom:20}}>
              <View style={{flexDirection:'row',flexWrap:'wrap'}}>
                <Icon name="crutch" size={16} color={Colors.primaryColor} regular/>
                <Text style={appStyle.textRegular}> Vacunas: {background.vacunado? "Sí": "No"} </Text>
              </View> 
              <View style={{flexDirection:'row',flexWrap:'wrap'}}>
                <Icon name="bug" size={16} color={Colors.primaryColor} regular/>
                <Text style={appStyle.textRegular}> Desparacitado: {background.desparacitado? "Sí": "No"} </Text>
              </View>
              {background.detalles?<Text style={[appStyle.textRegular,{marginVertical:5}]}>{background.detalles}</Text>:null}
              {background.file_num > 0? this.displayFiles() : null}
              {background.img_num > 0? this.displayImages():null}
          </View>
          }
        </ScrollView>
        : 
        <View style={{flex:1,justifyContent:'center',marginTop:50}}>
          <ActivityIndicator size="large" color= {Colors.primaryColor} />
        </View>
      }
    </View>
  )
}
  render(){ 
    rescued  = this.state.rescued
    return(
        <View style={{flex:1}}>
          <NavigationEvents onDidFocus={() => {console.log('I am triggered');this.getPerfil()}} />
          <Header stack={'true'} {...this.props} /> 
          {!this.state.loading ?
            <View>
                <View style={{backgroundColor:Colors.primaryColor,height:90,}}></View>
                <View style={{position: 'absolute',justifyContent: 'center'}}>
                  <View style={{alignItems:'center',margin:10}}>
                      <Avatar rounded size={140} source={{ uri: rescued.profile_picture }}  containerStyle={{borderWidth:3,borderColor:'white'}}/>
                      <View style={{marginVertical:5,alignItems:'center'}}>
                        <View style={{flexDirection:'row'}}>
                          <Text style={[appStyle.textBold,{fontSize:18,alignSelf:'flex-end'}]}>{rescued.nombre}</Text>
                          <View style={[styles.sexCircle,{backgroundColor:rescued.sexo == "Hembra"? Colors.primaryColor: Colors.violet}]}>
                            {rescued.sexo == "Hembra"? 
                              <Icon name="venus" size={20} color='white' regular/>
                              :<Icon name="mars" size={20} color='white' regular/>
                            }
                          </View>
                        </View>
                          <View style={{flexDirection:'row',marginTop:4}}>
                            <Text style={appStyle.textRegular}> 452 </Text>
                            <Icon name="heart" size={20} color='#d85a49' style={{marginRight:4}} regular/>
                            <Text> - </Text>
                            <View style={[styles.tagState,{backgroundColor:rescued.estado == "En rehabilitación"? Colors.primaryColor:Colors.violet}]}>
                              <Text style={[appStyle.textSemiBold,{color:'white'}]}>{rescued.estado}</Text>
                            </View>
                          </View> 
                          <Text style={[appStyle.textSemiBold]}>Rescatado por {rescued.rescatista.nombre}</Text>
                          <View style={{flexDirection:'row',flexWrap:'wrap'}}>
                            <Icon name="paw" size={16} color={Colors.primaryColor} regular/>
                            <Text style={appStyle.textRegular}> Edad: {rescued.edad} </Text>
                            <Text style={appStyle.textSemiBold}> - {rescued.esteril? (rescued.sexo == "Hembra" ? "Esterilizada": "Castrado") : "Fertil"}</Text>
                            {rescued.microship? <Text style={appStyle.textSemiBold}> - Microchip</Text> :null}
                          </View> 
                          <Text style={[appStyle.textRegular,{textAlign:'center'}]}>{rescued.detalles}</Text>  
                      </View>
                      
                  </View>
                  <View style={{flex:1,marginHorizontal:5,height:height*0.45}}>
                      <IndicatorViewPager
                          indicator={this._renderTitleIndicator()}
                          style={{flex:1, paddingTop:0, backgroundColor:'white',flexDirection: 'column-reverse'}}
                      >
                          <View>
                              {this.displayPublications(this.state.publications)}
                          </View>
                          <View>
                              {this.displayBackground(this.state.background,rescued)}
                          </View>
                      </IndicatorViewPager>
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
    titles={['Publicaciones','Antecedentes']}
    style={styles.indicatorContainer}
    trackScroll={true}
    itemTextStyle={[appStyle.buttonLargeText2,{color: Colors.lightGray,textAlign: 'center'}]}
    itemStyle={{width:width/2}}
    selectedItemTextStyle={[appStyle.buttonLargeText2,{color: Colors.primaryColor,width:width/2,textAlign: 'center'}]}
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
      width:25,height:25,borderRadius:25/2,marginLeft:5,
      alignItems:'center',justifyContent:'center'
    },
    tagState:{
      borderRadius:4,alignSelf:'center',marginLeft:6,
      paddingHorizontal:5,
    },
    imageContainer:{
      justifyContent:'center',
      alignItems:'center',
      height:130,
      width:130,
      marginHorizontal:5,
    },
    imagesContainer:{
      height:150,
      paddingVertical:10,
      marginHorizontal:10,
      paddingHorizontal:5,
      borderWidth: 1.3,
      borderColor: Colors.lightGray,
      borderRadius: 4,
      justifyContent:'center',
      alignItems:'center'
    },
  });

const mapStateToProps = (state) => {
  return {
    user: state.userReducer,
  };
}

export default connect(mapStateToProps)(PerfilRescued);