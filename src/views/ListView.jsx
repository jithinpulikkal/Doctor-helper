import {
    ArrowUpRight,
    ChevronDown,
    ChevronUp,
    ClipboardList,
    Edit3,
    Layers3,
    MapPin,
    Pill,
    Phone,
    Plus,
    Search,
    SlidersHorizontal,
    Trash2,
    UserRound,
} from "lucide-react-native";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import tw from "twrnc";
import DatePickerField from "../components/DatePickerField";
import DropdownField from "../components/DropdownField";
import Field from "../components/Field";
import Header from "../components/Header";

export default function ListView({ controller }) {
    const [filtersOpen, setFiltersOpen] = useState(false);
    const listTabs = [
        { key: "entries", label: "Medicines" },
        // Names tab hidden for now. Keep the medicine-name library code below because it may be needed again.
        // { key: "customers", label: "Names" },
        // Stock tab hidden for now. Keep the status list code below because it may be needed again.
        // { key: "statuses", label: "Stock" },
        { key: "types", label: "Types" },
    ];
    const activeFilters = [controller.filter.date, controller.filter.customer, controller.filter.type, controller.filter.status].filter(Boolean).length;

    return (
        <View style={tw`flex-1 ${controller.theme.page}`}>
            <Header controller={controller} title="Medicines" />
            <ScrollView contentContainerStyle={tw`px-5 pb-24`}>
                <View
                    style={tw`flex-row gap-2 mb-4 p-1 ${controller.theme.card} rounded-full border ${controller.theme.border}`}
                >
                    {listTabs.map((tab) => (
                        <Pressable
                            key={tab.key}
                            onPress={() => controller.setListMode(tab.key)}
                            style={tw`flex-1 py-3 rounded-full ${controller.listMode === tab.key ? controller.theme.primary : ""}`}
                        >
                            <Text
                                style={tw`text-center text-[11px] font-black ${controller.listMode === tab.key ? controller.theme.primaryText : controller.theme.muted}`}
                            >
                                {tab.label}
                            </Text>
                        </Pressable>
                    ))}
                </View>

                {controller.listMode !== "entries" ? (
                    <SimpleList controller={controller} />
                ) : (
                    <>
                        <View
                            style={tw`p-5 mb-4 ${controller.theme.card} rounded-[32px] shadow-sm border ${controller.theme.border}`}
                        >
                            <View style={tw`flex-row items-center`}>
                                <View
                                    style={tw`w-14 h-14 items-center justify-center rounded-2xl ${controller.theme.cardAlt}`}
                                >
                                    <Pill size={24} color={controller.theme.accentColor} />
                                </View>
                                <View style={tw`ml-4 flex-1`}>
                                    <Text style={tw`text-3xl font-black ${controller.theme.text}`}>
                                        {controller.visibleEntries.length}
                                    </Text>
                                    <Text style={tw`text-sm font-bold ${controller.theme.muted}`}>
                                        Medicine List
                                    </Text>
                                </View>
                                <AddListButton controller={controller} onPress={controller.openEntryCreate} />
                            </View>
                        </View>

                        <View
                            style={tw`p-4 mb-4 ${controller.theme.card} rounded-3xl shadow-sm border ${controller.theme.border}`}
                        >
                            <Pressable onPress={() => setFiltersOpen((open) => !open)} style={tw`flex-row items-center`}>
                                <SlidersHorizontal
                                    size={18}
                                    color={controller.themeMode === "dark" ? "#f4f1ea" : "#20252d"}
                                />
                                <Text style={tw`ml-2 flex-1 font-black ${controller.theme.text}`}>Filter and sort</Text>
                                {activeFilters ? (
                                    <>
                                        <View style={tw`mr-2 px-3 py-1 rounded-full ${controller.theme.accentBg}`}>
                                            <Text style={tw`text-xs font-black ${controller.theme.accentText}`}>
                                                {activeFilters}
                                            </Text>
                                        </View>
                                        <Pressable
                                            onPress={() => controller.setFilter({ date: "", customer: "", type: "", status: "" })}
                                            style={tw`mr-3 px-3 py-1.5 rounded-full ${controller.theme.cardAlt}`}
                                        >
                                            <Text style={tw`text-[10px] font-black ${controller.theme.muted}`}>Clear</Text>
                                        </Pressable>
                                    </>
                                ) : null}
                                {filtersOpen ? (
                                    <ChevronUp size={20} color={controller.themeMode === "dark" ? "#f4f1ea" : "#20252d"} />
                                ) : (
                                    <ChevronDown
                                        size={20}
                                        color={controller.themeMode === "dark" ? "#f4f1ea" : "#20252d"}
                                    />
                                )}
                            </Pressable>

                            {filtersOpen ? (
                                <>
                                    <View style={tw`gap-3 mt-4`}>
                                        <Field label="Date" labelClass={controller.theme.muted}>
                                            <DatePickerField
                                                value={controller.filter.date}
                                                onChange={(date) => controller.setFilter({ ...controller.filter, date })}
                                                variant={controller.themeMode}
                                            />
                                        </Field>
                                        <Field label="Medicine" labelClass={controller.theme.muted}>
                                            <DropdownField
                                                placeholder="All medicines"
                                                value={controller.filter.customer}
                                                options={controller.customers.map((customer) => customer.name)}
                                                onChange={(customer) =>
                                                    controller.setFilter({ ...controller.filter, customer })
                                                }
                                                allowEmpty
                                                variant={controller.themeMode}
                                            />
                                        </Field>
                                        <Field label="Type" labelClass={controller.theme.muted}>
                                            <DropdownField
                                                placeholder="All types"
                                                value={controller.filter.type}
                                                options={controller.types}
                                                onChange={(type) => controller.setFilter({ ...controller.filter, type })}
                                                allowEmpty
                                                variant={controller.themeMode}
                                            />
                                        </Field>
                                        <Field label="Availability" labelClass={controller.theme.muted}>
                                            <DropdownField
                                                placeholder="All availability statuses"
                                                value={controller.filter.status}
                                                options={controller.statusOptions}
                                                onChange={(status) =>
                                                    controller.setFilter({ ...controller.filter, status })
                                                }
                                                allowEmpty
                                                variant={controller.themeMode}
                                            />
                                        </Field>
                                    </View>

                                    <View style={tw`flex-row gap-2 mt-4`}>
                                        {["date", "slno", "type"].map((item) => (
                                            <Pressable
                                                key={item}
                                                onPress={() => controller.setSortBy(item)}
                                                style={tw`flex-1 py-3 rounded-full ${
                                                    controller.sortBy === item
                                                        ? controller.theme.primary
                                                        : controller.theme.cardAlt
                                                }`}
                                            >
                                                <Text
                                                    style={tw`text-center text-xs font-black ${
                                                        controller.sortBy === item
                                                            ? controller.theme.primaryText
                                                            : controller.theme.muted
                                                    }`}
                                                >
                                                    {item.toUpperCase()}
                                                </Text>
                                            </Pressable>
                                        ))}
                                        <Pressable
                                            onPress={() =>
                                                controller.setSortDir(controller.sortDir === "asc" ? "desc" : "asc")
                                            }
                                            style={tw`px-4 py-3 rounded-full ${controller.theme.accentBg}`}
                                        >
                                            <Text style={tw`text-xs font-black ${controller.theme.accentText}`}>
                                                {controller.sortDir === "asc" ? "ASC" : "DESC"}
                                            </Text>
                                        </Pressable>
                                    </View>
                                </>
                            ) : null}
                        </View>

                        <View style={tw`flex-row items-center justify-between mb-3`}>
                            <View style={tw`flex-row items-center`}>
                                <Search size={18} color={controller.themeMode === "dark" ? "#f4f1ea" : "#20252d"} />
                                <Text style={tw`ml-2 text-lg font-black ${controller.theme.text}`}>Medicines</Text>
                            </View>
                        </View>

                        {controller.visibleEntries.length === 0 ? (
                            <View
                                style={tw`items-center p-8 ${controller.theme.card} rounded-3xl border border-dashed ${controller.theme.border}`}
                            >
                                <Text style={tw`text-center ${controller.theme.muted}`}>No medicines found.</Text>
                            </View>
                        ) : (
                            controller.visibleEntries.map((entry) => (
                                <EntryCard
                                    controller={controller}
                                    key={entry.id}
                                    entry={entry}
                                    onPress={() => {
                                        controller.setSelectedId(entry.id);
                                        controller.setScreen("detail");
                                    }}
                                />
                            ))
                        )}
                    </>
                )}
            </ScrollView>
        </View>
    );
}

