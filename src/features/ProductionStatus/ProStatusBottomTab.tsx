import {
    BottomTabNavigationOptions,
    createBottomTabNavigator,
}
from '@react-navigation/bottom-tabs'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react'
import { Platform } from 'react-native';
const Tab = createBottomTabNavigator();
const customTabBarStyle:BottomTabNavigationOptions={
    tabBarActiveTintColor: "#EE0033",
    tabBarInactiveTintColor: "gray",
    tabBarStyle: { backgroundColor: "white" },
    headerShown: false,
}

const ProStatusBottomTab =() =>{
    return (
      <Tab.Navigator
       screenOptions={customTabBarStyle}
      >
   
      </Tab.Navigator>
    )
}

export default ProStatusBottomTab