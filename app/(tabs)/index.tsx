import ListHeading from "@/components/ListHeading";
import SubscriptionCard from "@/components/SubscriptionCard";
import UpComingSubscriptionCard from "@/components/UpComingSubscriptionCard";
import { HOME_BALANCE, HOME_SUBSCRIPTIONS, HOME_USER, UPCOMING_SUBSCRIPTIONS } from "@/constants/data";
import { icons } from "@/constants/icons";
import images from "@/constants/images";
import "@/global.css";
import { formatCurrency } from "@/lib/utils";
import dayjs from "dayjs";
import { styled } from "nativewind";
import { useState } from "react";
import { FlatList, Image, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView)

export default function App() {
  const [expandedSubscriptionId, setExpandedSubscriptionId ] = useState<string | null>(null)
  return (
    <SafeAreaView className="flex-1 bg-background p-5">

      {/* <SubscriptionCard {...HOME_SUBSCRIPTIONS[0]}/> */}

      <FlatList
        ListHeaderComponent={() => (
          <>
            <View className="home-header">
              <View className="home-user">
                <Image source={images.avathar} className="home-avatar" />
                <Text className="home-user-name">{HOME_USER.name}</Text>
              </View>
              <Image source={icons.add} className="home-add-icon" />
            </View>

            <View className="home-balance-card">
              <Text className="home-balance-label">Balance</Text>
              <View className="home-balance-ror">
                <Text className="home-balance-amount">
                  {formatCurrency(HOME_BALANCE.amount)}
                </Text>
                <Text className="home-balance-date">
                  {dayjs(HOME_BALANCE.nextRenewalDate).format("MM/DD")}
                </Text>
              </View>
            </View>

            <View className="mb-5">
              <ListHeading title="Upcoming" />
              {/* <UpComingSubscriptionCard data={UPCOMING_SUBSCRIPTIONS[0]}/> */}

              <FlatList
                data={UPCOMING_SUBSCRIPTIONS}
                renderItem={({ item }) => (
                  <UpComingSubscriptionCard {...item} />
                )}
                keyExtractor={(item) => item.id}
                horizontal
                ListEmptyComponent={<Text className="home-empty-state">No upcoming renewals..</Text>}
              />
            </View>
     
            <ListHeading title="All Subscriptions" />
          </>
        )}
        data={HOME_SUBSCRIPTIONS}
        renderItem={({ item }) => (
          <SubscriptionCard 
              {...item} 
              expanded={expandedSubscriptionId === item.id}
              onPress={()=> setExpandedSubscriptionId((currentId)=> (currentId === item.id ? null  : item.id))}
           />
        )}
        extraData={expandedSubscriptionId}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={()=> <View className="h-4" />}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<Text>No subscriptions yet.</Text>}
        contentContainerClassName="pb-20"
      />
    </SafeAreaView>
  );
}
