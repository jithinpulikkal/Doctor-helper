import { Pill, Save, X } from "lucide-react-native";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import tw from "twrnc";
import AutocompleteField from "../components/AutocompleteField";
import Header from "../components/Header";

export default function FormView({ controller }) {
    const placeholderColor = controller.themeMode === "dark" ? "#777d90" : "#8d96a3";
    const inputStyle = tw`px-4 min-h-13 text-base border rounded-2xl ${controller.theme.input}`;
    const iconBg = controller.themeMode === "dark" ? "bg-[#303030]" : "bg-[#fff2ef]";
    const entryLabel = `Medicine ${controller.form.slno || controller.entries.length + 1}`;

    return (
        <View style={tw`flex-1 ${controller.theme.page}`}>
            <Header
                controller={controller}
                title={controller.form.name ? controller.form.name : "Medicine Entry"}
                showBack
            />
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={tw`flex-1`}>
                <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={tw`px-5 pb-24`}>
                    <View style={tw`items-center pt-3 pb-5`}>
                        <View style={tw`w-18 h-18 items-center justify-center rounded-3xl ${iconBg}`}>
                            <Pill size={34} color={controller.theme.accentColor} />
                        </View>
                        <Text style={tw`mt-3 text-xl font-black uppercase tracking-wide ${controller.theme.accentText}`}>
                            {entryLabel}
                        </Text>
                        <Text style={tw`m-4 text-md font-black ${controller.theme.text}`}>
                            {controller.editing ? "Edit Medicine" : ""}
                        </Text>
                        <Text style={tw`mt-1 text-center text-sm ${controller.theme.muted}`}>
                            Save medicine details, alternates, dosage, and clinical notes.
                        </Text>
                    </View>

                    <View style={tw`p-4 ${controller.theme.card} rounded-3xl border ${controller.theme.border}`}>
                        <View style={tw`gap-3`}>
                            <ThemedField controller={controller} label="Medicine Name">
                                <AutocompleteField
                                    placeholder="Type medicine name"
                                    value={controller.form.name}
                                    options={Array.from(new Set(controller.entries.map((entry) => entry.name).filter(Boolean)))}
                                    onChange={(value) => controller.setField("name", value)}
                                    onSelect={(value) => controller.setField("name", value)}
                                    variant={controller.themeMode}
                                />
                            </ThemedField>
                           
                            <ThemedField controller={controller} label="Manufacturer / Brand">
                                <TextInput
                                    value={controller.form.phone}
                                    onChangeText={(value) => controller.setField("phone", value)}
                                    placeholder="Company, brand, or strength"
                                    placeholderTextColor={placeholderColor}
                                    style={inputStyle}
                                />
                            </ThemedField>
                            <ThemedField controller={controller} label="Details">
                                <TextInput
                                    multiline
                                    value={controller.form.details}
                                    onChangeText={(value) => controller.setField("details", value)}
                                    placeholder="Composition, strengths, common brands, or remarks"
                                    placeholderTextColor={placeholderColor}
                                    style={[inputStyle, tw`min-h-28 py-4`]}
                                    textAlignVertical="top"
                                />
                            </ThemedField>
                            <ThemedField controller={controller} label="Category">
                                <AutocompleteField
                                    placeholder="Antibiotic, analgesic, antihistamine..."
                                    value={controller.form.location}
                                    options={controller.categories}
                                    onChange={(value) => controller.setField("location", value)}
                                    variant={controller.themeMode}
                                />
                            </ThemedField>
                            <ThemedField controller={controller} label="Alternates">
                                <TextInput
                                    multiline
                                    value={controller.form.alternates}
                                    onChangeText={(value) => controller.setField("alternates", value)}
                                    placeholder="Alternative brands or substitute medicines"
                                    placeholderTextColor={placeholderColor}
                                    style={[inputStyle, tw`min-h-24 py-4`]}
                                    textAlignVertical="top"
                                />
                            </ThemedField>
                            <ThemedField controller={controller} label="Used For">
                                <TextInput
                                    multiline
                                    value={controller.form.usedFor}
                                    onChangeText={(value) => controller.setField("usedFor", value)}
                                    placeholder="Condition, symptom, or indication"
                                    placeholderTextColor={placeholderColor}
                                    style={[inputStyle, tw`min-h-24 py-4`]}
                                    textAlignVertical="top"
                                />
                            </ThemedField>
                            <ThemedField controller={controller} label="Dosage">
                                <TextInput
                                    multiline
                                    value={controller.form.dosage}
                                    onChangeText={(value) => controller.setField("dosage", value)}
                                    placeholder="Dose, route, timing, and duration"
                                    placeholderTextColor={placeholderColor}
                                    style={[inputStyle, tw`min-h-24 py-4`]}
                                    textAlignVertical="top"
                                />
                            </ThemedField>
                            <ThemedField controller={controller} label="Type">
                                <AutocompleteField
                                    placeholder="Tablet, capsule, syrup, injection..."
                                    value={controller.form.type}
                                    options={controller.types}
                                    onChange={(value) => controller.setField("type", value)}
                                    variant={controller.themeMode}
                                />
                            </ThemedField>
                            <ThemedField controller={controller} label="Warnings / Contraindications">
                                <TextInput
                                    multiline
                                    value={controller.form.warnings}
                                    onChangeText={(value) => controller.setField("warnings", value)}
                                    placeholder="Allergy, pregnancy, interaction, renal/hepatic caution"
                                    placeholderTextColor={placeholderColor}
                                    style={[inputStyle, tw`min-h-24 py-4`]}
                                    textAlignVertical="top"
                                />
                            </ThemedField>
                            <ThemedField controller={controller} label="Notes">
                                <TextInput
                                    multiline
                                    value={controller.form.notes}
                                    onChangeText={(value) => controller.setField("notes", value)}
                                    placeholder="Add notes"
                                    placeholderTextColor={placeholderColor}
                                    style={[inputStyle, tw`min-h-28 py-4`]}
                                    textAlignVertical="top"
                                />
                            </ThemedField>
                        </View>
                    </View>

                    <View style={tw`mt-5 p-3 ${controller.theme.card} rounded-3xl border ${controller.theme.border}`}>
                        <Pressable
                            onPress={controller.saveEntry}
                            style={tw`h-14 flex-row items-center justify-center rounded-2xl ${controller.theme.primary}`}
                        >
                            <Save size={18} color={controller.themeMode === "dark" ? "#171717" : "#ffffff"} />
                            <Text style={tw`ml-2 font-black ${controller.theme.primaryText}`}>Save Medicine</Text>
                        </Pressable>
                        <Pressable
                            onPress={() => controller.setScreen(controller.selectedEntry ? "detail" : "list")}
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

function ThemedField({ children, controller, label }) {
    return (
        <View>
            <Text style={tw`mb-2 text-xs font-black uppercase tracking-wide ${controller.theme.muted}`}>{label}</Text>
            {children}
        </View>
    );
}
