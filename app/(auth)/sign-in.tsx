import { useSignIn } from "@clerk/expo";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function SignIn() {
  const { signIn, errors: clerkErrors, fetchStatus } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [localErrors, setLocalErrors] = useState<{ [key: string]: string }>({});
  const [needsMfa, setNeedsMfa] = useState(false);

  const isLoading = fetchStatus === "fetching";

  const handleSubmit = async () => {
    if (!signIn) return;

    setLocalErrors({});

    try {
      const { error } = await signIn.password({
        emailAddress: emailAddress.toLowerCase().trim(),
        password,
      });

      if (error) {
        setLocalErrors({
          global: error.longMessage || error.message || "Sign in failed. Please check your credentials.",
        });
        return;
      }

      if (signIn.status === "complete") {
        await signIn.finalize({
          navigate: ({ decorateUrl }) => {
            router.replace(decorateUrl("/(tabs)") as any);
          },
        });
      } else if (signIn.status === "needs_second_factor") {
        // No second-factor screen exists in this app yet.
        // Gate the user with a clear UI instead of silently dead-ending them.
        setNeedsMfa(true);
      }
    } catch (err: any) {
      setLocalErrors({
        global:
          err?.errors?.[0]?.longMessage ||
          err?.errors?.[0]?.message ||
          err?.message ||
          "An unexpected error occurred. Please try again.",
      });
    }
  };

  const emailHasError = !!(clerkErrors?.fields?.identifier);
  const passwordHasError = !!(clerkErrors?.fields?.password);
  const globalError = localErrors.global || clerkErrors?.global?.[0]?.message;

  // ── MFA Gating Screen ────────────────────────────────────────────────────
  if (needsMfa) {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 bg-background"
      >
        <View className="flex-1 items-center justify-center px-6">
          {/* Icon */}
          <View className="size-16 rounded-2xl bg-accent items-center justify-center mb-6">
            <Text className="text-4xl">🔐</Text>
          </View>

          {/* Heading */}
          <Text className="text-2xl font-sans-bold text-primary text-center mb-3">
            Two-Factor Authentication Required
          </Text>

          {/* Body */}
          <Text className="text-sm font-sans-medium text-muted-foreground text-center mb-8 leading-6">
            Your account has multi-factor authentication enabled.{"\n"}This feature isn't supported in the app yet.{"\n\n"}Please sign in via the web portal or contact support for help accessing your account.
          </Text>

          {/* Back button */}
          <TouchableOpacity
            className="auth-button w-full"
            onPress={() => {
              setNeedsMfa(false);
              setPassword("");
              setLocalErrors({});
            }}
            activeOpacity={0.8}
          >
            <Text className="auth-button-text">← Back to Sign In</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }

  // ── Normal Sign-In Screen ─────────────────────────────────────────────────
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-background"
    >
      <ScrollView
        contentContainerClassName="flex-grow justify-center"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View className="px-6 py-10">

          {/* Logo */}
          <View className="items-center mb-10">
            <View className="size-14 rounded-2xl bg-accent items-center justify-center mb-3">
              <Text className="text-3xl font-sans-extrabold text-background">R</Text>
            </View>
            <Text className="text-2xl font-sans-bold text-primary">Recurly</Text>
            <Text className="text-xs font-sans-semibold text-muted-foreground tracking-widest mt-1">SMART BILLING</Text>
          </View>

          {/* Welcome */}
          <View className="mb-8">
            <Text className="text-3xl font-sans-bold text-primary mb-2">Welcome back</Text>
            <Text className="text-base font-sans-medium text-muted-foreground">
              Sign in to continue managing your subscriptions
            </Text>
          </View>

          {/* Form */}
          <View className="auth-card">
            <View className="auth-form">

              {/* Email */}
              <View className="auth-field">
                <Text className="auth-label">Email</Text>
                <TextInput
                  className={`auth-input ${emailHasError ? "auth-input-error" : ""}`}
                  placeholder="Enter your email"
                  placeholderTextColor="#9CA3AF"
                  value={emailAddress}
                  onChangeText={(text) => { setEmailAddress(text); setLocalErrors({}); }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isLoading}
                />
                {emailHasError && (
                  <Text className="auth-error">{clerkErrors?.fields?.identifier?.message}</Text>
                )}
              </View>

              {/* Password */}
              <View className="auth-field">
                <Text className="auth-label">Password</Text>
                <TextInput
                  className={`auth-input ${passwordHasError ? "auth-input-error" : ""}`}
                  placeholder="Enter your password"
                  placeholderTextColor="#9CA3AF"
                  value={password}
                  onChangeText={(text) => { setPassword(text); setLocalErrors({}); }}
                  secureTextEntry
                  editable={!isLoading}
                />
                {passwordHasError && (
                  <Text className="auth-error">{clerkErrors?.fields?.password?.message}</Text>
                )}
              </View>

              {/* Global Error */}
              {globalError && (
                <View className="rounded-2xl bg-destructive/10 border border-destructive/20 px-4 py-3">
                  <Text className="text-sm font-sans-medium text-destructive">{globalError}</Text>
                </View>
              )}

              {/* Sign In Button */}
              <TouchableOpacity
                className={`auth-button mt-2 ${isLoading ? "auth-button-disabled" : ""}`}
                onPress={handleSubmit}
                disabled={isLoading}
                activeOpacity={0.8}
              >
                {isLoading ? (
                  <ActivityIndicator color="#081126" size="small" />
                ) : (
                  <Text className="auth-button-text">Sign in</Text>
                )}
              </TouchableOpacity>

            </View>
          </View>

          {/* Footer */}
          <View className="auth-link-row">
            <Text className="auth-link-copy">New to Recurly?</Text>
            <Link href="/(auth)/sign-up">
              <Text className="auth-link"> Create an account</Text>
            </Link>
          </View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
