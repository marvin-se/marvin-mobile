import { FontAwesome5, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons"
import { router, Tabs } from 'expo-router'
import React from 'react'
import { Text, View } from 'react-native'

const TabIcon = ({ focused, icon, title }: { focused: boolean, icon: any, title?: string }) => {
    return (
        <View className="flex-1 flex flex-col items-center">
            {icon}
            <Text
                className={`${focused
                    ? "text-primary"
                    : "text-lightGray"
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
                        <TabIcon focused={focused} icon={<MaterialIcons name="storefront" size={24} color={focused ? "#72C69B" : "#DDD"} />} title="Marketplace" />
                    ),
                }}
            />
            <Tabs.Screen
                name="favorites"
                options={{
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon focused={focused} icon={<FontAwesome5 name="heart" size={24} color={focused ? "#72C69B" : "#DDD"} />} title="Favorites" />
                    ),
                }}
            />
            <Tabs.Screen
                name="upload-placeholder"
                options={{
                    headerShown: false,
                    /* tabBarStyle: { display: "none" }, */
                    tabBarIcon: ({ focused }) => (
                        <View className='bg-primary rounded-full w-14 h-14 -mt-6 items-center justify-center'>
                            <FontAwesome5 name="plus" size={24} color="#fff" />
                        </View>
                    ),
                }}
                listeners={{
                    tabPress:(e) => {
                        e.preventDefault();
                        router.push("/(root)/upload")
                    }
                }}
            />
            <Tabs.Screen
                name="messages"
                options={{
                    headerShown: false,
                    /* tabBarStyle: { display: "none" }, */
                    tabBarIcon: ({ focused }) => (
                        <TabIcon focused={focused} icon={<MaterialCommunityIcons name="chat-outline" size={24} color={focused ? "#72C69B" : "#DDD"} />} title="Messages" />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    headerShown: false,
                    /* tabBarStyle: { display: "none" }, */
                    tabBarIcon: ({ focused }) => (
                        <TabIcon focused={focused} icon={<MaterialCommunityIcons name="account-outline" size={24} color={focused ? "#72C69B" : "#DDD"} />} title="Profile" />
                    ),
                }}
            />

        </Tabs>
    )
}

export default TabsLayout