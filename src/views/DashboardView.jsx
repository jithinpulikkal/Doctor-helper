import { ClipboardList, Layers3, ListPlus, Pill, UserRound } from "lucide-react-native";
import { Pressable, ScrollView, Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import tw from "twrnc";
import Header from "../components/Header";

export default function DashboardView({ controller }) {
    const totalRecords = controller.entries.length;
    const savedDataTotal =
        controller.entries.length +
        controller.customers.length +
        controller.customStatuses.length +
        controller.types.length;
    const openList = (mode) => {
        controller.setListMode(mode);
        controller.setScreen("list");
    };
    const graphItems = [
        {
            key: "entries",
            label: "Medicines",
            value: controller.entries.length,
            color: "#2563eb",
            icon: Pill,
            onPress: () => openList("entries"),
        },
        {
            key: "customers",
            label: "Names",
            value: controller.customers.length,
            color: "#16a34a",
            icon: UserRound,
            onPress: () => openList("customers"),
        },
        {
            key: "statuses",
            label: "Availability",
            value: controller.customStatuses.length,
            color: "#dc2626",
            icon: ListPlus,
            onPress: () => openList("statuses"),
        },
        {
            key: "types",
            label: "Types",
            value: controller.types.length,
            color: "#eab308",
            icon: Layers3,
            onPress: () => openList("types"),
        },
    ];

    return (
        <View style={tw`flex-1 ${controller.theme.page}`}>
            <Header controller={controller} title="Dashboard" />
            <ScrollView contentContainerStyle={tw`px-5`}>
                <View style={tw`p-5 ${controller.theme.card} rounded-[32px] shadow-sm border ${controller.theme.border}`}>
                    <View style={tw`flex-row items-start justify-between`}>
                        <View style={tw`flex-1 pr-4`}>
                            <Text style={tw`text-xs font-black uppercase tracking-wide ${controller.theme.accentText}`}>
                                Doctor Helper
                            </Text>
                            <Text style={tw`mt-2 text-4xl font-black ${controller.theme.text}`}>{totalRecords}</Text>
                            <Text style={tw`mt-1 text-sm font-bold ${controller.theme.muted}`}>saved medicine records</Text>
                        </View>
                        <View style={tw`w-16 h-16 items-center justify-center rounded-3xl ${controller.theme.cardAlt}`}>
                            <Layers3 size={28} color={controller.theme.accentColor} />
                        </View>
                    </View>

                    <View style={tw`flex-row gap-3 mt-5`}>
                        {/* <HeroMetric
                            controller={controller}
                            label="Entries"
                            value={controller.entries.length}
                            onPress={() => openList("entries")}
                        /> */}
                        <HeroMetric
                            controller={controller}
                            label="Medicine Names"
                            value={controller.customers.length}
                            onPress={() => openList("customers")}
                        />
                    </View>
                </View>

                <View
                    style={tw`mt-4 p-5 ${controller.theme.card} rounded-[32px] shadow-sm border ${controller.theme.border}`}
                >
                    <View style={tw`flex-row items-center justify-between`}>
                        <View>
                            <Text style={tw`text-lg font-black ${controller.theme.text}`}>Records</Text>
                        </View>
                        <View style={tw`px-3 py-2 rounded-full ${controller.theme.cardAlt}`}>
                            <Text style={tw`text-xs font-black ${controller.theme.text}`}>{savedDataTotal} total</Text>
                        </View>
                    </View>

                    <View style={tw`items-center mt-3`}>
                        <ProgressRing controller={controller} items={graphItems} total={savedDataTotal} />
                    </View>
                </View>

            </ScrollView>
        </View>
    );
}

function ProgressRing({ controller, items, total }) {
    const size = 168;
    const stroke = 13;
    const radius = (size - stroke) / 2;
    const circumference = 2 * Math.PI * radius;
    const trackColor = controller.themeMode === "dark" ? "#3a3a3a" : "#e8ecf2";
    const textColor = controller.themeMode === "dark" ? "#f4f1ea" : "#20252d";
    let accumulated = 0;

    return (
        <View style={tw`w-full items-center`}>
            <View style={tw`items-center justify-center`}>
                <Svg width={size} height={size}>
                    <Circle cx={size / 2} cy={size / 2} r={radius} stroke={trackColor} strokeWidth={stroke} fill="none" />
                    {items.map((item) => {
                        const segmentLength = total ? (item.value / total) * circumference : 0;
                        const gap = item.value && total ? 5 : 0;
                        const dashArray = `${Math.max(segmentLength - gap, 0)} ${circumference}`;
                        const dashOffset = -accumulated;
                        accumulated += segmentLength;

                        return (
                            <Circle
                                key={item.key}
                                cx={size / 2}
                                cy={size / 2}
                                r={radius}
                                stroke={item.color}
                                strokeWidth={stroke}
                                fill="none"
                                strokeLinecap="round"
                                strokeDasharray={dashArray}
                                strokeDashoffset={dashOffset}
                                rotation="-90"
                                origin={`${size / 2}, ${size / 2}`}
                            />
                        );
                    })}
                </Svg>
                <View style={tw`absolute items-center`}>
                    <Layers3 size={34} color={controller.theme.accentColor} />
                    <Text style={[tw`mt-2 text-xl font-black`, { color: textColor }]}>{total}</Text>
                </View>
            </View>

            <View style={tw`w-full flex-row flex-wrap gap-2 mt-4`}>
                {items.map((item) => {
                    const Icon = item.icon;

                    return (
                        <Pressable
                            key={item.key}
                            onPress={item.onPress}
                            style={tw`w-[48%] flex-row items-center rounded-2xl p-3 ${controller.theme.cardAlt}`}
                        >
                            <View style={tw`w-9 h-9 items-center justify-center rounded-2xl ${controller.theme.card}`}>
                                <Icon size={18} color={item.color} />
                            </View>
                            <View style={tw`ml-2 flex-1`}>
                                <Text style={tw`text-xs font-black ${controller.theme.text}`}>{item.label}</Text>
                                <Text style={tw`text-xs font-bold ${controller.theme.muted}`}>{item.value}</Text>
                            </View>
                        </Pressable>
                    );
                })}
            </View>
        </View>
    );
}

function HeroMetric({ controller, label, onPress, value }) {
    return (
        <Pressable onPress={onPress} style={tw`flex-1 p-3 rounded-2xl ${controller.theme.cardAlt}`}>
            <Text style={tw`self-start text-xs font-black ${controller.theme.muted}`}>{label}</Text>
            <Text style={tw`self-center mt-1 text-2xl font-black ${controller.theme.text}`}>{value}</Text>
        </Pressable>
    );
}

function DataRow({ controller, color, count, icon: Icon, label, onPress, percent }) {
    const Wrapper = onPress ? Pressable : View;

    return (
        <Wrapper onPress={onPress} style={tw`p-4 mb-3 ${controller.theme.cardAlt} rounded-3xl`}>
            <View style={tw`flex-row items-center`}>
                <View style={tw`w-12 h-12 items-center justify-center rounded-2xl ${controller.theme.card}`}>
                    <Icon size={20} color={color} />
                </View>
                <View style={tw`ml-3 flex-1`}>
                    <Text style={tw`font-black ${controller.theme.text}`}>{label}</Text>
                    <View
                        style={tw`h-2 mt-2 overflow-hidden rounded-full ${controller.themeMode === "dark" ? "bg-[#3a3a3a]" : "bg-[#eef0f4]"}`}
                    >
                        <View style={[tw`h-2 rounded-full`, { width: `${percent}%`, backgroundColor: color }]} />
                    </View>
                </View>
                <View style={tw`items-end ml-3`}>
                    <Text style={tw`text-xl font-black ${controller.theme.text}`}>{count}</Text>
                    <Text style={tw`text-xs font-bold ${controller.theme.muted}`}>{percent}%</Text>
                </View>
            </View>
        </Wrapper>
    );
}
