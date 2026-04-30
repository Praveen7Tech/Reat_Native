import { styled } from "nativewind";
import React from 'react';
import { Text } from 'react-native';
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
const SafeAreaView = styled(RNSafeAreaView)

const subscription = () => {
  return (
    <SafeAreaView className='bg-background flex-1 p-5'>
      <Text>subscription</Text>
    </SafeAreaView>
  )
}

export default subscription