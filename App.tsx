import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen'; // Tela com o calendário
import PetsScreen from './screens/PetsScreen'; // Tela "Meus Pets"
import ClubinhosScreen from './screens/ClubinhosScreen';  // Tela "Clubinhos"

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

// Stack Navigator para a tela "Início"
function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="HomeScreen" 
        component={HomeScreen} 
        options={{ headerShown: false }} // Navbar visível para esta tela
      />
    </Stack.Navigator>
  );
}

// Stack Navigator para a tela "Meus Pets"
function PetsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="PetsScreen" 
        component={PetsScreen} 
        options={{ headerShown: false }} // Navbar visível para esta tela
      />
    </Stack.Navigator>
  );
}

// Stack Navigator para a tela "Clubinhos"
function ClubinhosStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="ClubinhosScreen" 
        component={ClubinhosScreen} 
        options={{ headerShown: false }} // Navbar visível para esta tela
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="HomeScreen">
        <Drawer.Screen name="Início" component={HomeStack} />
        <Drawer.Screen name="Meus Pets" component={PetsStack} />
        {/* Adicionando a nova opção para a tela "Clubinhos" */}
        <Drawer.Screen name="Clubinhos" component={ClubinhosStack} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
