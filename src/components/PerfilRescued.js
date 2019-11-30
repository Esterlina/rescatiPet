import React from 'react';
import { StyleSheet, Dimensions,Text,View,ActivityIndicator,ScrollView, TouchableOpacity, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Header from './Header';
import {connect} from 'react-redux'
import UserAvatar from 'react-native-user-avatar';
import appStyle from '../styles/app.style'
import {API} from '../keys';
import {Colors} from '../styles/colors'
const {height, width} = Dimensions.get('window');
import Publication from './XS_Publication'
import Notice from './Notice'
import {IndicatorViewPager, PagerTitleIndicator} from 'rn-viewpager';


class PerfilRescued extends React.Component {
  _isMounted = false;
  constructor(props){
    super(props)
    this.state={
      rescued: this.props.navigation.getParam('rescued'),
      loading: true,
      publications:[],
      loadingPublications: true,
    };
  }

  componentDidMount(){
    if (this.props.navigation.getParam('rescued') == undefined){
    this.getRescued();
    }else{
      this.getPublications()
    }
  }
  
  componentWillUnmount() {
    this._isMounted = false;
  }
  
  getRescued(){
    let id = this.props.navigation.getParam('rescued_id')
    return fetch(API+'rescueds/' + id)
    .then( (response) => response.json() )
    .then( (responseJson ) => {
    this.setState({
        rescued: responseJson,
    },() => this.setState({loading: false},()=>{this.getPublications()}))
    })
    .catch((error) => {
    console.log("HA OCURRIDO UN ERROR DE CONEXION")
    console.log(error)
    this.setState({loading: false})
    });
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
  displayPublications(publications){
    return(
      <View style={{marginVertical:10}}>
        {this.state.loadingPublications != true ?
          <ScrollView style={{height: 200, marginHorizontal:5}}>
            {publications.map((publication) => {
            console.log(publication)
            if(publication.tipo_publicacion == "Notice" && publication.tipo != 'Adopcion'){
                return (
                  <Notice key={publication.publication_id} dataJson={publication}
                    navigation={this.props.navigation}
                    /> 
                )
            }
            else if(publication.tipo_publicacion != "Event"){
              console.log("ENTRE PORQ SOY STORY")
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

  render(){ 
    rescued  = this.state.rescued
    return(
        <View style={{flex:1}}>
          <Header stack={'true'} {...this.props} /> 
          {!this.state.loading ?
            <View>
                <View style={{backgroundColor:Colors.primaryColor,height:90,}}></View>
                <View style={{position: 'absolute',justifyContent: 'center'}}>
                  <View style={{alignItems:'center',margin:10}}>
                      <UserAvatar size="140" name={rescued.nombre} src={rescued.profile_picture}/>
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
                              <Text>Antecedentes</Text>
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
    }
  });

const mapStateToProps = (state) => {
  console.log('State:');
  console.log(state);  // Redux Store --> Component
  console.log(state.userReducer)
  return {
    user: state.userReducer,
  };
}

export default connect(mapStateToProps)(PerfilRescued);