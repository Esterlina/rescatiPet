import React, {Component} from 'react';
import {
    View,
    Dimensions,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    Picker,
    ActivityIndicator
} from 'react-native'
import { API} from '../keys';
import firebase from 'react-native-firebase'
import {Colors} from '../styles/colors';
import appStyle from '../styles/app.style'
import {connect} from 'react-redux';
import { CheckBox } from 'react-native-elements'
import {NavigationEvents,NavigationActions} from 'react-navigation';
const {width,height} = Dimensions.get('window')

class ModalFeedback extends Component{

    constructor(props) {
        super(props);
        this.state = {
            motives: [],
            state_change: false,
            motive:'',
            details: '',
            another_motive: '',
            loading:true,
          };
      }
      componentDidMount(){
        console.log("COMPONEN DID MOUNT D EFEEDBACK")
        return fetch(API + 'publications/possible_motives/' + this.props.publication.publication_id)
        .then((response) => response.json())
        .then((responseJson) => {
          this.setState({
            motives: responseJson['motivos'],
          },()=> {this.firebaseToken();this.setState({loading:false})});
        })
        .catch((error) =>{
          console.error(error);
        });
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

      validate(){
          if (this.state.details == "" || this.state.motive == ""){
            alert("Hay campos vacios.")
          }
          else{
              this.sendFeedback()
          }
      }

      sendFeedback(){
        this.setState({modalSend:true,loading:true})
        fetch(API + 'publications/feedback/' + this.props.publication.publication_id, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': this.state.token,
        },
        body: JSON.stringify({
            state_change: this.state.state_change,
            motive: this.state.motive,
            details: this.state.details,
            another_motive: this.state.another_motive            
        }), 
        }).then((response) => response.json())
        .then((responseJson) => {
            this.props.updatePublication(responseJson);
            console.log(responseJson);
            Alert.alert(
                'Retroalimentación lista',
                "Se ha agregado correctamente.",
                [{text: 'OK', onPress: () => this.props.update(false)}],
                {cancelable:false}
            )
        }).catch((error) =>{
            this.setState({response: error})
            console.error(error);
        });
      }

    render(){
      console.log("PROBANDO LAS COSASSSSSSSSSSSSSSS")
      console.log(this.props.publication)
      console.log(this.props.publication.publication_id)
      console.log(this.state.motives)
        return(
            
            <View style={[appStyle.modalContainer,{height:height*0.6,paddingVertical:0}]}>
              <NavigationEvents onDidFocus={() => {console.log("RENDERIZANDO SCREEN DESDE CERO");this.setState({loading:true},()=>{this.componentDidMount()});}} />
            {!this.state.loading?
            <View style={{justifyContent:'flex-end',marginBottom: 10,flex:1}}>
                <View style={[appStyle.headerModal,{backgroundColor: Colors.primaryColor,top:0,width:width-40}]}>
                    <Text style={[appStyle.textTitle,{color:'white'}]}>Agregar Feedback</Text>
                </View>
                <View style={{marginHorizontal:15,position:'absolute',top:50}}>
                    {this.props.publication.estado != "Cerrado" ?
                    <View>
                        <Text style={[appStyle.textSemiBold,{textAlign:'justify'}]}>¿Desea cerrar el caso?</Text>
                        <View style={{flexDirection:'row',marginVertical:5, alignSelf:'stretch'}}>
                                <CheckBox
                                checked={this.state.state_change}
                                onPress={() => this.setState({state_change: !this.state.state_change})}
                                checkedColor = {Colors.green}
                                size={25}
                                containerStyle = {{borderWidth:0,backgroundColor:'white',margin:0,marginRight:0,padding:0}}
                                />
                                <Text style={appStyle.textRegular}>Sí</Text>
                                <CheckBox
                                checked={!this.state.state_change}
                                onPress={() => this.setState({state_change: !this.state.state_change})}
                                checkedColor = {Colors.green}
                                textStyle ={[appStyle.textRegular,{margin:0,padding:0}]}
                                size={25}
                                containerStyle = {{borderWidth:0,backgroundColor:'white',margin:0,marginRight:0,padding:0}}
                                />
                                <Text style={appStyle.textRegular}>No, solo agregar feedback</Text>
                        </View>
                    </View>
                    :null}
                    <Text style={[appStyle.textSemiBold,{textAlign:'justify'}]}>Motivo</Text>
                    <View style={[appStyle.input,{height:30,width:width*0.8,borderColor:Colors.lightGray,marginVertical:0}]}>
                        <Picker
                            selectedValue={this.state.motive}
                            style={{color:'gray',height:30, width:width*0.8, alignSelf:'center'}}
                            onValueChange={(itemValue, itemIndex) =>
                                {this.setState({motive:itemValue})}}>
                            <Picker.Item key={0} color= "#a0a0a0" label="" value="" />
                            {this.state.motives.map( (motive,i) => (<Picker.Item key={i} color="gray" label={motive} value={motive} />))}              
                        </Picker>
                    </View>
                    {this.state.motive == "Otro"?
                        <TextInput
                            style = {[appStyle.input, appStyle.textRegular,{borderColor:Colors.lightGray}]}
                            placeholder = {'Escriba el motivo ...'}
                            placeholderTextColor = {'gray'}
                            onChangeText={(value) => this.setState({another_motive: value})}
                        />
                    : null}
                    <View style={{width:width*0.8,marginVertical: this.state.motive =="Otro"? 0:10}}>
                        <TextInput
                                style = {[appStyle.inputArea, appStyle.textRegular]}
                                placeholder = {'Agregar comentario ...'}
                                placeholderTextColor = {'gray'}
                                multiline={true}
                                numberOfLines={this.state.motive =="Otro"? 4:10}
                                onChangeText={(value) => this.setState({details: value})}
                        />
                    </View>
                </View>
                
                
                <View style={{justifyContent: 'center',flexDirection:'row', alignSelf: 'stretch',paddingBottom:10}}>
                    <TouchableOpacity style={[appStyle.buttonModal,appStyle.buttonsModal]}
                    onPress={() => this.props.update(false)}>
                        <Text style={appStyle.TextModalButton}>Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[appStyle.buttonModal,appStyle.buttonsModal,{backgroundColor: Colors.primaryColor,borderWidth: 0}]}
                        onPress={() => {this.validate()}}>
                        <Text style={[appStyle.TextModalButton,{color:'white'}]}>Aceptar</Text>
                    </TouchableOpacity>
                </View>
            </View> 
            :
            <View style={{flex:1,justifyContent:'center'}}>
              <ActivityIndicator size="large" color= {Colors.primaryColor} />
            </View> }   
          </View>
          
        )
    }
}
const mapStateToProps = (state) => {
    return {
      user: state.userReducer,
    };
  };
  export default connect(mapStateToProps)(ModalFeedback);
