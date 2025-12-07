import { Stack } from "expo-router";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message"
import "./global.css"

const toastConfig = {
  success: (props:any) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: "#72c69b", height: 80 }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 18,
        fontWeight: "bold",
        color: "#182c53",
      }}
      text2Style={{
        fontSize: 16,
        color: "#5a6778",
      }}
    />
  ),
  error: (props:any) => (
    <ErrorToast
      {...props}
      style={{ borderLeftColor: "#e74c3c", height: 80 }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 18,
        fontWeight: "bold",
        color: "#182c53",
      }}
      text2Style={{
        fontSize: 16,
        color: "#5a6778",
      }}
    />
  ),
};

export default function RootLayout() {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }} />
      <Toast config={toastConfig}></Toast>
    </>
  );
}
