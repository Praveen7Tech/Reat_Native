import { useAuth } from "@clerk/expo";
import { Redirect } from "expo-router";
import { ActivityIndicator, StyleSheet, View } from "react-native";

export default function Index() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#E8673A" />
      </View>
    );
  }

  if (isSignedIn) {
    return <Redirect href={"/(tabs)" as any} />;
  }

  return <Redirect href={"/(auth)/sign-in" as any} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5EFE7",
  },
});
