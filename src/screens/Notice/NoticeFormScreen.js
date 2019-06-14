import React from 'react';
import { StyleSheet, Text,View, Modal, Dimensions,TouchableOpacity, ScrollView,TextInput,Picker} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Fonts} from '../../utils/Fonts';
import Header from '../../components/Header';
import Map from '../../components/Map';
import Camera from '../../components/Camera';
import DatePicker from 'react-native-datepicker';
import { CheckBox } from 'react-native-elements'
const {height, width} = Dimensions.get('window');
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import {API_KEY} from '../../keys';
export default class NoticeFormScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      images: [],
      map: false,
      collar: false,
      clothes: false,
      details:'',
      time_last_seen:'',
      marker: { latitude: -33.499301, longitude: -70.586420},
      address:'',
      name:'',
      specie: 0,
      sex:'',
      breed: 0,
      age:'',
      size: '',
      color:'',
      specieList:[{id:1, name:"Perro"},{id:2, name:"Gato"},{id:3, name:"Conejo"},{id:4, name:"Hamster"}],
      breedList:[{id:1, name:"Perro Quiltro"},{id:2, name: "Gato Siamés"},{id:3, name: "Gato Persa"}],
      ageList:[{id:1, name:"2 semanas"},{id:2, name: "6 meses"},{id:3, name: "2 años"}],
      colorList:[{id:1, name:"Blanco"},{id:2, name: "Rubio"},{id:3, name: "Blanco/negro"}]
    };
}
updateImages(images){
  this.setState({images:images})
}
updateLocation(marker,address){
  this.setState({marker:marker,address:address,map:false}, () =>{this.locationRef.setAddressText(this.state.address);})
}
  render(){ 
    return(
      <ScrollView style={styles.container}>
        <Modal visible={this.state.map}
            onRequestClose={()=>console.log("cerrando")}> 
            <Map marker={this.state.marker} update = {this.updateLocation.bind(this)}/> 
            <View style={styles.mapClose}>
              <TouchableOpacity style={[styles.buttonLitle,{backgroundColor:'white'}]}
                onPress={() => this.setState({map:false})}>
                <View style={{flexDirection:'row'}}>
                  <Icon name="arrow-left" size={14} color='gray' style={{marginRight:5,marginTop:3}} regular/>
                  <Text style={[styles.text,styles.textMap]}>Volver</Text>
                </View>
              </TouchableOpacity>
            </View>
        </Modal>
        <Header {...this.props} stack='true'/> 
        <Camera update = {this.updateImages.bind(this)} images = {this.state.images} />
        <Text style={styles.textSection}>¿Cuándo y Dondé Fue la ultima vez que lo viste?</Text>
        <View style={styles.containerForm2}>
          <DatePicker
            style={styles.dateTime}
            date={this.state.date}
            mode="datetime"
            placeholder="Ingresa una fecha aproximada"
            format="YYYY-MM-DD HH:mm"
            confirmBtnText="Confirmar"
            cancelBtnText="Cancelar"
            showIcon={false}
            customStyles={{
                dateInput: {
                  height:10,
                  borderWidth:0,
                  paddingBottom:10, 
                  paddingHorizontal:8
                },
                dateText: {
                    color:'gray',
                    fontSize:14,
                    textAlign: 'left',
                    alignSelf: 'stretch'
                },
                placeholderText: {
                    color: '#a0a0a0',
                    fontFamily: Fonts.OpenSans,
                    fontSize:14,
                    textAlign: 'left',
                    alignSelf: 'stretch'
                }
            }}
            onDateChange={(date) => {this.setState({date: date})}}
          />
          <GooglePlacesAutocomplete
            ref={(instance) => { this.locationRef = instance }}
            query={{ key: API_KEY,language: 'es',components: 'country:cl'}}
            placeholder='Ingresa una dirección'
            minLength={2} 
            autoFocus={false}
            returnKeyType={'default'}
            fetchDetails={true}
            listViewDisplayed={false}
            onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
            this.setState({marker:
            {latitude:details.geometry.location.lat,longitude: details.geometry.location.lng},
            address: details.formatted_address});
            //alert(this.state.address);
            }}
            styles={{
              textInputContainer: {
                backgroundColor: '#F5FCFF',
                borderTopWidth: 0,
                borderBottomWidth:0,
                width:width*0.94,
              },
              textInput: {
                backgroundColor:'#F5FCFF',
                borderWidth: 1.3,
                borderColor: '#d6d7da',
                borderRadius: 8,
                margin:10,
                marginBottom:0,
                paddingVertical:5,
                paddingHorizontal:10,
                height: 34,
                color: 'gray',
                fontSize: 14,
                fontFamily: Fonts.OpenSans
              },
              predefinedPlacesDescription: {
                color: '#1faadb'
              },
            }}

          />
          <TouchableOpacity style={styles.buttonMap}
            onPress={() => this.setState({map:true})}>
            <View style={{flexDirection:'row'}}>
              <Icon name="map-marker-alt" size={14} color='#66D2C5' style={{marginRight:5}} regular/>
              <Text style={[styles.text,{color: '#66D2C5'}]}>Ver mapa</Text>
            </View>
          </TouchableOpacity>
        </View>
          <View style={styles.containerForm}>     
            <TextInput
              style = {[styles.input,{color:'gray'}]}
              placeholder = {'Nombre mascota (Opcional)'}
              placeholderTextColor = {'gray'}
              onChangeText={(value) => this.setState({name: value})}                         
            /> 
            <View style={{flexDirection:'row', justifyContent: 'space-between'}}>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={this.state.specie}
                  style={styles.picker}
                  onValueChange={(itemValue, itemIndex) =>
                    this.setState({specie: itemValue})
                  }>
                  <Picker.Item color= "#a0a0a0" label="Especie" value="0" />
                  { this.state.specieList.map( specie => (<Picker.Item key={specie.id} color="gray" label={specie.name} value={specie.id} />) ) }
                </Picker>
              </View>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={this.state.sex}
                  style={styles.picker}
                  onValueChange={(itemValue, itemIndex) =>
                    this.setState({sex: itemValue})
                  }>
                  <Picker.Item color= "#a0a0a0" label="Sexo" value="" />
                  <Picker.Item color="gray" label="Hembra" value="Hembra" />
                  <Picker.Item color="gray" label="Macho" value="Macho" />   
                </Picker>
              </View>
            </View>
            <View style={styles.moreInformation}>
              <Text style={styles.textWhite}>AGREGA MÁS CARACTERISTICAS</Text>
              <View style={styles.pickersInfo}>
                <View style={[styles.pickerContainer,{backgroundColor:'white'}]}>
                  <Picker
                    selectedValue={this.state.breed}
                    style={styles.picker}
                    onValueChange={(itemValue, itemIndex) =>
                      this.setState({breed: itemValue})
                    }>
                    <Picker.Item color= "#a0a0a0" label="Raza" value="0" />
                    { this.state.breedList.map( breed => (<Picker.Item key={breed.id} color="gray" label={breed.name} value={breed.id} />) ) }
                  </Picker>
                </View>
                <View style={[styles.pickerContainer,{backgroundColor:'white'}]}>
                  <Picker
                    selectedValue={this.state.age}
                    style={styles.picker}
                    onValueChange={(itemValue, itemIndex) =>
                      this.setState({age: itemValue})
                    }>
                     <Picker.Item color= "#a0a0a0" label="Edad" value="0" />
                    { this.state.ageList.map( age => (<Picker.Item key={age.id} color="gray" label={age.name} value={age.id} />) ) }              
                  </Picker>
                </View>
              </View>
              <View style={styles.pickersInfo}>
                <View style={[styles.pickerContainer,{backgroundColor:'white'}]}>
                  <Picker
                    selectedValue={this.state.size}
                    style={styles.picker}
                    onValueChange={(itemValue, itemIndex) =>
                      this.setState({size: itemValue})
                    }>
                    <Picker.Item color= "#a0a0a0" label="Tamaño" value="" />
                    <Picker.Item color="gray" label="Pequeño" value="Pequeño" />
                    <Picker.Item color="gray" label="Mediano" value="Mediano" />
                    <Picker.Item color="gray" label="Grande" value="Grande" />
                  </Picker>
                </View>
                <View style={[styles.pickerContainer,{backgroundColor:'white'}]}>
                  <Picker
                    selectedValue={this.state.color}
                    style={styles.picker}
                    onValueChange={(itemValue, itemIndex) =>
                      this.setState({color: itemValue})
                    }>
                     <Picker.Item color= "#a0a0a0" label="Color" value="0" />
                    { this.state.colorList.map( color => (<Picker.Item key={color.id} color="gray" label={color.name} value={color.id} />) ) }              
                  </Picker>
                </View>
              </View>
              <Text style={[styles.textWhite,{fontFamily: Fonts.OpenSansSemiBold}]}>Marque los accesorios presentes:</Text>
              <View style={styles.pickersInfo}>
                <CheckBox
                  title='Collar y/o correa'
                  checked={this.state.collar}
                  onPress={() => this.setState({collar: !this.state.collar})}
                  textStyle = {[styles.text,{fontWeight:'400', marginLeft:0}]}
                  checkedColor = '#66D2C5'
                  fontFamily = {Fonts.OpenSansSemiBold}
                  containerStyle = {styles.checkbox}
                />
                <CheckBox
                  title='Chaleco/ropa'
                  checked={this.state.clothes}
                  onPress={() => this.setState({clothes: !this.state.clothes})}
                  textStyle = {[styles.text,{fontWeight:'400', marginLeft:0}]}
                  checkedColor = '#66D2C5'
                  fontFamily = {Fonts.OpenSansSemiBold}
                  containerStyle = {styles.checkbox}
                />
              </View>      
            </View>
            <TextInput
              style = {styles.inputArea}
              placeholder = {'Agregue una descripción ...'}
              placeholderTextColor = {'gray'}
              multiline={true}
              numberOfLines={4}
              onChangeText={(value) => this.setState({details: value})}
            ></TextInput>  
            <TouchableOpacity 
              style={styles.buttonPost}
              onPress={() =>console.log("PUBLICAR POST")}
            >
              <Text style={styles.textPost}> Publicar </Text>
            </TouchableOpacity>     
          </View>
          
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F5FCFF',
    },
    text:{
      fontSize: 14,
      color: 'gray',
      fontFamily: Fonts.OpenSans
    },
    buttonMap:{
      width:80,
      alignSelf: 'flex-end',
      borderBottomWidth: 1.3,
      borderColor: '#66D2C5',
      margin:10,
      marginTop:5,
      marginBottom:10,
      paddingVertical:0,
      paddingHorizontal:2,
    },
    buttonLitle:{
      borderWidth: 1.3,
      borderColor: '#d6d7da',
      borderRadius: 8,
      margin:10,
      marginBottom:0,
      paddingVertical:5,
      paddingHorizontal:10,
    },
    mapClose:{
      position: 'absolute',
      margin:5,
      alignSelf: 'flex-start'
    },
    textMap:{
      fontSize:16,
    },
    containerForm:{
      paddingHorizontal:10,
      paddingBottom:10,
    },
    icon: {
      position:'absolute',
      top:10,
      left:8,
  },
  dateTime:{
    width: width*0.90,
    //backgroundColor:'red',
    height:34,
    marginTop:8,
    borderWidth: 1.3,
    borderColor: '#d6d7da',
    borderRadius: 8,
  },
  input:{
    borderWidth: 1.3,
    borderColor: '#66D2C5',
    borderRadius: 8,
    marginVertical:10,
    marginHorizontal:0,
    paddingVertical:1,
    paddingHorizontal:10,
  },
  inputArea:{
    color:'gray',
    borderColor: '#d6d7da',
    textAlignVertical: "top",
    paddingTop:5,
    borderWidth: 1.3,
    //borderColor: '#66D2C5',
    borderRadius: 8,
    marginVertical:10,
    marginHorizontal:0,
    paddingVertical:1,
    paddingHorizontal:10,
  },
  pickerContainer:{
    borderWidth: 1.3,
    borderColor: '#66D2C5',
    borderRadius: 8,
    width: width*0.45,
  },
  picker:{
    height: 28,
    width: width*0.44,
    color: 'gray',
    },
  textWhite:{
    color:'white',
    fontFamily:Fonts.OpenSansBold,
    marginVertical:5,
    marginLeft:2
  },
  moreInformation:{
    backgroundColor:"#66D2C5",
    marginTop:10,
    marginVertical:5,
    padding:5,
    borderRadius:4
  },
  pickersInfo:{
    flexDirection:'row',
    justifyContent: 'space-between',
    marginBottom:4
  },
  textSection:{
    paddingHorizontal:10,
    marginTop: 10,
    fontFamily: Fonts.OpenSansSemiBold
  },
  containerForm2:{
    borderWidth: 1.3,
    borderColor: '#66D2C5',
    borderRadius: 4,
    justifyContent:'center',
    alignItems:'center',
    marginHorizontal:10,
    marginTop:5,
  },
  checkbox:{
    height: 30,
    width: width*0.44,
    paddingVertical:3,
    marginLeft:2,
    borderRadius:8,
    borderWidth:0
  },
  textPost:{
    color:'white',
    fontSize:20,
    fontFamily: Fonts.OpenSansBold
  },
  buttonPost:{
    marginTop: 5,
    borderRadius: 8,
    backgroundColor :'#66D2C5',
    alignItems: "center",
    justifyContent:'center',
    height: 45,
   }
  });