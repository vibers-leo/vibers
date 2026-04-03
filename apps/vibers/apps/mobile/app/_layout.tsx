import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#0a0a0a' },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="workspace" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="recipes" />
        <Stack.Screen name="remote" />
        <Stack.Screen name="vscode" />
        <Stack.Screen name="terminal" />
      </Stack>
    </>
  );
}
