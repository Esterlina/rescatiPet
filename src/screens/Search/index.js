import { createStackNavigator } from 'react-navigation'

import Search from './SearchScreen';
import TemporaryHomes from './TemporaryHomes'
import NoticeSearch from './NoticeSearch'
import UserSearch from './UserSearch'
import RescuedSearch from './RescuedSearch'
export default createStackNavigator({
    Search,
    TemporaryHomes,
    NoticeSearch,
    RescuedSearch,
    UserSearch
},
{
    headerMode: 'none',
    navigationOptions: {
        headerVisible: false,
    },
    initialRouteName: 'Search'
});