import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../Screens/Home/HomeScreen';
import ProfileScreen from '../Screens/Profile/ProfileScreen';
import SearchScreen from '../Screens/Search/SearchScreen';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../Utils/Colors';
import AddScreenNavigation from './AddScreenNavigation';
import HomeScreenStackNavigation from './HomeScreenStackNavigation';

const Tab = createBottomTabNavigator();

export default function TabNaviation() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: Colors.BLACK,
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreenStackNavigation}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Add"
        component={AddScreenNavigation}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people-circle-sharp" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
