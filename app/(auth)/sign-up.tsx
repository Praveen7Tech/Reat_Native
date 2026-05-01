import { useSignUp } from "@clerk/expo";
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

export default function SignUp() {
  const { signUp, errors: clerkErrors, fetchStatus } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [localErrors, setLocalErrors] = useState<{ [key: string]: string }>({});

  const isLoading = fetchStatus === "fetching";

  const validateForm = () => {
    if (!emailAddress.trim()) {
      setLocalErrors({ global: "Email is required." });
      return false;
    }
    if (password.length < 8) {
      setLocalErrors({ global: "Password must be at least 8 characters." });
      return false;
    }
    if (password !== confirmPassword) {
      setLocalErrors({ global: "Passwords do not match." });
      return false;
    }
    return true;
  };

  const onSignUpPress = async () => {
    if (!signUp) return;
    if (!validateForm()) return;

    setLocalErrors({});

    try {
      const { error } = await signUp.password({
        emailAddress: emailAddress.toLowerCase().trim(),
        password,
      });

      if (error) {
        setLocalErrors({
          global: error.longMessage || error.message || "Sign up failed. Please try again.",
        });
        return;
      }

      const verificationRes = await signUp.verifications.sendEmailCode();
      if (verificationRes.error) {
        setLocalErrors({
          global: verificationRes.error.longMessage || "Failed to send verification code.",
        });
        return;
      }

      setPendingVerification(true);
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

  const onPressVerify = async () => {
    if (!signUp) return;

    setLocalErrors({});

    try {
      const { error } = await signUp.verifications.verifyEmailCode({ code });

      if (error) {
        setLocalErrors({
          global: error.longMessage || error.message || "Verification failed. Please try again.",
          code: "Invalid code",
        });
        return;
      }

      if (signUp.status === "complete") {
        await signUp.finalize({
          navigate: ({ decorateUrl }) => {
            router.replace(decorateUrl("/(tabs)") as any);
          },
        });
      } else {
        setLocalErrors({
          global: "Verification incomplete. Please try again.",
          code: "Incomplete",
        });
      }
    } catch (err: any) {
      setLocalErrors({
        global:
          err?.errors?.[0]?.longMessage ||
          err?.errors?.[0]?.message ||
          err?.message ||
          "An unexpected error occurred during verification.",
        code: "Error",
      });
    }
  };

  const emailHasError = !!(clerkErrors?.fields?.emailAddress);
  const passwordHasError = !!(clerkErrors?.fields?.password);
  const globalError = localErrors.global || clerkErrors?.global?.[0]?.message;

  // ── OTP Verification screen ───────────────────────────────────────────────
  if (pendingVerification) {
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

            {/* Header */}
            <View className="mb-8 items-center">
              <Text className="text-3xl font-sans-bold text-primary mb-2">Verify your email</Text>
              <Text className="text-base font-sans-medium text-muted-foreground text-center">
                {"We've sent a 6-digit code to"}
              </Text>
              <Text className="text-base font-sans-bold text-accent mt-1">{emailAddress}</Text>
            </View>

            {/* OTP Card */}
            <View className="auth-card">
              <View className="auth-form">

                <View className="auth-field">
                  <Text className="auth-label">Verification Code</Text>
                  <TextInput
                    className={`auth-input text-center text-2xl font-sans-bold tracking-widest ${localErrors.code ? "auth-input-error" : ""}`}
                    placeholder="000000"
                    placeholderTextColor="#D1D5DB"
                    value={code}
                    onChangeText={(text) => {
                      setCode(text.replace(/[^0-9]/g, "").slice(0, 6));
                      setLocalErrors({});
                    }}
                    keyboardType="number-pad"
                    maxLength={6}
                    editable={!isLoading}
                  />
                </View>

                {/* Global Error */}
                {globalError && (
                  <View className="rounded-2xl bg-destructive/10 border border-destructive/20 px-4 py-3">
                    <Text className="text-sm font-sans-medium text-destructive">{globalError}</Text>
                  </View>
                )}

                <TouchableOpacity
                  className={`auth-button mt-2 ${isLoading ? "auth-button-disabled" : ""}`}
                  onPress={onPressVerify}
                  disabled={isLoading}
                  activeOpacity={0.8}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#081126" size="small" />
                  ) : (
                    <Text className="auth-button-text">Verify Email</Text>
                  )}
                </TouchableOpacity>

              </View>
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  // ── Registration screen ───────────────────────────────────────────────────
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
            <Text className="text-3xl font-sans-bold text-primary mb-2">Create account</Text>
            <Text className="text-base font-sans-medium text-muted-foreground">
              Join Recurly to manage all your subscriptions
            </Text>
          </View>

          {/* Form Card */}
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
                  <Text className="auth-error">{clerkErrors?.fields?.emailAddress?.message}</Text>
                )}
              </View>

              {/* Password */}
              <View className="auth-field">
                <Text className="auth-label">Password</Text>
                <TextInput
                  className={`auth-input ${passwordHasError ? "auth-input-error" : ""}`}
                  placeholder="Min. 8 characters"
                  placeholderTextColor="#9CA3AF"
                  value={password}
                  onChangeText={(text) => { setPassword(text); setLocalErrors({}); }}
                  secureTextEntry
                  editable={!isLoading}
                />
                {passwordHasError && (
                  <Text className="auth-error">{clerkErrors?.fields?.password?.message}</Text>
                )}
                <Text className="auth-helper">Min. 8 chars · 1 uppercase · 1 number</Text>
              </View>

              {/* Confirm Password */}
              <View className="auth-field">
                <Text className="auth-label">Confirm Password</Text>
                <TextInput
                  className="auth-input"
                  placeholder="Repeat your password"
                  placeholderTextColor="#9CA3AF"
                  value={confirmPassword}
                  onChangeText={(text) => { setConfirmPassword(text); setLocalErrors({}); }}
                  secureTextEntry
                  editable={!isLoading}
                />
              </View>

              {/* Global Error */}
              {globalError && (
                <View className="rounded-2xl bg-destructive/10 border border-destructive/20 px-4 py-3">
                  <Text className="text-sm font-sans-medium text-destructive">{globalError}</Text>
                </View>
              )}

              {/* Sign Up Button */}
              <TouchableOpacity
                className={`auth-button mt-2 ${isLoading ? "auth-button-disabled" : ""}`}
                onPress={onSignUpPress}
                disabled={isLoading}
                activeOpacity={0.8}
              >
                {isLoading ? (
                  <ActivityIndicator color="#081126" size="small" />
                ) : (
                  <Text className="auth-button-text">Create account</Text>
                )}
              </TouchableOpacity>

              <View nativeID="clerk-captcha" />
            </View>
          </View>

          {/* Footer */}
          <View className="auth-link-row">
            <Text className="auth-link-copy">Already have an account?</Text>
            <Link href="/(auth)/sign-in">
              <Text className="auth-link"> Sign in</Text>
            </Link>
          </View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
