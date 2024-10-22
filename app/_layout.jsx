import { View, Text, LogBox, Dimensions } from "react-native";
import React, { useEffect } from "react";
import { Stack, useRouter } from "expo-router";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";
import { getUserData } from "../services/userService";
import { Platform } from "react-native";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

LogBox.ignoreLogs([
  "Warning: TNodeChildrenRenderer",
  "Warning: MemoizedTNodeRenderer",
  "Warning: TRenderEngineProvider",
]);

const _layout = () => {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
};

const MainLayout = () => {
  const { setAuth, setUserData } = useAuth();
  const router = useRouter();

  useEffect(() => {
    supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setAuth(session?.user);
        updateUserData(session?.user, session?.user?.email);
        router.replace("/home");
      } else {
        setAuth(null);
        router.replace("/welcome");
      }
    });
  }, []);

  const updateUserData = async (user, email) => {
    let res = await getUserData(user?.id);
    if (res.success) setUserData({ ...res.data, email });
  };

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="(main)/postDetails"
        options={{
          presentation: "modal",
          animation: "slide_from_bottom",
          // Set up container for card modal
          containerStyle: {
            backgroundColor: "transparent",
          },
          contentStyle: {
            backgroundColor: "transparent",
          },
          // Card styling
          cardStyle: {
            backgroundColor: "white",
            height: SCREEN_HEIGHT * 0.8, // 80% of screen height
            width: SCREEN_WIDTH * 0.9, // 90% of screen width
            alignSelf: "center",
            marginTop: SCREEN_HEIGHT * 0.1,
            borderRadius: 16,
            overflow: "hidden",
            // Add shadow for card effect
            ...Platform.select({
              ios: {
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
              },
              android: {
                elevation: 5,
              },
            }),
          },
          // iOS-style gesture handling
          gestureEnabled: true,
          gestureDirection: "vertical",
          gestureVelocityImpact: 0.6,
          gestureResponseDistance: {
            vertical: SCREEN_HEIGHT * 0.8,
          },
          // Custom animations
          transitionSpec: {
            open: {
              animation: "spring",
              config: {
                stiffness: 1000,
                damping: 500,
                mass: 3,
                overshootClamping: true,
                restDisplacementThreshold: 0.01,
                restSpeedThreshold: 0.01,
              },
            },
            close: {
              animation: "timing",
              config: {
                duration: 250,
              },
            },
          },
          // Platform-specific styling
          ...(Platform.OS === "ios"
            ? {
                cardOverlayEnabled: true,
                cardOverlay: () => (
                  <View
                    style={{
                      flex: 1,
                      backgroundColor: "rgba(0,0,0,0.3)",
                    }}
                  />
                ),
                // Add header handle
                header: () => (
                  <View
                    style={{
                      width: "100%",
                      alignItems: "center",
                      paddingTop: 12,
                      paddingBottom: 8,
                      backgroundColor: "white",
                    }}
                  >
                    <View
                      style={{
                        width: 36,
                        height: 4,
                        backgroundColor: "#D1D5DB",
                        borderRadius: 2,
                      }}
                    />
                  </View>
                ),
              }
            : {}),
        }}
      />
    </Stack>
  );
};

export default _layout;
