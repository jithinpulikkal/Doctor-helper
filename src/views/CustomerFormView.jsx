import { Pill, Save, X } from "lucide-react-native";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import tw from "twrnc";
import Header from "../components/Header";

export default function CustomerFormView({ controller }) {
    const placeholderColor = controller.themeMode === "dark" ? "#777d90" : "#8d96a3";
    const inputStyle = tw`px-4 min-h-13 text-base border rounded-2xl ${controller.theme.input}`;
    const iconBg = controller.themeMode === "dark" ? "bg-[#303030]" : "bg-[#fff2ef]";
    const customerIndex = controller.customers.findIndex(
        (customer) => customer.name === controller.customerForm.name || customer.phone === controller.customerForm.phone
    );
    const customerLabel = `Medicine ${customerIndex >= 0 ? customerIndex + 1 : controller.customers.length + 1}`;

    return (
        <View style={tw`flex-1 ${controller.theme.page}`}>
            <Header controller={controller} title="Medicine Name" showBack />
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={tw`flex-1`}>
                <ScrollView contentContainerStyle={tw`px-5 pb-24`}>
                    <View style={tw`items-center pt-3 pb-5`}>
                        <View style={tw`w-18 h-18 items-center justify-center rounded-3xl ${iconBg}`}>
                            <Pill size={34} color={controller.theme.accentColor} />
                        </View>
                        <Text style={tw`mt-3 text-md font-black uppercase tracking-wide ${controller.theme.accentText}`}>
                            {customerLabel}
                        </Text>
                        <Text style={tw`m-4 text-2xl font-black ${controller.theme.text}`}>
                            {controller.customerForm.name ? controller.customerForm.name : ""}
                        </Text>
                        <Text style={tw`mt-1 text-center text-sm ${controller.theme.muted}`}>
                            Save medicine reference details for faster future entries.
                        </Text>
                    </View>

                    <View style={tw`p-4 ${controller.theme.card} border ${controller.theme.border} rounded-3xl`}>
                        <CustomerField controller={controller} label="Medicine Name">
                            <TextInput
                                value={controller.customerForm.name}
                                onChangeText={(value) => controller.setCustomerField("name", value)}
                                placeholder="Medicine name"
                                placeholderTextColor={placeholderColor}
                                style={inputStyle}
                            />
                        </CustomerField>
                        <CustomerField controller={controller} label="Details">
                            <TextInput
                                multiline
                                value={controller.customerForm.details}
                                onChangeText={(value) => controller.setCustomerField("details", value)}
                                placeholder="Composition, strengths, common brands, or remarks"
                                placeholderTextColor={placeholderColor}
                                style={[inputStyle, tw`min-h-28 py-4`]}
                                textAlignVertical="top"
                            />
                        </CustomerField>
                        <CustomerField controller={controller} label="Category">
                            <TextInput
                                value={controller.customerForm.location}
                                onChangeText={(value) => controller.setCustomerField("location", value)}
                                placeholder="Antibiotic, analgesic, antihistamine..."
                                placeholderTextColor={placeholderColor}
                                style={inputStyle}
                            />
                        </CustomerField>
                        <CustomerField controller={controller} label="Manufacturer / Brand">
                            <TextInput
                                value={controller.customerForm.phone}
                                onChangeText={(value) => controller.setCustomerField("phone", value)}
                                placeholder="Company, brand, or strength"
                                placeholderTextColor={placeholderColor}
                                style={inputStyle}
                            />
                        </CustomerField>
                    </View>

                    <View style={tw`mt-5 p-3 ${controller.theme.card} rounded-3xl border ${controller.theme.border}`}>
                        <Pressable
                            onPress={controller.saveCustomer}
                            style={tw`h-14 flex-row items-center justify-center rounded-2xl ${controller.theme.primary}`}
                        >
                            <Save size={18} color={controller.themeMode === "dark" ? "#171717" : "#ffffff"} />
                            <Text style={tw`ml-2 font-black ${controller.theme.primaryText}`}>Save Medicine</Text>
                        </Pressable>
                        <Pressable
                            onPress={() => controller.goBack("list")}
                            style={tw`h-12 mt-2 flex-row items-center justify-center rounded-2xl ${controller.theme.cardAlt}`}
                        >
                            <X size={17} color={controller.theme.iconMuted} />
                            <Text style={tw`ml-2 font-black ${controller.theme.muted}`}>Cancel</Text>
                        </Pressable>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

function CustomerField({ children, controller, label }) {
    return (
        <View style={tw`mb-4`}>
            <Text style={tw`mb-2 text-xs font-black uppercase tracking-wide ${controller.theme.muted}`}>{label}</Text>
            {children}
        </View>
    );
}
