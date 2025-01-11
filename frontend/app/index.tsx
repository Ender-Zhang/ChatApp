import React from 'react';
import AppNavigator from './navigation/AppNavigator';  // 导入你定义的导航器
import { Text, View } from 'react-native';
import { UserProvider } from './contexts/UserContext';

const App: React.FC = () => {
  return  <UserProvider>
            <AppNavigator />
          </UserProvider>;  // 直接返回 AppNavigator，避免重复的 NavigationContainer
  // return (
  //   <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
  //     <Text>Hello World</Text>
  //   </View>
  // ); 
};

export default App;
