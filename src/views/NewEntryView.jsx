import { ClipboardList, ListPlus, Pill } from "lucide-react-native";
import { Pressable, ScrollView, Text, View } from "react-native";
import tw from "twrnc";
import Header from "../components/Header";

export default function NewEntryView({ controller }) {
  return (
    <View style={tw`flex-1 ${controller.theme.page}`}>
      <Header controller={controller} title="New Medicine" showBack />
      <ScrollView contentContainerStyle={tw`px-5 pb-24`}>
        <OptionCard
          controller={controller}
          description="Save a medicine with type, alternates, uses, dosage, and notes."
          icon={Pill}
          onPress={controller.openEntryCreate}
          title="Medicine Entry"
        />
        <OptionCard
          controller={controller}
          description="Save a medicine name with brand, maker, and reference details."
          icon={Pill}
          onPress={controller.openCustomerCreate}
          title="Medicine Name"
        />
        <OptionCard
          controller={controller}
          description="Add an availability option such as available, low stock, or unavailable."
          icon={ListPlus}
          onPress={controller.openStatusCreate}
          title="Availability"
        />
        <OptionCard
          controller={controller}
          description="Add a medicine type such as tablet, syrup, injection, or drops."
          icon={ListPlus}
          onPress={controller.openTypeCreate}
          title="Medicine Type"
        />
      </ScrollView>
    </View>
  );
}

function OptionCard({ controller, description, icon: Icon, onPress, title }) {
  return (
    <Pressable onPress={onPress} style={tw`mb-4 p-5 ${controller.theme.card} border ${controller.theme.border} rounded-[28px] shadow-sm`}>
      <View style={tw`flex-row items-center`}>
        <View style={tw`w-14 h-14 items-center justify-center rounded-2xl ${controller.theme.cardAlt}`}>
          <Icon size={24} color={controller.theme.accentColor} />
        </View>
        <View style={tw`ml-4 flex-1`}>
          <Text style={tw`text-lg font-black ${controller.theme.text}`}>{title}</Text>
          <Text style={tw`mt-1 text-sm leading-5 ${controller.theme.muted}`}>{description}</Text>
        </View>
      </View>
    </Pressable>
  );
}
