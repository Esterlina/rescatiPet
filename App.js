import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import AppContainer from './src/components/Navigation'
import { store, persistor } from './src/persist/store';

class App extends React.Component{
  render(){
    return (
      <Provider store={store}>
        <PersistGate persistor={persistor} loading={null}>
          <AppContainer/>
        </PersistGate>
      </Provider>
    );
  }
}
export default App;