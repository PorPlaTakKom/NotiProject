import {StatusBar} from 'expo-status-bar';
import {Button, StyleSheet, Text, View} from 'react-native';
import * as Notifications from 'expo-notifications'
import * as Permissions from 'expo-permissions'
import * as Location from 'expo-location';
import {useEffect, useState, useRef} from "react";


Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

export default function App() {
    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();

    useEffect( () =>{
        registerForPushNotification().then(token =>{
            console.log(token)
            setExpoPushToken(token)
        }).catch(e =>{
            alert(e)
        })
        // This listener is fired whenever a notification is received while the app is foregrounded
        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            setNotification(notification);
        });
        // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log(response);
        });
        return () => {
            Notifications.removeNotificationSubscription(notificationListener.current);
            Notifications.removeNotificationSubscription(responseListener.current);
        };
    },[])

    const registerForPushNotification = async () => {
        const {status} = await Notifications.requestPermissionsAsync();
        if (status !== 'granted') {
            console.log('Permission to access location was denied');
            return ;
        }else{
            return (await Notifications.getExpoPushTokenAsync()).data
        }
    }
    return (
        <View
            style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'space-around',
            }}>
            <Text>Your expo push token: {expoPushToken}</Text>
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Text>Title: {notification && notification.request.content.title} </Text>
                <Text>Body: {notification && notification.request.content.body}</Text>
                <Text>Data: {notification && JSON.stringify(notification.request.content.data)}</Text>
            </View>
            {/*<Button*/}
            {/*    title="Press to Send Notification"*/}
            {/*    onPress={async () => {*/}
            {/*        await sendPushNotification(expoPushToken);*/}
            {/*    }}*/}
            {/*/>*/}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
