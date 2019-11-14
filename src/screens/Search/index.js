import { createStackNavigator } from 'react-navigation'

import Search from './SearchScreen';
import TemporaryHomes from './TemporaryHomes'

export default createStackNavigator({
    Search,
    TemporaryHomes
},
{
    headerMode: 'none',
    navigationOptions: {
        headerVisible: false,
    },
    initialRouteName: 'Search'
});