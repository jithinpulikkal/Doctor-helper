import { ExternalLink, Globe2, Search } from "lucide-react-native";
import { Platform, Pressable, Text, View } from "react-native";
import tw from "twrnc";
import Header from "../components/Header";

export default function MedicineResearchView({ controller, entry }) {
  const url = controller.buildMedicineSearchUrl(entry);
  const title = `${entry.name || "Medicine"} ${entry.type || ""}`.trim();

  return (
    <View style={tw`flex-1 ${controller.theme.page}`}>
      <Header controller={controller} title="Web Research" showBack />
      <View style={tw`flex-1 px-5 pb-5`}>
        <View style={tw`p-4 mb-4 ${controller.theme.card} rounded-[28px] border ${controller.theme.border}`}>
          <View style={tw`flex-row items-center`}>
            <View style={tw`w-12 h-12 items-center justify-center rounded-2xl ${controller.theme.accentBg}`}>
              <Search size={22} color={controller.theme.accentColor} />
            </View>
            <View style={tw`ml-3 flex-1`}>
              <Text style={tw`text-lg font-black ${controller.theme.text}`}>{title}</Text>
              <Text style={tw`mt-1 text-sm ${controller.theme.muted}`}>
                Google search for uses, dosage, and alternatives.
              </Text>
            </View>
          </View>
        </View>

        {Platform.OS === "web" ? (
          <View style={tw`flex-1 overflow-hidden ${controller.theme.card} rounded-[28px] border ${controller.theme.border}`}>
            <iframe
              src={url}
              title={`Google search for ${title}`}
              style={{ border: 0, flex: 1, height: "100%", width: "100%" }}
            />
          </View>
        ) : (
          <View style={tw`flex-1 items-center justify-center p-6 ${controller.theme.card} rounded-[28px] border ${controller.theme.border}`}>
            <Globe2 size={44} color={controller.theme.accentColor} />
            <Text style={tw`mt-4 text-xl font-black text-center ${controller.theme.text}`}>Google results ready</Text>
            <Text style={tw`mt-2 text-center leading-6 ${controller.theme.muted}`}>
              Native in-app web pages need a WebView package. This screen keeps the search in Doctor Helper and opens the exact saved medicine query in Google.
            </Text>
            <Pressable
              onPress={() => controller.openResearchInBrowser(entry)}
              style={tw`h-14 mt-6 px-5 flex-row items-center justify-center rounded-2xl ${controller.theme.primary}`}
            >
              <ExternalLink size={18} color={controller.themeMode === "dark" ? "#071314" : "#ffffff"} />
              <Text style={tw`ml-2 font-black ${controller.theme.primaryText}`}>Open Google Results</Text>
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
}