function SimpleList({ controller }) {
    const [customerFiltersOpen, setCustomerFiltersOpen] = useState(false);
    const [customerFilter, setCustomerFilter] = useState({ name: "", location: "" });
    const [customerSortBy, setCustomerSortBy] = useState("name");
    const [customerSortDir, setCustomerSortDir] = useState("asc");
    const isCustomers = controller.listMode === "customers";
    const isStatuses = controller.listMode === "statuses";
    const customerNames = Array.from(new Set(controller.customers.map((customer) => customer.name).filter(Boolean)));
    const customerLocations = Array.from(new Set(controller.customers.map((customer) => customer.location).filter(Boolean)));
    const visibleCustomers = controller.customers
        .filter((customer) => {
            const matchesName = customerFilter.name ? customer.name === customerFilter.name : true;
            const matchesLocation = customerFilter.location ? customer.location === customerFilter.location : true;
            return matchesName && matchesLocation;
        })
        .sort((left, right) => {
            const leftValue = `${left[customerSortBy] || ""}`.toLowerCase();
            const rightValue = `${right[customerSortBy] || ""}`.toLowerCase();
            if (leftValue < rightValue) return customerSortDir === "asc" ? -1 : 1;
            if (leftValue > rightValue) return customerSortDir === "asc" ? 1 : -1;
            return 0;
        });
    const items = isCustomers ? visibleCustomers : isStatuses ? controller.customStatuses : controller.types;
    const emptyText = isCustomers ? "No medicine names saved." : isStatuses ? "No availability statuses saved." : "No types saved.";
    const title = isCustomers ? "Medicine Name List" : isStatuses ? "Availability List" : "Type List";
    const Icon = isCustomers ? UserRound : isStatuses ? ClipboardList : Layers3;
    const addAction = isCustomers
        ? controller.openCustomerCreate
        : isStatuses
            ? controller.openStatusCreate
            : controller.openTypeCreate;
    const activeCustomerFilters = [customerFilter.name, customerFilter.location].filter(Boolean).length;

    return (
        <>
            <View style={tw`p-5 mb-4 ${controller.theme.card} rounded-[32px] shadow-sm border ${controller.theme.border}`}>
                <View style={tw`flex-row items-center`}>
                    <View style={tw`w-14 h-14 items-center justify-center rounded-2xl ${controller.theme.cardAlt}`}>
                        <Icon size={24} color={controller.theme.accentColor} />
                    </View>
                    <View style={tw`ml-4 flex-1`}>
                        <Text style={tw`text-3xl font-black ${controller.theme.text}`}>{items.length}</Text>
                        <Text style={tw`text-sm font-bold ${controller.theme.muted}`}>{title}</Text>
                    </View>
                    <AddListButton controller={controller} onPress={addAction} />
                </View>
            </View>

            {isCustomers ? (
                <View style={tw`p-4 mb-4 ${controller.theme.card} rounded-3xl shadow-sm border ${controller.theme.border}`}>
                    <Pressable onPress={() => setCustomerFiltersOpen((open) => !open)} style={tw`flex-row items-center`}>
                        <SlidersHorizontal
                            size={18}
                            color={controller.themeMode === "dark" ? "#f4f1ea" : "#20252d"}
                        />
                        <Text style={tw`ml-2 flex-1 font-black ${controller.theme.text}`}>Filter and sort</Text>
                        {activeCustomerFilters ? (
                            <>
                                <View style={tw`mr-2 px-3 py-1 rounded-full ${controller.theme.accentBg}`}>
                                    <Text style={tw`text-xs font-black ${controller.theme.accentText}`}>
                                        {activeCustomerFilters}
                                    </Text>
                                </View>
                                <Pressable
                                    onPress={() => setCustomerFilter({ name: "", location: "" })}
                                    style={tw`mr-3 px-3 py-1.5 rounded-full ${controller.theme.cardAlt}`}
                                >
                                    <Text style={tw`text-[10px] font-black ${controller.theme.muted}`}>Clear</Text>
                                </Pressable>
                            </>
                        ) : null}
                        {customerFiltersOpen ? (
                            <ChevronUp size={20} color={controller.themeMode === "dark" ? "#f4f1ea" : "#20252d"} />
                        ) : (
                            <ChevronDown size={20} color={controller.themeMode === "dark" ? "#f4f1ea" : "#20252d"} />
                        )}
                    </Pressable>

                    {customerFiltersOpen ? (
                        <>
                            <View style={tw`gap-3 mt-4`}>
                                <Field label="Medicine Name" labelClass={controller.theme.muted}>
                                    <DropdownField
                                        placeholder="All medicines"
                                        value={customerFilter.name}
                                        options={customerNames}
                                        onChange={(name) => setCustomerFilter((current) => ({ ...current, name }))}
                                        allowEmpty
                                        variant={controller.themeMode}
                                    />
                                </Field>
                                <Field label="Manufacturer / Brand" labelClass={controller.theme.muted}>
                                    <DropdownField
                                        placeholder="All manufacturers"
                                        value={customerFilter.location}
                                        options={customerLocations}
                                        onChange={(location) => setCustomerFilter((current) => ({ ...current, location }))}
                                        allowEmpty
                                        variant={controller.themeMode}
                                    />
                                </Field>
                            </View>

                            <View style={tw`flex-row gap-2 mt-4`}>
                                {["name", "location"].map((item) => (
                                    <Pressable
                                        key={item}
                                        onPress={() => setCustomerSortBy(item)}
                                        style={tw`flex-1 py-3 rounded-full ${
                                            customerSortBy === item ? controller.theme.primary : controller.theme.cardAlt
                                        }`}
                                    >
                                        <Text
                                            style={tw`text-center text-xs font-black ${
                                                customerSortBy === item
                                                    ? controller.theme.primaryText
                                                    : controller.theme.muted
                                            }`}
                                        >
                                            {item.toUpperCase()}
                                        </Text>
                                    </Pressable>
                                ))}
                                <Pressable
                                    onPress={() => setCustomerSortDir(customerSortDir === "asc" ? "desc" : "asc")}
                                    style={tw`px-4 py-3 rounded-full ${controller.theme.accentBg}`}
                                >
                                    <Text style={tw`text-xs font-black ${controller.theme.accentText}`}>
                                        {customerSortDir === "asc" ? "ASC" : "DESC"}
                                    </Text>
                                </Pressable>
                            </View>
                        </>
                    ) : null}
                </View>
            ) : null}

            {items.length === 0 ? (
                <View
                    style={tw`items-center p-8 ${controller.theme.card} rounded-3xl border border-dashed ${controller.theme.border}`}
                >
                    <Text style={tw`text-center ${controller.theme.muted}`}>{emptyText}</Text>
                </View>
            ) : (
                items.map((item, index) =>
                    isCustomers ? (
                        <CustomerCard controller={controller} customer={item} key={item.id} />
                    ) : isStatuses ? (
                        <StatusCard controller={controller} status={item} key={item.id} />
                    ) : (
                        <TypeCard controller={controller} key={`${item}-${index}`} typeName={item} />
                    ),
                )
            )}
        </>
    );
}

