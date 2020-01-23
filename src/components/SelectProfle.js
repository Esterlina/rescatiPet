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
import {connect} from 'react-redux'

const {width,height} = Dimensions.get('window')
class SelectProfile extends Component{

    constructor(props) {
        super(props);
        this.state = {
            selectedItems:[],
            selectedItem:'',
            list: [],
            search: '',
            show: false,
            loading:true
          }
          this.arrayholder = []
      }
      getUsers(){
        return fetch(API+'users')
        .then( (response) => response.json() )
          .then( (responseJson ) => {
            this.setState({
              list: responseJson['users'],
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
      getRescueds(){
        return fetch(API+'rescueds/user/' + this.props.user.id)
        .then( (response) => response.json() )
        .then( (responseJson ) => {
          this.setState({
            list: responseJson['rescueds'],
            loading: false
          }, function() {
            console.log("AHORA VAMOS A PONER EL ARRAY RESCATADOS Y EL LIST ES .")
            console.log(this.state.list)
        this.arrayholder = responseJson['rescueds'];
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
        else if(this.props.type == 'rescued'){
            this.getRescueds()
        }
    }
    SearchFilterFunction(text) {
    console.log(text)
    console.log(this.arrayholder)
    const newData = this.arrayholder.filter(function(item) {
        const itemData = item.nombre ? item.nombre.toUpperCase() : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
    });
    this.setState({
        list: newData,
        search: text,
    });
    console.log(newData)
    }
    selectItem(id){
        var item = this.state.list.find(obj => {
            return obj.id === id
          })
        if(this.props.multiple){
            if(this.checkItem(id)){
                this.deleteItem(id)
            }else{
                const items = this.state.selectedItems.slice()
                items.push(item)
                this.setState({selectedItems:items},() => this.props.update(items))
            }
        }else{
            this.setState({selectedItem: item,show:false},() => this.props.update(item))
        }
    }
    checkItem(id) {
        var i;
        for (i = 0; i < this.state.selectedItems.length; i++) {
            if (this.state.selectedItems[i].id === id) {
                return true;
            }
        }
        return false;
    }
    deleteItem(id){
        items = this.state.selectedItems.slice()
        items = items.filter(function( item ) {
            return item.id !== id;
        });
        this.setState({selectedItems:items},() => this.props.update(items))
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
                        <UserAvatar size="30" name={item.nombre} src={item.profile_picture}/>
                        :
                        <UserAvatar size="30" name={item.nombre} colors={['#0ebda7','#ccc000', '#fafafa', '#ccaabb']}/>
                    }
                    <Text style={[appStyle.textSemiBold,{alignSelf:'center', marginHorizontal:5,flex:1,flexWrap:'wrap'}]}>{item.nombre}</Text>
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
        const color = this.props.color
        return(
                <View style={{marginVertical:5}}> 
                    {this.state.loading?
                    <ActivityIndicator size='small' color={Colors.violet} />
                    :
                    <View  style={{zIndex:2}}>
                    {(!multiple && this.state.selectedItem == '') || multiple?
                        <SearchBar
                            ref={search => this.search = search}
                            placeholder={placeholder}
                            onChangeText={text => this.SearchFilterFunction(text)}
                            onClear={text => this.SearchFilterFunction('')}
                            value={this.state.search}
                            containerStyle={styles.searchContainer}
                            inputContainerStyle={styles.searchInput}
                            inputStyle={appStyle.textRegular}
                            onFocus={() => this.setState({show:true})}
                            //onBlur={() => this.setState({show:false}) }
                            lightTheme
                    />:
                        this.displayResult()
                    }             
                    {this.state.list.length != 0 && this.state.show && ((multiple) || (!multiple && this.state.selectedItem == ''))?
                    <ScrollView style={{height:this.props.type == 'user'? 70:null}}>
                    {this.state.list.map((item) => {
                        console.log("VOY A IMPRIMIR LOS ITEMS DE LA LISTA RESULTADOS")
                        console.log(item)
                        return(
                            <TouchableHighlight underlayColor='white'  key={item.id} onPress={() => this.selectItem(item.id)} style={{backgroundColor:'white'}}> 
                                <View style={{padding:5,borderBottomWidth:1,borderLeftWidth:1, borderRightWidth:1,borderColor: Colors.lightGray,flexDirection:'row'}}>
                                {item.profile_picture?
                                    <UserAvatar size="30" name={item.nombre} src={item.profile_picture}/>
                                    :
                                    <UserAvatar size="30" name={item.nombre} colors={['#0ebda7','#ccc000', '#fafafa', '#ccaabb']}/>
                                }
                                <Text style={[appStyle.textSemiBold,{alignSelf:'center', marginHorizontal:5,flex:1,flexWrap:'wrap'}]}>{item.nombre}</Text>
                                {this.checkItem(item.id)? 
                                    <Icon key={item.id} name="check" size={20} color={Colors.primaryColor}/>
                                :null}
                                </View>
                            </TouchableHighlight>
                        )
                    })}
                    {multiple? 
                        <TouchableOpacity style={{height:30,backgroundColor: color,}} onPress={() => this.setState({show:false})}>
                            <Text style={[appStyle.buttonLargeText2,{alignSelf:'center'}]}>Listo</Text>
                        </TouchableOpacity>
                    :
                    null
                    }
                    
                    </ScrollView>
                    :null}
                    {!multiple && (this.state.show) ?
                        <TouchableOpacity style={{height:25,backgroundColor: color,}} onPress={() => this.setState({show:false})}>
                            <Text style={[appStyle.buttonLargeText2,{alignSelf:'center'}]}>Cerrar</Text>
                        </TouchableOpacity>
                :null}
                    {multiple && this.state.selectedItems.length != 0? 
                        <View style={{flexWrap:'wrap',flexDirection:'row'}}>
                            {this.state.selectedItems.map((item) => {
                                return(
                                    <View key={item.id} style={[appStyle.tagRescued,{flexDirection:'row'}]}>
                                        <Text style={[appStyle.textRegular,{paddingRight: 8}]}>{item.nombre}</Text>
                                        <TouchableOpacity style={{width:20}} onPress={() => this.deleteItem(item.id)}>
                                            <Icon name="times-circle" size={20} color={Colors.primaryColor} style={{right:0,position:'absolute'}}/>
                                        </TouchableOpacity>
                                    </View>    
                                )
                            })}
                        </View>    
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

const mapStateToProps = (state) => {
    console.log('State:');
    console.log(state);  // Redux Store --> Component
    console.log(state.userReducer)
    return {
      user: state.userReducer,
    };
}
export default connect(mapStateToProps)(SelectProfile);