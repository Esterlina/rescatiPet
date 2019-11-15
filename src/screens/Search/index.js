import { createStackNavigator } from 'react-navigation'

import Search from './SearchScreen';
import TemporaryHomes from './TemporaryHomes'
import RequestHomes from './RequestHomes'
export default createStackNavigator({
    Search,
    TemporaryHomes,
    RequestHomes
},
{
    headerMode: 'none',
    navigationOptions: {
        headerVisible: false,
    },
    initialRouteName: 'Search'
});