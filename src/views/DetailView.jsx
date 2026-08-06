import { Edit3, FlaskConical, Globe2, Layers3, Pill, Tag, Trash2 } from "lucide-react-native";
import { Pressable, ScrollView, Text, View } from "react-native";
import tw from "twrnc";
import Header from "../components/Header";

export default function DetailView({ controller, entry }) {
    const dark = controller.themeMode === "dark";
    const manufacturer = `${entry.phone || ""}`.trim();

    return (
        <View style={tw`flex-1 ${controller.theme.page}`}>
            <Header controller={controller} title="Medicine Details" showBack />
            <ScrollView contentContainerStyle={tw`px-5 pb-32`}>
                <View
                    style={tw`overflow-hidden ${controller.theme.card} border ${controller.theme.border} rounded-[32px] shadow-sm`}
                >
                    <View style={tw`px-5 pt-5 pb-14 ${dark ? "bg-[#303030]" : "bg-[#20252d]"}`}>
                        <View style={tw`flex-row items-center justify-between`}>
                            <Text
                                style={tw`text-[11px] font-black uppercase tracking-wide ${dark ? "text-[#f4f1ea]" : "text-white"}`}
                            >
                                SL {entry.slno} - {entry.date}
                            </Text>
                            <View
                                style={tw`flex-row items-center px-3 py-2 rounded-full ${dark ? "bg-[#232323]" : "bg-white/20"}`}
                            >
                                <View style={tw`w-2.5 h-2.5 mr-2 rounded-full ${dark ? "bg-[#f4f1ea]" : "bg-white"}`} />
                                <Text style={tw`text-xs font-black ${dark ? "text-[#f4f1ea]" : "text-white"}`}>
                                    {entry.status || "No availability"}
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View style={tw`items-center px-5 pb-6 -mt-10`}>
                        <View
                            style={tw`w-20 h-20 items-center justify-center rounded-full ${controller.theme.primary} border-6 ${controller.theme.card}`}
                        >
                            <Pill size={34} color={dark ? "#ffffff" : "#171717"} />
                        </View>
                        <Text style={tw`mt-3 text-3xl font-black text-center ${controller.theme.text}`}>
                            {entry.name || "Medicine"}
                        </Text>
                        <Text style={tw`mt-1 text-sm font-bold text-center ${controller.theme.muted}`}>
                            {/* {entry.type || "No type"} {entry.detail1 ? `- ${entry.detail1}` : ""} */}
                            {entry.type || "No type"}
                        </Text>

                        <View style={tw`w-full flex-row gap-3 mt-5`}>
                            <ActionButton
                                controller={controller}
                                icon={Globe2}
                                label="Search"
                                onPress={() => controller.openMedicineResearch(entry)}
                                primary
                            />
                            <ActionButton
                                controller={controller}
                                icon={Edit3}
                                label="Edit"
                                onPress={() => controller.openEdit(entry)}
                            />
                            <ActionButton
                                controller={controller}
                                icon={Trash2}
                                label="Delete"
                                onPress={() => controller.deleteEntry(entry.id)}
                                danger
                            />
                        </View>
                    </View>
                </View>

                <View
                    style={tw`mt-4 p-5 ${controller.theme.card} border ${controller.theme.border} rounded-[28px] shadow-sm`}
                >
                    <Text style={tw`text-lg font-black ${controller.theme.text}`}>Medicine information</Text>
                    <View style={tw`mt-3`}>
                        <InfoRow controller={controller} icon={Layers3} label="Category" value={entry.location || "-"} />
                        <InfoRow
                            controller={controller}
                            icon={FlaskConical}
                            label="Manufacturer / Brand"
                            value={manufacturer || "-"}
                        />

                        <InfoRow controller={controller} icon={Tag} label="Type" value={entry.type || "-"} last />
                    </View>
                </View>

                <View
                    style={tw`mt-4 p-5 ${controller.theme.card} border ${controller.theme.border} rounded-[28px] shadow-sm`}
                >
                    <Text style={tw`text-lg font-black ${controller.theme.text}`}>Clinical details</Text>
                    <DetailBlock controller={controller} label="Details" value={entry.details} />
                    <DetailBlock controller={controller} label="Used For" value={entry.usedFor || entry.detail2} />
                    <DetailBlock controller={controller} label="Dosage" value={entry.dosage || entry.detail3} />
                    <DetailBlock controller={controller} label="Warnings / Contraindications" value={entry.warnings} />
                    <DetailBlock controller={controller} label="Alternates" value={entry.alternates || entry.detail1} />
                    <DetailBlock controller={controller} label="Notes" value={entry.notes} last />
                </View>
            </ScrollView>
        </View>
    );
}

function ActionButton({ controller, danger = false, icon: Icon, label, onPress, primary = false }) {
    const dark = controller.themeMode === "dark";
    const color = primary ? (dark ? "#171717" : "#ffffff") : danger ? "#e54960" : controller.theme.accentColor;
    const bg = primary ? controller.theme.primary : controller.theme.cardAlt;

    return (
        <Pressable onPress={onPress} style={tw`flex-1 h-14 items-center justify-center rounded-2xl ${bg}`}>
            <Icon size={19} color={color} />
            <Text
                style={tw`mt-1 text-[11px] font-black ${primary ? controller.theme.primaryText : danger ? "text-[#e54960]" : controller.theme.text}`}
            >
                {label}
            </Text>
        </Pressable>
    );
}

function InfoRow({ controller, icon: Icon, label, last = false, value }) {
    return (
        <View style={tw`flex-row items-center py-4 ${last ? "" : `border-b ${controller.theme.border}`}`}>
            <View style={tw`w-11 h-11 items-center justify-center rounded-2xl ${controller.theme.cardAlt}`}>
                <Icon size={18} color={controller.theme.accentColor} />
            </View>
            <View style={tw`ml-3 flex-1`}>
                <Text style={tw`text-xs font-black uppercase ${controller.theme.muted}`}>{label}</Text>
                <Text style={tw`mt-1 text-base font-bold ${controller.theme.text}`}>{value}</Text>
            </View>
        </View>
    );
}

function DetailBlock({ controller, label, last = false, value }) {
    return (
        <View style={tw`py-4 ${last ? "" : `border-b ${controller.theme.border}`}`}>
            <Text style={tw`text-xs font-black uppercase ${controller.theme.muted}`}>{label}</Text>
            <Text style={tw`mt-2 text-base leading-6 ${controller.theme.text}`}>{value || "-"}</Text>
        </View>
    );
}
