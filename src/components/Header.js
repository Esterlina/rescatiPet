import React, {Component} from 'react';
import {
    Image,
    View,
    StyleSheet,
    Dimensions,
    TouchableWithoutFeedback,
} from 'react-native'

import Icon from 'react-native-vector-icons/FontAwesome';
const {width,height} = Dimensions.get('window')
export default class Header extends Component{

    constructor(props) {
        super(props);
        this.state = {
          stack:this.props.navigation.state.stack,
        }
      }
      renderIcon(){
        if(this.props.stack == 'true')
           return <Text>data</Text>;
        return null;
     }
    render(){
        const { goBack } = this.props.navigation;
        return(
                <View style={styles.container}> 
                    { this.props.stack === 'true' ?
                        <TouchableWithoutFeedback
                        onPress={() => goBack()}>
                            <Icon
                                style ={styles.icon}
                                name="angle-left"
                                color= "white"
                                size={20}
                            />
                        </TouchableWithoutFeedback>
                        :   
                        <TouchableWithoutFeedback
                            onPress={() => {
                            const { navigate } = this.props.navigation.openDrawer();
                            }}>
                            <Icon
                                style ={styles.icon}
                                name="bars"
                                color= "white"
                                size={20}
                            />
                        </TouchableWithoutFeedback>
                    }    
                    <View style={styles.title}>
                        <Image
                            style={styles.iconHeader} 
                            source={require('../icons/RescatiPet.png')}
                        />  
                    </View>
                                                    
                </View>
        )
    }
}

const styles = StyleSheet.create({
    iconHeader: {
       width: 120,
       height:20,
    },
    title:{
        width:width*0.75,
        alignItems: 'center',
        justifyContent: 'center',
    },
    container:{
        backgroundColor:"#66d2c5",
        height:40,
        alignItems: 'center',
        flexDirection: 'row',
        marginBottom:10,
    },
    icon: {
        paddingHorizontal:15,

    },
})

