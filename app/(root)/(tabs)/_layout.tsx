import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import { Image } from 'expo-image'
import { FontAwesome5, Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons"

const TabIcon = ({ focused, icon, title }: { focused: boolean, icon: any, title: string }) => {
    return (
        <View className="flex-1 flex flex-col items-center">
            {icon}
            <Text
                className={`${focused
                    ? "text-primary"
                    : "text-black"
                    } text-xs w-full text-center mt-1`}
            >
                {title}
            </Text>
        </View>
    )
}

const TabsLayout = () => {
    return (
        <Tabs
            screenOptions={{
                tabBarShowLabel: false,
                tabBarStyle: {
                    backgroundColor: "white",
                    position: "absolute",
                    borderTopColor: "#CDD5E0",
                    borderTopWidth: 1,
                    minHeight: 70,
                    paddingTop: 4,
                },
            }}>

            <Tabs.Screen
                name="index"
                options={{
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon focused={focused} icon={<MaterialIcons name="storefront" size={24} color={focused ? "#3498DB" : "#2C3E50"} />} title="Marketplace" />
                    ),
                }}
            />
            <Tabs.Screen
                name="favorites"
                options={{
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon focused={focused} icon={<FontAwesome5 name="heart" size={24} color={focused ? "#3498DB" : "#2C3E50"} />} title="Favorites" />
                    ),
                }}
            />
            <Tabs.Screen
                name="upload"
                options={{
                    headerShown: false,
                    /* tabBarStyle: { display: "none" }, */
                    tabBarIcon: ({ focused }) => (
                        <TabIcon focused={focused} icon={<FontAwesome5 name="plus-square" size={24} color={focused ? "#3498DB" : "#2C3E50"} />} title="Upload" />
                    ),
                }}
            />
            <Tabs.Screen
                name="messages"
                options={{
                    headerShown: false,
                    /* tabBarStyle: { display: "none" }, */
                    tabBarIcon: ({ focused }) => (
                        <TabIcon focused={focused} icon={<MaterialCommunityIcons name="chat-outline" size={24} color={focused ? "#3498DB" : "#2C3E50"} />} title="Messages" />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    headerShown: false,
                    /* tabBarStyle: { display: "none" }, */
                    tabBarIcon: ({ focused }) => (
                        <TabIcon focused={focused} icon={<MaterialCommunityIcons name="account-outline" size={24} color={focused ? "#3498DB" : "#2C3E50"} />} title="Profile" />
                    ),
                }}
            />

        </Tabs>
    )
}

export default TabsLayout