function AddListButton({ controller, onPress }) {
    return (
        <Pressable
            onPress={onPress}
            style={tw`w-11 h-11 items-center justify-center rounded-2xl ${controller.theme.primary}`}
        >
            <Plus size={21} color={controller.themeMode === "dark" ? "#171717" : "#ffffff"} />
        </Pressable>
    );
}

function CustomerCard({ controller, customer }) {
    return (
        <View style={tw`mb-3 p-4 ${controller.theme.card} border ${controller.theme.border} rounded-[28px] shadow-sm`}>
            <View style={tw`flex-row items-start`}>
                <View style={tw`w-12 h-12 items-center justify-center rounded-2xl ${controller.theme.cardAlt}`}>
                    <UserRound size={22} color={controller.theme.accentColor} />
                </View>
                <View style={tw`ml-3 flex-1`}>
                    <Text style={tw`text-lg font-black ${controller.theme.text}`}>{customer.name}</Text>
                    <Text numberOfLines={2} style={tw`mt-1 text-sm ${controller.theme.muted}`}>
                        {customer.details || "No details"}
                    </Text>
                    <View style={tw`mt-3 gap-1`}>
                        <Meta controller={controller} icon={Phone} value={customer.phone || "-"} />
                        <Meta controller={controller} icon={MapPin} value={customer.location || "-"} />
                    </View>
                </View>
            </View>
            <RowActions
                controller={controller}
                onDelete={() => controller.deleteCustomer(customer.id)}
                onEdit={() => controller.openCustomerEdit(customer)}
            />
        </View>
    );
}

