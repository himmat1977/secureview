import React from 'react';
import { StatusBar } from 'react-native';
import { RootNavigator } from './src/navigation';
import { AuthProvider } from './src/context/AuthContext';
import 'react-native-gesture-handler';

function App(): React.JSX.Element {
  return (
    <AuthProvider>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <RootNavigator />
    </AuthProvider>
  );
}

export default App;
