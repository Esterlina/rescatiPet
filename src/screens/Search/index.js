import { createStackNavigator } from 'react-navigation'

import Search from './SearchScreen';
import TemporaryHomes from './TemporaryHomes'
import NoticeSearch from './NoticeSearch'
export default createStackNavigator({
    Search,
    TemporaryHomes,
    NoticeSearch
},
{
    headerMode: 'none',
    navigationOptions: {
        headerVisible: false,
    },
    initialRouteName: 'Search'
});