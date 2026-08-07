import { Info, LogOut, Moon, Smartphone, Sun } from "lucide-react-native";
import { Pressable, ScrollView, Text, View } from "react-native";
import tw from "twrnc";
import Header from "../components/Header";
import { APP_DETAILS } from "../constants/appConstants";

export default function SettingsView({ controller }) {
  return (
    <View style={tw`flex-1 ${controller.theme.page}`}>
      <Header controller={controller} title="Settings" showBack backTarget="profile" />
      <ScrollView contentContainerStyle={tw`px-5 pb-24`}>
        <View style={tw`p-5 rounded-3xl shadow-sm ${controller.theme.card}`}>
          <Text style={tw`text-lg font-black ${controller.theme.text}`}>Theme</Text>
          <Text style={tw`mt-1 leading-5 ${controller.theme.muted}`}>
            Choose how the app should look across dashboard, medicines, profile, and settings.
          </Text>

          <View style={tw`flex-row gap-3 mt-5`}>
            <ThemeButton
              active={controller.themeMode === "light"}
              controller={controller}
              icon={Sun}
              label="Light"
              onPress={() => controller.setThemeMode("light")}
            />
            <ThemeButton
              active={controller.themeMode === "dark"}
              controller={controller}
              icon={Moon}
              label="Dark"
              onPress={() => controller.setThemeMode("dark")}
            />
          </View>
        </View>

        <View style={tw`p-5 mt-4 rounded-3xl shadow-sm ${controller.theme.card}`}>
          <View style={tw`flex-row items-center`}>
            <Info size={20} color={controller.theme.accentColor} />
            <Text style={tw`ml-2 text-lg font-black ${controller.theme.text}`}>App details</Text>
          </View>

          <DetailRow controller={controller} label="App Name" value={APP_DETAILS.name} />
          <DetailRow controller={controller} label="Version" value={APP_DETAILS.version} />
          <DetailRow controller={controller} label="Storage" value={APP_DETAILS.storage} />
          <DetailRow controller={controller} label="Backend" value={APP_DETAILS.backend} />
        </View>

        <View style={tw`p-5 mt-4 rounded-3xl shadow-sm ${controller.theme.card}`}>
          <View style={tw`flex-row items-center`}>
            <Smartphone size={20} color={controller.theme.accentColor} />
            <Text style={tw`ml-2 text-lg font-black ${controller.theme.text}`}>Local data</Text>
          </View>
          <Text style={tw`mt-2 leading-5 ${controller.theme.muted}`}>
            Medicine records, profile, categories, types, and theme preference are saved on this phone.
          </Text>
          <Text style={tw`mt-4 text-3xl font-black ${controller.theme.text}`}>
            {controller.stats.total}
          </Text>
          <Text style={tw`text-sm font-bold ${controller.theme.muted}`}>Saved medicines</Text>
        </View>

        <View style={tw`p-5 mt-4 rounded-3xl shadow-sm ${controller.theme.card}`}>
          <View style={tw`flex-row items-center`}>
            <LogOut size={20} color={controller.theme.accentColor} />
            <Text style={tw`ml-2 text-lg font-black ${controller.theme.text}`}>Account</Text>
          </View>
          <Text style={tw`mt-2 leading-5 ${controller.theme.muted}`}>
            Logout returns to the get started and login pages. Your saved medicine data stays on this phone.
          </Text>
          <Pressable
            onPress={controller.logout}
            style={tw`h-14 mt-5 flex-row items-center justify-center rounded-full ${controller.theme.accentBg}`}
          >
            <LogOut size={18} color={controller.theme.accentColor} />
            <Text style={tw`ml-2 font-black ${controller.theme.accentText}`}>Logout</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

function ThemeButton({ active, controller, icon: Icon, label, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={tw`flex-1 h-24 items-center justify-center rounded-3xl ${
        active ? controller.theme.primary : controller.theme.cardAlt
      }`}
    >
      <Icon size={24} color={active ? (controller.themeMode === "dark" ? "#171717" : "#ffffff") : controller.theme.accentColor} />
      <Text style={tw`mt-2 font-black ${active ? controller.theme.primaryText : controller.theme.text}`}>{label}</Text>
    </Pressable>
  );
}

function DetailRow({ controller, label, value }) {
  return (
    <View style={tw`py-4 border-b ${controller.theme.border}`}>
      <Text style={tw`text-xs font-black uppercase ${controller.theme.muted}`}>{label}</Text>
      <Text style={tw`mt-1 text-base font-bold ${controller.theme.text}`}>{value}</Text>
    </View>
  );
}
