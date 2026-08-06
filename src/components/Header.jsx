import { ArrowLeft } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import tw from "twrnc";

export default function Header({ controller, title = "Doctor Helper", showBack = false, backTarget = null }) {
  const businessName = controller.profile?.businessName?.trim();
  const recordTitle = businessName ? `${businessName} Library` : "Medicine Library";

  return (
    <View style={tw`px-5 pt-4 pb-4 ${controller.theme.header}`}>
      <View style={tw`flex-row items-center justify-between`}>
        <View style={tw`flex-row items-center flex-1`}>
          {showBack ? (
            <Pressable
              onPress={() => (backTarget ? controller.setScreen(backTarget) : controller.goBack())}
              style={tw`h-11 px-3 flex-row items-center justify-center rounded-full ${controller.theme.card} border ${controller.theme.border}`}
            >
              <ArrowLeft size={18} color={controller.themeMode === "dark" ? "#f4f1ea" : "#20252d"} />
            </Pressable>
          ) : null}
          <View style={tw`${showBack ? "ml-3" : ""} flex-1`}>
            <Text style={tw`text-sm uppercase font-black tracking-wide ${controller.theme.accentText}`}>
              {recordTitle}
            </Text>
            {title ? <Text style={tw`text-xl font-black ${controller.theme.text}`}>{title}</Text> : null}
          </View>
        </View>

      </View>
    </View>
  );
}
