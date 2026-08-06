import { CloudUpload, Download, FileSpreadsheet, FileText, Share } from "lucide-react-native";
import { Pressable, ScrollView, Text, View } from "react-native";
import tw from "twrnc";
import DatePickerField from "../components/DatePickerField";
import DropdownField from "../components/DropdownField";
import Field from "../components/Field";
import Header from "../components/Header";

export default function ExportView({ controller }) {
  const exportFilterCount = [
    controller.exportFilter.fromDate,
    controller.exportFilter.toDate,
    controller.exportFilter.medicine,
    controller.exportFilter.status,
    controller.exportFilter.type
  ].filter(Boolean).length;

  return (
    <View style={tw`flex-1 ${controller.theme.page}`}>
      <Header controller={controller} title="Export" />
      <ScrollView contentContainerStyle={tw`px-5 pb-24`}>
        <View style={tw`p-5 ${controller.theme.card} rounded-[32px] border ${controller.theme.border} shadow-sm`}>
          <View style={tw`w-16 h-16 items-center justify-center rounded-3xl ${controller.theme.cardAlt}`}>
            <Share size={28} color={controller.theme.accentColor} />
          </View>
          <Text style={tw`mt-5 text-3xl font-black ${controller.theme.text}`}>Backup and reports</Text>
          <Text style={tw`mt-2 leading-6 ${controller.theme.muted}`}>
            Export your local medicine records as Excel sheets or PDF reports, then share or upload them to Google Drive.
          </Text>
        </View>

        <View style={tw`p-5 mt-4 ${controller.theme.card} rounded-[32px] border ${controller.theme.border} shadow-sm`}>
          <View style={tw`flex-row items-center justify-between`}>
            <View>
              <Text style={tw`text-lg font-black ${controller.theme.text}`}>Export conditions</Text>
              <Text style={tw`mt-1 text-sm font-bold ${controller.theme.muted}`}>
                {controller.exportEntriesList.length} matching medicines
              </Text>
            </View>
            <View style={tw`px-3 py-2 rounded-full ${controller.theme.cardAlt}`}>
              <Text style={tw`text-xs font-black ${controller.theme.text}`}>{exportFilterCount} filters</Text>
            </View>
          </View>

          <View style={tw`gap-3 mt-5`}>
            <Field label="From Date" labelClass={controller.theme.muted}>
              <DatePickerField
                value={controller.exportFilter.fromDate}
                onChange={(fromDate) => controller.setExportFilter({ ...controller.exportFilter, fromDate })}
                variant={controller.themeMode}
              />
            </Field>
            <Field label="To Date" labelClass={controller.theme.muted}>
              <DatePickerField
                value={controller.exportFilter.toDate}
                onChange={(toDate) => controller.setExportFilter({ ...controller.exportFilter, toDate })}
                variant={controller.themeMode}
              />
            </Field>
            <Field label="Medicine" labelClass={controller.theme.muted}>
              <DropdownField
                placeholder="All medicines"
                value={controller.exportFilter.medicine}
                options={Array.from(new Set(controller.entries.map((entry) => entry.name).filter(Boolean)))}
                onChange={(medicine) => controller.setExportFilter({ ...controller.exportFilter, medicine })}
                allowEmpty
                variant={controller.themeMode}
              />
            </Field>
            <Field label="Availability" labelClass={controller.theme.muted}>
              <DropdownField
                placeholder="All availability statuses"
                value={controller.exportFilter.status}
                options={controller.statusOptions}
                onChange={(status) => controller.setExportFilter({ ...controller.exportFilter, status })}
                allowEmpty
                variant={controller.themeMode}
              />
            </Field>
            <Field label="Type" labelClass={controller.theme.muted}>
              <DropdownField
                placeholder="All types"
                value={controller.exportFilter.type}
                options={controller.types}
                onChange={(type) => controller.setExportFilter({ ...controller.exportFilter, type })}
                allowEmpty
                variant={controller.themeMode}
              />
            </Field>
          </View>

          <Pressable
            onPress={() => controller.setExportFilter({ fromDate: "", toDate: "", medicine: "", status: "", type: "" })}
            style={tw`h-12 mt-4 items-center justify-center rounded-2xl ${controller.theme.cardAlt}`}
          >
            <Text style={tw`text-sm font-black ${controller.theme.muted}`}>Clear Conditions</Text>
          </Pressable>
        </View>

         <View style={tw`p-5 mt-4 ${controller.theme.cardAlt} rounded-3xl`}>
          <Text style={tw`text-lg font-black ${controller.theme.text}`}>Export summary</Text>
          <View style={tw`flex-row gap-3 mt-4`}>
            <SummaryPill controller={controller} label="Matched" value={controller.exportEntriesList.length} />
            <SummaryPill controller={controller} label="Medicines" value={new Set(controller.exportEntriesList.map((entry) => entry.name).filter(Boolean)).size} />
            <SummaryPill controller={controller} label="Types" value={new Set(controller.exportEntriesList.map((entry) => entry.type).filter(Boolean)).size} />
          </View>
        </View>

        <View style={tw`mt-4 gap-3`}>
          <ExportCard
            controller={controller}
            description="Create a spreadsheet from the medicine records matching the selected conditions."
            icon={FileSpreadsheet}
            loading={controller.exporting}
            onPress={controller.exportEntries}
            title="Export Excel Sheet"
          />
          <ExportCard
            controller={controller}
            description="Create a printable report from the medicine records matching the selected conditions."
            icon={FileText}
            loading={controller.exportingPdf}
            onPress={controller.exportPdfReport}
            title="Export PDF Report"
          />
          <ExportCard
            controller={controller}
            description="Share the filtered Excel file and choose Google Drive."
            icon={CloudUpload}
            loading={controller.exporting}
            onPress={controller.uploadToGoogleDrive}
            title="Upload to Google Drive"
            accent
          />
        </View>

       
      </ScrollView>
    </View>
  );
}

function ExportCard({ accent = false, controller, description, icon: Icon, loading, onPress, title }) {
  return (
    <Pressable
      onPress={onPress}
      style={tw`p-5 ${controller.theme.card} rounded-3xl border ${controller.theme.border} shadow-sm`}
    >
      <View style={tw`flex-row items-start`}>
        <View style={tw`w-13 h-13 items-center justify-center rounded-2xl ${accent ? controller.theme.accentBg : controller.theme.cardAlt}`}>
          <Icon size={23} color={controller.theme.accentColor} />
        </View>
        <View style={tw`ml-4 flex-1`}>
          <Text style={tw`text-lg font-black ${controller.theme.text}`}>{loading ? "Preparing..." : title}</Text>
          <Text style={tw`mt-1 leading-5 ${controller.theme.muted}`}>{description}</Text>
        </View>
        <Download size={19} color={controller.themeMode === "dark" ? "#f4f1ea" : "#20252d"} />
      </View>
    </Pressable>
  );
}

function SummaryPill({ controller, label, value }) {
  return (
    <View style={tw`flex-1 p-3 rounded-2xl ${controller.theme.card}`}>
      <Text style={tw`text-xs font-black ${controller.theme.muted}`}>{label}</Text>
      <Text style={tw`mt-1 text-2xl font-black ${controller.theme.text}`}>{value}</Text>
    </View>
  );
}