function StatusCard({ controller, status }) {
    return (
        <View style={tw`mb-3 p-4 ${controller.theme.card} border ${controller.theme.border} rounded-[28px] shadow-sm`}>
            <View style={tw`flex-row items-center`}>
                <View style={tw`w-12 h-12 items-center justify-center rounded-2xl ${controller.theme.cardAlt}`}>
                    <ClipboardList size={22} color={controller.theme.accentColor} />
                </View>
                <View style={tw`ml-3 flex-1`}>
                    <Text style={tw`text-lg font-black ${controller.theme.text}`}>{status.name}</Text>
                    <Text style={tw`mt-1 text-sm ${controller.theme.muted}`}>Availability option</Text>
                </View>
            </View>
            <RowActions
                controller={controller}
                onDelete={() => controller.deleteCustomStatus(status.id)}
                onEdit={() => controller.openStatusEdit(status)}
            />
        </View>
    );
}

function TypeCard({ controller, typeName }) {
    return (
        <View style={tw`mb-3 p-4 ${controller.theme.card} border ${controller.theme.border} rounded-[28px] shadow-sm`}>
            <View style={tw`flex-row items-center`}>
                <View style={tw`w-12 h-12 items-center justify-center rounded-2xl ${controller.theme.cardAlt}`}>
                    <Layers3 size={22} color={controller.theme.accentColor} />
                </View>
                <View style={tw`ml-3 flex-1`}>
                    <Text style={tw`text-lg font-black ${controller.theme.text}`}>{typeName}</Text>
                    <Text style={tw`mt-1 text-sm ${controller.theme.muted}`}>Medicine type option</Text>
                </View>
            </View>
            <RowActions
                controller={controller}
                onDelete={() => controller.deleteType(typeName)}
                onEdit={() => controller.openTypeEdit(typeName)}
            />
        </View>
    );
}

