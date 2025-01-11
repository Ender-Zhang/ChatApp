// src/navigation/TabNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import ChatScreen from '../screens/ChatScreen';
import MomentsScreen from '../screens/MomentsScreen';
import MyDataScreen from '../screens/MyDataScreen'


export type TabParamList = {
  Chat: undefined;
  Moments: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

const TabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      initialRouteName="Chat"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName: string;

          if (route.name === 'Chat') {
            iconName = 'chat';
          } else if (route.name === 'Moments') {
            iconName = 'account-group';
          } else {
            iconName = 'circle';
          }

          return <MaterialCommunityIcons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6200ee',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Chat" component={ChatScreen} />
      <Tab.Screen name="Moments" component={MomentsScreen} />


    </Tab.Navigator>
  );
};

export default TabNavigator;
