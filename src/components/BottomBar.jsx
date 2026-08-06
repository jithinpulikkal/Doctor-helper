import { ChartPie, List, Plus, Share, Stethoscope } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import tw from "twrnc";

export default function BottomBar({ bottomInset = 0, controller }) {
  const plusButtonClass = controller.themeMode === "dark" ? controller.theme.primary : "bg-white";
  const plusIconColor = controller.themeMode === "dark" ? "#171717" : "#20252d";

  return (
    <View style={[tw`absolute left-5 right-5`, { bottom: Math.max(bottomInset, 12) }]}>
      <View style={tw`h-18 px-3 flex-row items-center justify-between ${controller.theme.bottom} rounded-full opacity-90 shadow-lg`}>
        <TabButton
          active={controller.screen === "dashboard"}
          controller={controller}
          icon={ChartPie}
          label="Dashboard"
          onPress={() => controller.setScreen("dashboard")}
        />
        <TabButton
          active={controller.screen === "list"}
          controller={controller}
          icon={List}
          label="Meds"
          onPress={() => controller.setScreen("list")}
        />
        <Pressable
          onPress={controller.openCreate}
          style={tw`w-14 h-14 items-center justify-center rounded-full ${plusButtonClass} shadow-lg`}
        >
          <Plus size={26} color={plusIconColor} />
        </Pressable>
        <TabButton
          active={controller.screen === "export"}
          controller={controller}
          icon={Share}
          label="Export"
          onPress={() => controller.setScreen("export")}
        />
        <TabButton
          active={controller.screen === "profile"}
          controller={controller}
          icon={Stethoscope}
          label="Doctor"
          onPress={() => controller.setScreen("profile")}
        />
      </View>
    </View>
  );
}

function TabButton({ active = false, controller, icon: Icon, label, onPress }) {
  const activeColor = controller.themeMode === "dark" ? controller.theme.accentColor : "#ffffff";
  const activeText = controller.themeMode === "dark" ? controller.theme.accentText : "text-white";
  const inactiveColor = controller.themeMode === "dark" ? controller.theme.iconMuted : "#c5ccd6";
  const inactiveText = controller.themeMode === "dark" ? controller.theme.muted : "text-[#c5ccd6]";

  return (
    <Pressable onPress={onPress} style={tw`w-13 items-center justify-center`}>
      <Icon size={20} color={active ? activeColor : inactiveColor} />
      <Text style={tw`mt-1 text-[10px] font-black ${active ? activeText : inactiveText}`}>
        {label}
      </Text>
    </Pressable>
  );
}
