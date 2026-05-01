import { useAuth, useUser } from "@clerk/expo";
import { useRouter } from "expo-router";
import { styled } from "nativewind";
import React from 'react';
import { Text, View, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import images from "@/constants/images";

const SafeAreaView = styled(RNSafeAreaView);

const Settings = () => {
  const { user } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace("/(auth)/sign-in");
    } catch (err: any) {
      console.error("Sign out error:", err);
      Alert.alert("Error", "Failed to sign out. Please try again.");
    }
  };

  return (
    <SafeAreaView className='bg-background flex-1'>
      <ScrollView contentContainerClassName="p-5 pb-20" showsVerticalScrollIndicator={false}>
        <View className="mb-6">
          <Text className="text-3xl font-sans-bold text-primary">Settings</Text>
        </View>

        {/* Profile Card */}
        <View className="rounded-3xl border border-border bg-card p-5 mb-6 shadow-sm">
          <View className="items-center mb-5">
            <Image 
              source={user?.imageUrl ? { uri: user.imageUrl } : images.avathar} 
              className="size-24 rounded-full border-4 border-background shadow-sm" 
            />
            <Text className="mt-4 text-2xl font-sans-bold text-primary">
              {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : user?.emailAddresses[0]?.emailAddress?.split('@')[0] || "User"}
            </Text>
            <Text className="text-sm font-sans-medium text-muted-foreground mt-1">
              Member since {user?.createdAt ? new Date(user.createdAt).getFullYear() : new Date().getFullYear()}
            </Text>
          </View>

          <View className="h-px bg-border my-4" />

          {/* Details */}
          <View className="gap-4">
            <View className="flex-row items-center justify-between">
              <Text className="text-sm font-sans-semibold text-muted-foreground">Email</Text>
              <Text className="text-sm font-sans-bold text-primary">
                {user?.emailAddresses[0]?.emailAddress}
              </Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="text-sm font-sans-semibold text-muted-foreground">Status</Text>
              <View className="bg-success/20 px-3 py-1 rounded-full">
                <Text className="text-xs font-sans-bold text-success">Active</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Preferences / Placeholder */}
        <View className="rounded-3xl border border-border bg-card p-5 mb-6">
          <Text className="text-lg font-sans-bold text-primary mb-4">Preferences</Text>
          <View className="flex-row items-center justify-between py-3 border-b border-border">
            <Text className="text-base font-sans-medium text-primary">Push Notifications</Text>
            <Text className="text-sm font-sans-bold text-accent">Enabled</Text>
          </View>
          <View className="flex-row items-center justify-between py-3 border-b border-border">
            <Text className="text-base font-sans-medium text-primary">Theme</Text>
            <Text className="text-sm font-sans-bold text-muted-foreground">Light</Text>
          </View>
          <View className="flex-row items-center justify-between py-3">
            <Text className="text-base font-sans-medium text-primary">Currency</Text>
            <Text className="text-sm font-sans-bold text-muted-foreground">USD ($)</Text>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity 
          className="items-center rounded-2xl bg-destructive/10 py-4 border border-destructive/20 mt-4"
          onPress={handleSignOut}
          activeOpacity={0.8}
        >
          <Text className="text-base font-sans-bold text-destructive">Sign Out</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

export default Settings;