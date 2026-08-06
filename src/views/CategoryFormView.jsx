import { Save, Tag, X } from "lucide-react-native";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import tw from "twrnc";
import Header from "../components/Header";

export default function CategoryFormView({ controller }) {
  const placeholderColor = controller.themeMode === "dark" ? "#777d90" : "#8d96a3";
  const inputStyle = tw`px-4 min-h-13 text-base border rounded-2xl ${controller.theme.input}`;
  const iconBg = controller.themeMode === "dark" ? "bg-[#303030]" : "bg-[#fff2ef]";
  const categoryIndex = controller.categories.findIndex((category) => category === controller.categoryForm.name);
  const categoryLabel = `Category ${categoryIndex >= 0 ? categoryIndex + 1 : controller.categories.length + 1}`;

  return (
    <View style={tw`flex-1 ${controller.theme.page}`}>
      <Header controller={controller} title="Medicine Category" showBack />
      <ScrollView contentContainerStyle={tw`px-5 pb-24`}>
        <View style={tw`items-center pt-3 pb-5`}>
          <View style={tw`w-18 h-18 items-center justify-center rounded-3xl ${iconBg}`}>
            <Tag size={34} color={controller.theme.accentColor} />
          </View>
          <Text style={tw`mt-3 text-md font-black uppercase tracking-wide ${controller.theme.accentText}`}>
            {categoryLabel}
          </Text>
          <Text style={tw`m-4 text-2xl font-black ${controller.theme.text}`}>
            {controller.categoryForm.name ? controller.categoryForm.name : ""}
          </Text>
          <Text style={tw`mt-1 text-center text-sm ${controller.theme.muted}`}>
            Save a reusable medicine category option.
          </Text>
        </View>

        <View style={tw`p-4 ${controller.theme.card} border ${controller.theme.border} rounded-3xl`}>
          <Text style={tw`mb-2 text-xs font-black uppercase tracking-wide ${controller.theme.muted}`}>Category Name</Text>
          <TextInput
            value={controller.categoryForm.name}
            onChangeText={(value) => controller.setCategoryField("name", value)}
            placeholder="Antibiotic, analgesic, antihistamine..."
            placeholderTextColor={placeholderColor}
            style={inputStyle}
          />
        </View>

        <View style={tw`mt-5 p-3 ${controller.theme.card} rounded-3xl border ${controller.theme.border}`}>
          <Pressable onPress={controller.saveCategory} style={tw`h-14 flex-row items-center justify-center rounded-2xl ${controller.theme.primary}`}>
            <Save size={18} color={controller.themeMode === "dark" ? "#171717" : "#ffffff"} />
            <Text style={tw`ml-2 font-black ${controller.theme.primaryText}`}>Save Category</Text>
          </Pressable>
          <Pressable onPress={() => controller.goBack("list")} style={tw`h-12 mt-2 flex-row items-center justify-center rounded-2xl ${controller.theme.cardAlt}`}>
            <X size={17} color={controller.theme.iconMuted} />
            <Text style={tw`ml-2 font-black ${controller.theme.muted}`}>Cancel</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
