import { createStackNavigator } from 'react-navigation'

import Notices from './NoticesScreen';
import Form from './NoticeFormScreen';

export default createStackNavigator({
    Notices,
    Form
},
{
    headerMode: 'none',
    navigationOptions: {
        headerVisible: false,
    },
    initialRouteName: 'Notices'
});