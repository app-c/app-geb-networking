import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { SingIn } from '../pages/LogIn';

const Auth = createStackNavigator();

export function SignAuth() {
    return (
        <Auth.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Auth.Screen name="Sign" component={SingIn} />
        </Auth.Navigator>
    );
}
