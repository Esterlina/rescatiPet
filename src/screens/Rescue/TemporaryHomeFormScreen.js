import React from 'react';
import { StyleSheet, Text,View,Image, Dimensions,TouchableOpacity, TextInput,Picker,ScrollView, ActivityIndicator} from 'react-native';
import Header from '../../components/Header';
import Modal from "react-native-modal";
import appStyle from '../../styles/app.style'
import {Colors} from '../../styles/colors';
import {Fonts} from '../../utils/Fonts';
import {API} from '../../keys';
import { CheckBox } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome5';
import firebase from 'react-native-firebase'
const {width,height} = Dimensions.get('window');

export default class TemporaryHomeFormScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          phone: '',
          occupation: '',
          comuna:'', 
          region:'',
          region_id: 0,
          comuna_id: 0,
          home_type: '',
          time:'',
          number_time: 0,
          children: false,
          older_adults:false,
          pets: false,
          number_pets: 0,
          pets_type: [],
          rescued_receive: [],
          cat:false,
          dog:false,
          home_types:[],
          times:[],
          comunas:[],
          regions:[],
          animal_types: [],
          info: false,
          modalSend:false,
          modalAnimals:false,
          loading: false,
          temporary_home:{},
          token: '',
        };
    }

    componentDidMount(){
       this.firebaseToken()
        return fetch(API + 'temporary_homes/info')
            .then((response) => response.json())
            .then((responseJson) => {
            this.setState({
                animal_types: responseJson['tipos_animales'],
                home_types: responseJson['tipo_hogar'],
                times: responseJson['tiempo'],
                regions: responseJson['regiones']
            });
            })
            .catch((error) =>{
            console.error(error);
        });
    }
    async firebaseToken() {
        const currentUser = firebase.auth().currentUser
         if (currentUser) {
          const idToken = await currentUser.getIdToken();
          console.log("IMPRIMIRE EL TOKEN A ENVIAR:");
          console.log(idToken);
        this.setState({token: idToken})
        return idToken
        }
    }
    getComunasByRegion(){
        console.log("VOY A BUSCAR LAS COMUNAS")
        console.log(this.state.region_id)
        if(this.state.region_id != 0){
            return fetch(API + 'temporary_homes/comunas/' + this.state.region_id)
            .then((response) => response.json())
            .then((responseJson) => {
                console.log("IMPRIMIRE LA RESPUESTA")
                console.log(responseJson)
            this.setState({
                comunas: responseJson['comunas'],
            },()=> {console.log(this.state.region_id)});
            })
            .catch((error) =>{
            console.error(error);
        });
        }
    }
    changeAnimal(animal_type){
        const animal_types = this.state.animal_types.slice() //copy the array
        index = animal_types.findIndex(item => item.id === animal_type.id);
        animal_types[index].select = (animal_type.select? false:true)
        this.setState({animal_types: animal_types}) 
      }
      setAnimals(){
        const animals = []
        this.state.animal_types.map(function(animal_type) {
          if(animal_type.select){
            animals.push(animal_type.name);
          }
        });
        this.setState({pets_type:animals})
      }
      keepAnimals(){
        const seleccionados = this.state.pets_type.slice()
        const animals = this.state.animal_types.slice() //copy the array 
        animals.map(function(animal_type){
          if(seleccionados.length != 0){
            if(seleccionados.includes(animal_type.name)){
              animal_type.select = true;
            }else{
              animal_type.select = false;
            }
          }else{
            animal_type.select = false;
          }
        });
        this.setState({animal_types:animals})
      }
    validate(){
        if(this.state.phone == '' || this.state.occupation == '' || this.state.comuna == '' || this.state.home_type == '' || this.state.time == ''){
            alert("Hay datos sin completar en el formulario.")
            return false
        }
        if(this.state.number_time == 0 && this.state.time != 'Indefinido'){
            alert("Por favor, ingrese la cantidad de " + this.state.time)
            return false
        }
        if(this.state.pets && (this.state.number_pets == 0 || this.state.pets_type.length == 0)){
            alert("Si ud tiene mascota(s), por favor ingrese la cantidad de mascotas y su(s) tipo(s)")
            return false
        }
        if(!this.state.cat && !this.state.dog){
            alert("Marca el tipo de animal que puedes recibir.")
            return false
        }
        else{
            console.log("VOY A IMPRIMIR LOS MARCADOS")
            console.log(this.state.dog)
            console.log(this.state.cat)
            console.log("AHORA HARE UN PUSH")
            const pets = []
            if(this.state.cat){
                pets.push("Gato");
            }
            if(this.state.dog){
                pets.push("Perro");
            }
            this.setState({rescued_receive: pets},() =>{
                console.log(this.state.phone)
                console.log(this.state.occupation)
                console.log(this.state.comuna)
                console.log(this.state.home_type)
                console.log(this.state.children)
                console.log(this.state.older_adults)
                console.log(this.state.pets)
                console.log(this.state.number_pets)
                console.log(this.state.pets_type)
                console.log(this.state.rescued_receive)
                console.log(this.state.number_time)
                console.log(this.state.time)
                this.sendTemporaryHome();
            })
        }
    }
    sendTemporaryHome(){
        this.setState({modalSend:true,loading:true})
        fetch(API + 'temporary_homes', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': this.state.token,
        },
        body: JSON.stringify({
          phone: this.state.phone,
          occupation: this.state.occupation,
          comuna: this.state.comuna,
          home_type: this.state.home_type,
          children: this.state.children,
          older_adults: this.state.older_adults,
          pets: this.state.pets,
          number_pets: this.state.number_pets,
          pets_type: this.state.pets_type,
          rescued_receive: this.state.rescued_receive,
          number_time: this.state.number_time,
          time: this.state.time
        }), 
      }).then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson);
          this.setState({temporary_home: responseJson},()=>{
              console.log("IMPRIMIRE EL RESULTADO")
              console.log(this.state.temporary_home)
              this.setState({loading:false})
          });   
        }).catch((error) =>{
          console.error(error);
        });
    }
      
  render(){ 
    return(
      
        <ScrollView style={styles.container}>
            <Modal isVisible={this.state.modalSend} style={{margin:20}}>
                <View style={{backgroundColor:'white',minHeight:height*0.27,borderRadius:8}}>
                    <View style={appStyle.headerModal}>
                    <Text style={{fontFamily:Fonts.OpenSansBold,color:'white',fontSize:20}}>{this.state.loading? "Publicando aviso...": "Aviso publicado"}</Text>
                    </View>
                    {this.state.loading?
                    <View style={{alignSelf:'center'}}>
                        <Text style={{textAlign:'center',fontSize:16}}>Estamos enviando la información.</Text>
                        <Text style={{textAlign:'center',fontSize:14,marginBottom:30}}>Por favor, espera unos segundos.</Text>
                        <ActivityIndicator size="large" color= {Colors.primaryColor} />
                    </View>
                    :
                    <View style={{marginBottom:30,alignSelf:'center', paddingHorizontal:10}}>
                    <Text style={{textAlign:'center',fontSize:16}}>¡Enhora buena!</Text>
                    <Text style={{textAlign:'center',fontSize:14}}>Tu datos han sido enviados con exito.</Text>
                    <Text style={{textAlign:'center',fontSize:14}}>Recuerda que solo fundaciones/rescatistas pueden ver tus datos.</Text>
                    <TouchableOpacity style={[appStyle.buttonModal,{width:width*0.3,alignSelf:'center'}]}
                        onPress={() =>this.setState({modalSend:false } ,()=>{console.log("YA ENVIE LOS DATOS A AL API")}) }>
                        <Text style={{fontSize:16,textAlign:'center'}}>Aceptar</Text>
                    </TouchableOpacity>
                    </View>
                    }
                </View>
            </Modal>
            <Modal isVisible={this.state.modalAnimals}
                hasBackdrop={true} style={{margin:20}}> 
                <View style={{backgroundColor:'white',height:height*0.65,borderRadius:8}}>
                    <View style={appStyle.headerModal}>
                        <Text style={{fontFamily:Fonts.OpenSansBold,color:'white',fontSize:20}}>¿Qué tipos de mascotas tiene?</Text>
                    </View>
                    <ScrollView>
                        { this.state.animal_types.map( animal_type => (
                        <TouchableOpacity  key={animal_type.id}
                        onPress={() => this.changeAnimal(animal_type)}
                        >
                            <View  style={{alignContent:'space-between',backgroundColor:'white',height:35,marginVertical:2,paddingHorizontal:5,justifyContent:'center',marginHorizontal:15,borderBottomWidth:0.8,borderColor: Colors.lightGray}}>
                            <View style={{flexDirection:'row',justifyContent: 'space-between'}}>
                                <Text style={{fontFamily:Fonts.OpenSansSemiBold,fontSize:16,}}>{animal_type.name}</Text>
                                <Icon name="check-square" size={24} color={animal_type.select? Colors.primaryColor: Colors.lightGray} style={{marginRight:15}} solid/> 
                            </View>
                            </View>
                        </TouchableOpacity>
                        ))}
                    </ScrollView>
                    <View style={{justifyContent:'flex-end',marginBottom: 10,flex:1}}>
                        <View style={{justifyContent: 'center',flexDirection:'row', alignSelf: 'stretch'}}>
                            <TouchableOpacity style={[appStyle.buttonModal,appStyle.buttonsModal]}
                                onPress={() => this.setState({modalAnimals:false},()=>this.keepAnimals())}>
                                <Text style={appStyle.TextModalButton}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[appStyle.buttonModal,appStyle.buttonsModal]}
                                onPress={() =>this.setState({modalAnimals:false } ,()=>{this.setAnimals()}) }>
                                <Text style={appStyle.TextModalButton}>Aceptar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>     
                </View>
            </Modal>
            <Header {...this.props} stack='true'/>
            <View style={{flexDirection:'row', justifyContent:'center',marginTop:10}}>
                <Image
                    source={require('../../icons/rescue/house.png')}
                    style= {{width:30,height:30,marginRight:4}}
                />
                <Text style={[appStyle.textSemiBold, {color: Colors.violet, fontSize:20,alignSelf:'center'}]}>HOGAR TEMPORAL</Text>
            </View>
            <View style={{margin:10}}>
                <TouchableOpacity style={styles.buttonInfo} onPress={() => this.setState({info:this.state.info? false:true})}>
                    <View style={{flexDirection:'row'}}>
                        <Text style={appStyle.textSemiBold}>¿Qué significa ser un hogar temporal?</Text>
                        <Icon name="info-circle" size={16} color={Colors.primaryColor} style={{marginLeft:4}} regular/>
                    </View>
                </TouchableOpacity>
                {this.state.info?
                <Text style={[appStyle.textRegular,{textAlign:'justify',marginRight:10,marginVertical:5}]}>Ser hogar temporal implica tener bajo tu cuidado un perro o gato: alimentarlo, darle medicamentos si es necesario, llevarlo al veterinario y amarlo. Los costos generalmente son cubiertos, pero va a depender de la fundación/rescatista que te contacte.</Text>
                :null}
                <Text style={appStyle.textRegular}>Si deseas ser hogar temporal, completa el formulario:</Text>
            </View>
            <View style={[appStyle.containerPublication,{marginHorizontal:10, paddingHorizontal:10,paddingVertical:5,marginBottom:5}]}>
                <Text style={[appStyle.textTitleCalipso,{color: Colors.violet}]}>Datos personales</Text>
                <View style={{flexDirection:'row', marginVertical:10}}>
                    <Text style={appStyle.textSemiBold}>Teléfono</Text>
                    <TextInput
                    style = {[styles.input,{color:'gray', width:width*0.65,position: 'absolute', right: 0, alignSelf:'center'}]}
                    //placeholder = {'Nombre mascota (Opcional)'}
                    //placeholderTextColor = {'gray'}
                    keyboardType = 'numeric'
                    value={this.state.phone}
                    onChangeText={(value) => this.setState({phone: value})}                         
                    /> 
                </View>
                <View style={{flexDirection:'row', marginVertical:10}}>
                    <Text style={appStyle.textSemiBold}>Ocupación</Text>
                    <TextInput
                    style = {[styles.input,{color:'gray', width:width*0.65,position: 'absolute', right: 0, alignSelf:'center'}]}
                    //placeholder = {'Nombre mascota (Opcional)'}
                    //placeholderTextColor = {'gray'}
                    value={this.state.occupation}
                    onChangeText={(value) => this.setState({occupation: value})}                         
                    /> 
                </View>
                <View style={{flexDirection:'row', marginVertical:10}}>
                    <Text style={appStyle.textSemiBold}>Región</Text>
                    <View style={[styles.input,{height:34,width:width*0.65,position: 'absolute', right: 0, alignSelf:'center'}]}>
                        <Picker
                            selectedValue={this.state.region}
                            style={{color:'gray',height:30, width:width*0.65, alignSelf:'center'}}
                            onValueChange={(itemValue, itemIndex) =>
                                {this.setState({region:itemValue,region_id:itemIndex},() => {this.getComunasByRegion();})}
                            }>
                            <Picker.Item key={0} color= "#a0a0a0" label="" value="" />
                            {this.state.regions.map( region => (<Picker.Item key={region.id} color="gray" label={region.name} value={region.name} />))}              
                        </Picker>
                    </View>
                </View>
                <View style={{flexDirection:'row', marginVertical:10}}>
                    <Text style={appStyle.textSemiBold}>Comuna</Text>
                    <View style={[styles.input,{height:34,width:width*0.65,position: 'absolute', right: 0, alignSelf:'center'}]}>
                        <Picker
                            selectedValue={this.state.comuna}
                            style={{color:'gray',height:30, width:width*0.65, alignSelf:'center'}}
                            onValueChange={(itemValue, itemIndex) =>
                            this.setState({comuna: itemValue})
                            }>
                            <Picker.Item key={0} color= "#a0a0a0" label="" value="" />
                            {this.state.comunas.map( comuna => (<Picker.Item key={comuna.id} color="gray" label={comuna.name} value={comuna.name} />))}              
                        </Picker>
                    </View>
                </View>
                <Text style={[appStyle.textTitleCalipso,{color: Colors.violet}]}>Vivienda</Text>   
                <View style={{flexDirection:'row', marginVertical:10}}>
                    <Text style={appStyle.textSemiBold}>Vives en</Text>
                    <View style={[styles.input,{height:34,width:width*0.65,position: 'absolute', right: 0, alignSelf:'center'}]}>
                        <Picker
                            selectedValue={this.state.home_type}
                            style={{color:'gray',height:30, width:width*0.65, alignSelf:'center'}}
                            onValueChange={(itemValue, itemIndex) =>
                            this.setState({home_type: itemValue})
                            }>
                            <Picker.Item key={0} color= "#a0a0a0" label="" value="" />
                            {this.state.home_types.map( home_type => (<Picker.Item key={home_type} color="gray" label={home_type} value={home_type} />))}              
                        </Picker>
                    </View>
                </View>
                <View style={{flexDirection:'row', marginVertical:10}}>
                    <Text style={[appStyle.textSemiBold,{alignSelf:'center'}]}>¿Vives con niños?</Text>
                    <View style={{flexDirection:'row',position:'absolute', right:-10,alignSelf:'center'}}>
                        <CheckBox
                        title='Sí'
                        checked={this.state.children}
                        onPress={() => this.setState({children: !this.state.children})}
                        textStyle = {[appStyle.textRegular,{fontWeight:'400', marginLeft:0}]}
                        checkedColor = {Colors.violet}
                        fontFamily = {Fonts.OpenSansSemiBold}
                        containerStyle = {{borderWidth:0,backgroundColor:'white',height:34,justifyContent:'center',margin:0,padding:0}}
                        />
                        <CheckBox
                        title='No'
                        checked={!this.state.children}
                        onPress={() => this.setState({children: !this.state.children})}
                        textStyle = {[appStyle.textRegular,{fontWeight:'400', marginLeft:0}]}
                        checkedColor = {Colors.violet}
                        fontFamily = {Fonts.OpenSansSemiBold}
                        containerStyle = {{borderWidth:0,backgroundColor:'white',height:34,justifyContent:'center',margin:0,padding:0}}
                        />
                    </View>
                    
                </View>
                <View style={{flexDirection:'row', marginVertical:10}}>
                    <Text style={appStyle.textSemiBold}>¿Vives con adultos mayores?</Text>
                    <View style={{flexDirection:'row',position:'absolute', right:-10,alignSelf:'center'}}>
                        <CheckBox
                        title='Sí'
                        checked={this.state.older_adults}
                        onPress={() => this.setState({older_adults: !this.state.older_adults})}
                        textStyle = {[appStyle.textRegular,{fontWeight:'400', marginLeft:0}]}
                        checkedColor = {Colors.violet}
                        fontFamily = {Fonts.OpenSansSemiBold}
                        containerStyle = {{borderWidth:0,backgroundColor:'white',height:34,justifyContent:'center',margin:0,padding:0}}
                        />
                        <CheckBox
                        title='No'
                        checked={!this.state.older_adults}
                        onPress={() => this.setState({older_adults: !this.state.older_adults})}
                        textStyle = {[appStyle.textRegular,{fontWeight:'400', marginLeft:0}]}
                        checkedColor = {Colors.violet}
                        fontFamily = {Fonts.OpenSansSemiBold}
                        containerStyle = {{borderWidth:0,backgroundColor:'white',height:34,justifyContent:'center',margin:0,padding:0}}
                        />
                    </View>
                </View>
                <View style={{flexDirection:'row', marginVertical:10}}>
                    <Text style={appStyle.textSemiBold}>¿Tienes mascota(s)?</Text>
                    <View style={{flexDirection:'row',position:'absolute', right:-10,alignSelf:'center'}}>
                        <CheckBox
                        title='Sí'
                        checked={this.state.pets}
                        onPress={() => this.setState({pets: !this.state.pets})}
                        textStyle = {[appStyle.textRegular,{fontWeight:'400', marginLeft:0}]}
                        checkedColor = {Colors.violet}
                        fontFamily = {Fonts.OpenSansSemiBold}
                        containerStyle = {{borderWidth:0,backgroundColor:'white',height:34,justifyContent:'center',margin:0,padding:0}}
                        />
                        <CheckBox
                        title='No'
                        checked={!this.state.pets}
                        onPress={() => this.setState({pets: !this.state.pets})}
                        textStyle = {[appStyle.textRegular,{fontWeight:'400', marginLeft:0}]}
                        checkedColor = {Colors.violet}
                        fontFamily = {Fonts.OpenSansSemiBold}
                        containerStyle = {{borderWidth:0,backgroundColor:'white',height:34,justifyContent:'center',margin:0,padding:0}}
                        />
                    </View>
                </View>
                {this.state.pets?
                    <View style={{backgroundColor:Colors.violet,borderRadius:4, padding:5, flexDirection:'row'}}>
                        <Text style={[appStyle.buttonLargeText2,{alignSelf:'center',fontSize:14}]}>¿Cuantas?</Text>
                        <TextInput
                        style = {[styles.input,{color:'gray', width:35, alignSelf:'center',backgroundColor:'white', marginVertical:0,marginHorizontal:5}]}
                        keyboardType = 'numeric'
                        value= {`${this.state.number_pets}`}
                        onChangeText={(value) => this.setState({number_pets: value})}                         
                        />
                        <Text style={[appStyle.buttonLargeText2,{alignSelf:'center',fontSize:14}]}>¿Qué tipo?</Text>
                        <TouchableOpacity 
                            style={{paddingHorizontal:8,flexDirection:'row',width:100,backgroundColor:'white',borderRadius:4, position:'absolute', right:10,alignSelf:'center',height:34,alignItems:'center'}}
                            onPress={() => this.setState({modalAnimals:true})}>  
                            <Text style={{paddingTop:3,fontSize:15,color:'gray'}}>{this.state.pets_type.length != 0? this.state.pets_type : 'Tipos'}</Text>
                            <Icon name="sort-down" size={16} color='gray' style={{right:10,position:'absolute',alignSelf:'center'}} regular/>
                        </TouchableOpacity>
                    </View>
                :null
                }
                <Text style={[appStyle.textTitleCalipso,{color: Colors.violet,marginTop:10}]}>Hogar temporal</Text>   
                <View style={{flexDirection:'row', marginVertical:10}}>
                    <Text style={appStyle.textSemiBold}>Puedes recibir a</Text>
                    <View style={{flexDirection:'row',position:'absolute', right:-10,alignSelf:'center'}}>
                        <CheckBox
                        title='Perro'
                        checked={this.state.dog}
                        onPress={() => this.setState({dog: !this.state.dog})}
                        textStyle = {[appStyle.textRegular,{fontWeight:'400', marginLeft:0}]}
                        checkedColor = {Colors.violet}
                        fontFamily = {Fonts.OpenSansSemiBold}
                        containerStyle = {{borderWidth:0,backgroundColor:'white',height:34,justifyContent:'center',margin:0,padding:0}}
                        />
                        <CheckBox
                        title='Gato'
                        checked={this.state.cat}
                        onPress={() => this.setState({cat: !this.state.cat})}
                        textStyle = {[appStyle.textRegular,{fontWeight:'400', marginLeft:0}]}
                        checkedColor = {Colors.violet}
                        fontFamily = {Fonts.OpenSansSemiBold}
                        containerStyle = {{borderWidth:0,backgroundColor:'white',height:34,justifyContent:'center',margin:0,padding:0}}
                        />
                    </View>
                </View>
                <View style={{flexDirection:'row', marginVertical:10}}>
                    <Text style={appStyle.textSemiBold}>Tiempo aproximado</Text>
                    <View style={{flexDirection:'row',position: 'absolute', right: 0,alignSelf:'center'}}>
                    <TextInput
                        style = {[styles.input,{color:'gray', width:35, alignSelf:'center',backgroundColor:'white', marginVertical:0,marginHorizontal:5}]}
                        keyboardType = 'numeric'
                        value={`${this.state.number_time}`}
                        onChangeText={(value) => this.setState({number_time: value})}                         
                    />
                    <View style={[styles.input,{height:34,width:width*0.3, alignSelf:'center'}]}>
                        <Picker
                            selectedValue={this.state.time}
                            style={{color:'gray',height:30, width:width*0.3, alignSelf:'center'}}
                            onValueChange={(itemValue, itemIndex) =>
                            this.setState({time: itemValue})
                            }>
                            <Picker.Item key={0} color= "#a0a0a0" label="" value="" />
                            {this.state.times.map( time => (<Picker.Item key={time} color="gray" label={time} value={time} />))}              
                        </Picker>
                    </View>
                    </View>
                </View>
            </View>
            <View style={{marginHorizontal:10,marginBottom:10}}>
                <Text style={[appStyle.textRegular,{color:Colors.lightGray,textAlign:'center'}]}>Tus datos solo serán visibles para fundaciones/rescatistas que busquen hogar temporal</Text>
                <TouchableOpacity 
                style={[appStyle.buttonLarge,{backgroundColor:Colors.violet}]}
                onPress={() => this.validate()}
                >
                <Text style={appStyle.buttonLargeText}> Enviar </Text>
                </TouchableOpacity>   
            </View>         
      </ScrollView>
      
    );
    
  }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,

    },
    buttonInfo:{
      width: 280,
      borderBottomWidth: 1.3,
      borderColor: 'gray',
      marginVertical: 5
    },
    input:{
        borderWidth: 1.3,
        borderColor: Colors.violet,
        borderRadius: 8,
        marginVertical:10,
        marginHorizontal:0,
        paddingVertical:1,
        paddingHorizontal:10,
      }
  });