function RowActions({ controller, onDelete, onEdit }) {
    return (
        <View style={tw`flex-row gap-2 mt-4`}>
            <Pressable
                onPress={onEdit}
                style={tw`flex-1 h-11 flex-row items-center justify-center rounded-2xl ${controller.theme.cardAlt}`}
            >
                <Edit3 size={16} color={controller.theme.accentColor} />
                <Text style={tw`ml-2 text-xs font-black ${controller.theme.text}`}>Edit</Text>
            </Pressable>
            <Pressable
                onPress={onDelete}
                style={tw`flex-1 h-11 flex-row items-center justify-center rounded-2xl ${controller.theme.cardAlt}`}
            >
                <Trash2 size={16} color="#e54960" />
                <Text style={tw`ml-2 text-xs font-black text-[#e54960]`}>Delete</Text>
            </Pressable>
        </View>
    );
}

function Meta({ controller, icon: Icon, value }) {
    return (
        <View style={tw`flex-row items-center`}>
            <Icon size={14} color={controller.theme.iconMuted} />
            <Text style={tw`ml-2 text-xs font-bold ${controller.theme.muted}`}>{value}</Text>
        </View>
    );
}

function EntryCard({ controller, entry, onPress }) {
    const dark = controller.themeMode === "dark";

    return (
        <View style={tw`mb-3 ${controller.theme.card} border ${controller.theme.border} rounded-[30px] shadow-sm`}>
            <View style={tw`p-4`}>
                <View style={tw`flex-row items-start gap-3`}>
                    <View style={tw`flex-1 pr-1`}>
                        <View style={tw`flex-row flex-wrap items-center`}>
                            <Text style={tw`text-[11px] font-black uppercase ${controller.theme.muted}`}>
                                SL {entry.slno}
                            </Text>
                            <View style={tw`w-1 h-1 mx-2 rounded-full ${controller.theme.cardAlt}`} />
                            <Text style={tw`text-[11px] font-bold ${controller.theme.muted}`}>{entry.date}</Text>
                        </View>

                        <Text style={tw`mt-2 text-lg font-black ${controller.theme.text}`}>{entry.name}</Text>
                        <Text numberOfLines={1} style={tw`mt-1 text-sm font-bold ${controller.theme.muted}`}>
                            {entry.alternates || entry.detail1 ? `Alternates: ${entry.alternates || entry.detail1}` : "No alternates saved"}
                        </Text>
                        <Text numberOfLines={1} style={tw`mt-1 text-sm font-bold ${controller.theme.muted}`}>
                            {entry.usedFor || entry.detail2 ? `Used for: ${entry.usedFor || entry.detail2}` : ""}
                        </Text>
                        <Text numberOfLines={1} style={tw`mt-1 text-sm font-bold ${controller.theme.muted}`}>
                            {entry.dosage || entry.detail3 ? `Dosage: ${entry.dosage || entry.detail3}` : ""}
                        </Text>
                        <Text numberOfLines={1} style={tw`mt-1 text-sm font-bold ${controller.theme.muted}`}>
                            {entry.type || "No type"}
                        </Text>
                        <Text numberOfLines={1} style={tw`mt-1 text-sm font-bold ${controller.theme.muted}`}>
                            {entry.status || "No availability"}
                        </Text>
                    </View>

                    <View style={tw`items-center`}>
                        <Pressable
                            onPress={onPress}
                            style={tw`w-9 h-9 items-center justify-center rounded-full ${controller.theme.cardAlt}`}
                        >
                            <ArrowUpRight size={16} color={dark ? "#f4f1ea" : "#20252d"} />
                        </Pressable>
                    </View>
                </View>

                <RowActions
                    controller={controller}
                    onDelete={() => controller.deleteEntry(entry.id)}
                    onEdit={() => controller.openEdit(entry)}
                />
            </View>
        </View>
    );
}
