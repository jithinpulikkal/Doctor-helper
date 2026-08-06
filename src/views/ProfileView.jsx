import * as ImagePicker from "expo-image-picker";
import { Camera, ClipboardList, Layers3, Settings, UserRound } from "lucide-react-native";
import { Image, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import tw from "twrnc";
import Field from "../components/Field";
import Header from "../components/Header";

export default function ProfileView({ controller }) {
    const setProfileField = (field, value) => {
        controller.setProfile({ ...controller.profile, [field]: value });
    };
    const pickProfilePhoto = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
            controller.showDialog("Permission needed", "Allow photo access to change the profile picture.", "warning");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [1, 1],
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.8,
        });

        if (!result.canceled && result.assets?.[0]?.uri) {
            setProfileField("photoUri", result.assets[0].uri);
        }
    };
    const themedInputStyle = tw`px-4 min-h-13 text-base border rounded-2xl ${controller.theme.input}`;
    const placeholderColor = controller.themeMode === "dark" ? "#94a3b8" : "#7b8491";

    return (
        <View style={tw`flex-1 ${controller.theme.page}`}>
            <Header controller={controller} title="Profile" showBack />
            <ScrollView contentContainerStyle={tw`px-5 pb-24`}>
                <Pressable
                    onPress={() => controller.setScreen("settings")}
                    style={tw`h-13 mb-4 px-4 flex-row items-center justify-center rounded-full ${controller.theme.card}`}
                >
                    <Settings size={18} color={controller.themeMode === "dark" ? "#ffffff" : "#20252d"} />
                    <Text style={tw`ml-2 font-black ${controller.theme.text}`}>App Settings</Text>
                </Pressable>

                <View style={tw`overflow-hidden ${controller.theme.card} rounded-3xl shadow-sm`}>
                    <View
                        style={tw`px-5 pt-5 pb-20 ${controller.themeMode === "dark" ? "bg-[#303030]" : controller.theme.primary}`}
                    >
                        <View style={tw`flex-row items-center justify-between`}>
                            <View>
                                <Text style={tw`text-[10px] font-black uppercase tracking-wide text-[#8fd6ff]`}>
                                    Practice Type
                                </Text>
                                <Text style={tw`mt-1 text-xs font-black uppercase text-white`}>Local Records</Text>
                            </View>
                            <View style={tw`items-end`}>
                                <Text style={tw`text-[10px] font-black uppercase tracking-wide text-[#8fd6ff]`}>
                                    Storage Mode
                                </Text>
                                <Text style={tw`mt-1 text-xs font-black uppercase text-white`}>Offline</Text>
                            </View>
                        </View>
                    </View>

                    <View style={tw`items-center px-5 pb-6 -mt-16`}>
                        <Pressable
                            onPress={pickProfilePhoto}
                            style={tw`w-32 h-32 items-center justify-center rounded-full ${
                                controller.themeMode === "dark" ? "bg-[#232323]" : "bg-[#f6f7f9]"
                            } border-8 ${
                                controller.themeMode === "dark" ? "border-[#050505]" : "border-white"
                            } shadow-lg overflow-hidden`}
                        >
                            <UserRound size={58} color={controller.themeMode === "dark" ? "#f4f1ea" : "#20252d"} />
                            {controller.profile.photoUri ? (
                                <Image
                                    onError={() => setProfileField("photoUri", "")}
                                    source={{ uri: controller.profile.photoUri }}
                                    style={tw`absolute inset-0 w-full h-full`}
                                />
                            ) : null}
                            <View
                                style={tw`absolute right-1 bottom-1 w-9 h-9 items-center justify-center rounded-full ${controller.theme.primary}`}
                            >
                                <Camera size={16} color={controller.themeMode === "dark" ? "#171717" : "#ffffff"} />
                            </View>
                        </Pressable>
                        <Text style={tw`mt-4 text-2xl font-black ${controller.theme.text}`}>
                            Dr. {controller.profile.ownerName || "Owner Name"}
                        </Text>
                        <Text style={tw`mt-1 text-base font-bold ${controller.theme.muted}`}>
                            {controller.profile.businessName || "Doctor Helper"}
                        </Text>

                        <View style={tw`w-full h-px my-5 ${controller.theme.cardAlt}`} />

                        <View style={tw`w-full flex-row gap-3`}>
                            <InfoPill
                                controller={controller}
                                icon={ClipboardList}
                                label="Total"
                                value={controller.stats.total}
                            />
                            <InfoPill
                                controller={controller}
                                icon={Layers3}
                                label="Categories"
                                value={controller.categories.length}
                            />
                        </View>
                    </View>
                </View>

                <View style={tw`p-5 mt-4 ${controller.theme.card} rounded-3xl shadow-sm`}>
                    <Text style={tw`mb-4 text-lg font-black ${controller.theme.text}`}>Doctor details</Text>
                    <View style={tw`gap-4`}>
                        <Field label="Clinic / Library Name" labelClass={controller.theme.muted}>
                            <TextInput
                                value={controller.profile.businessName}
                                onChangeText={(value) => setProfileField("businessName", value)}
                                placeholderTextColor={placeholderColor}
                                style={themedInputStyle}
                            />
                        </Field>
                        <Field label="Owner Name" labelClass={controller.theme.muted}>
                            <TextInput
                                value={controller.profile.ownerName}
                                onChangeText={(value) => setProfileField("ownerName", value)}
                                placeholderTextColor={placeholderColor}
                                style={themedInputStyle}
                            />
                        </Field>
                        <Field label="Phone" labelClass={controller.theme.muted}>
                            <TextInput
                                value={controller.profile.phone}
                                onChangeText={(value) => setProfileField("phone", value)}
                                placeholderTextColor={placeholderColor}
                                style={themedInputStyle}
                                keyboardType="phone-pad"
                            />
                        </Field>
                        <Field label="Email" labelClass={controller.theme.muted}>
                            <TextInput
                                value={controller.profile.email}
                                onChangeText={(value) => setProfileField("email", value)}
                                placeholderTextColor={placeholderColor}
                                style={themedInputStyle}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </Field>
                        <Field label="Place" labelClass={controller.theme.muted}>
                            <TextInput
                                value={controller.profile.place}
                                onChangeText={(value) => setProfileField("place", value)}
                                placeholderTextColor={placeholderColor}
                                style={themedInputStyle}
                            />
                        </Field>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

function InfoPill({ controller, icon: Icon, label, value }) {
    return (
        <View style={tw`flex-1 items-center px-2 py-4 rounded-3xl ${controller.theme.cardAlt}`}>
            <Icon size={18} color={controller.theme.accentColor} />
            <Text style={tw`mt-2 text-xl font-black ${controller.theme.text}`}>{value}</Text>
            <Text style={tw`text-[10px] font-black uppercase ${controller.theme.muted}`}>{label}</Text>
        </View>
    );
}
