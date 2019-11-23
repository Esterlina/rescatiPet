import React, {Component} from 'react';
import {
    Image,
    View,
    StyleSheet,
    Dimensions,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    ScrollView,
    TouchableHighlight
} from 'react-native'
import {Fonts} from '../utils/Fonts';
import appStyle from '../styles/app.style'
import { SearchBar } from 'react-native-elements';
import {Colors} from '../styles/colors'
import {API} from '../keys';
import UserAvatar from 'react-native-user-avatar';
import Icon from 'react-native-vector-icons/FontAwesome';

const {width,height} = Dimensions.get('window')
export default class SelectProfile extends Component{

    constructor(props) {
        super(props);
        this.state = {
            //phone: this.props.user.telefono,
            selectedItems:[],
            selectedItem:'',
            list: [],
            search: '',
            show: true,
            loading:true
          }
          this.arrayholder = []
      }
      getUsers(){
        return fetch(API+'users')
        .then( (response) => response.json() )
          .then( (responseJson ) => {
            this.setState({
              list: responseJson,
              loading:false,
            }, function() {
                console.log("AHORA VAMOS A PONER EL ARRAY Y EL LIST ES .")
                console.log(this.state.list)
            this.arrayholder = responseJson;
          })
        })
        .catch((error) => {
          console.log(error)
          this.setState({loading: false})
        });
      }
    componentDidMount(){
        if(this.props.type == 'user'){
            this.getUsers()
        }
    }
    SearchFilterFunction(text) {
    const newData = this.arrayholder.filter(function(item) {
        const itemData = item.name ? item.name.toUpperCase() : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
    });
    this.setState({
        list: newData,
        search: text,
    });
    }
    selectItem(id){
        console.log("VAMOS A SELECCIONAR EL ITEM")
        var item = this.state.list.find(obj => {
            return obj.id === id
          })
        console.log(item)
        if(this.props.multiple){
            const items = this.state.selectedItems.slice()
            items.push(item)
            this.setState({selectedItems:items})
        }else{
            
            this.setState({selectedItem: item},() => this.props.update(item))
        }
    }
    cleanItem(){
        console.log("VOY A LIMPIAR EL ITEMM")
        if(!this.props.multiple){
            this.setState({selectedItem:'',search:''},this.props.update(""))
        }
    }
    displayResult(){
        if(this.props.multiple){
            console.log("HYA QUE HACER LOS RESULTADOS DE LA LISTA")
        }
        else{
            item = this.state.selectedItem;
            return(
                <View style={{flexDirection:'row',padding:4}}>
                    {item.profile_picture?
                        <UserAvatar size="30" name={item.name} src={item.profile_picture}/>
                        :
                        <UserAvatar size="30" name={item.name} colors={['#0ebda7','#ccc000', '#fafafa', '#ccaabb']}/>
                    }
                    <Text style={[appStyle.textSemiBold,{alignSelf:'center', marginHorizontal:5,flex:1,flexWrap:'wrap'}]}>{item.name}</Text>
                    <TouchableOpacity style={{alignSelf:'center'}} onPress={() => this.cleanItem()}>
                        <Icon name="times" size={16} color={Colors.gray} regular/>
                    </TouchableOpacity>    
                </View>
            )
        }
    }
    render(){
        const placeholder = this.props.placeholder
        const multiple = this.props.multiple
        return(
                <View style={{marginVertical:5}}> 
                    {this.state.loading?
                    <ActivityIndicator size='small' color={Colors.violet} />
                    :
                    <View  style={{zIndex:2}}>
                    {(!multiple && this.state.selectedItem == '') || (multiple && this.state.selectedItems.length == 0)?
                        <SearchBar
                            placeholder={placeholder}
                            onChangeText={text => this.SearchFilterFunction(text)}
                            onClear={text => this.SearchFilterFunction('')}
                            value={this.state.search}
                            containerStyle={styles.searchContainer}
                            inputContainerStyle={styles.searchInput}
                            inputStyle={appStyle.textRegular}
                            lightTheme
                    />:
                        this.displayResult()
                    }
                 
                    {this.state.list.length != 0 && this.state.search.length != 0 && ((multiple && this.state.selectedItems.length == 0) || (!multiple && this.state.selectedItem == ''))?
                    <ScrollView style={{maxHeight:height*0.2}}>
                    {this.state.list.map((item) => {
                        return(
                            <TouchableHighlight underlayColor='white'  key={item.id} onPress={() => this.selectItem(item.id)} style={{backgroundColor:'white'}}> 
                                <View style={{padding:5,borderBottomWidth:1,borderLeftWidth:1, borderRightWidth:1,borderColor: Colors.lightGray,flexDirection:'row'}}>
                                {item.profile_picture?
                                <UserAvatar size="30" name={item.name} src={item.profile_picture}/>
                                :
                                <UserAvatar size="30" name={item.name} colors={['#0ebda7','#ccc000', '#fafafa', '#ccaabb']}/>
                                }
                                <Text style={[appStyle.textSemiBold,{alignSelf:'center', marginHorizontal:5,flex:1,flexWrap:'wrap'}]}>{item.name}</Text>
                                </View>
                            </TouchableHighlight>
                        )
                    })}
                    </ScrollView>
                    :null} 

                    </View>
                    }
                                                                
                </View>
        )
    }
}

const styles = StyleSheet.create({
    tag:{
        alignSelf: 'flex-end',
        position: "absolute",
        top: -10,
        right: 0,
        width: width*0.3,
        height:30
    },
    subTag:{
        flexDirection:'row',
        paddingHorizontal:5,
        paddingVertical:2,
    },
    searchContainer:{
        backgroundColor:'white',borderBottomWidth:0,borderTopWidth:0,padding:0
    },
    searchInput:{
        height:30,
        borderWidth:1,
        borderBottomWidth:1,
        borderColor: Colors.lightGray,
        backgroundColor:'white'
    },
})

