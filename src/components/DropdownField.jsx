import { ChevronDown, ChevronUp } from "lucide-react-native";
import { useState } from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import tw from "twrnc";

export default function DropdownField({ allowEmpty = false, onChange, options, placeholder = "Select", value, variant = "light" }) {
  const [open, setOpen] = useState(false);
  const dropdownOptions = allowEmpty ? ["", ...options] : options;
  const dark = variant === "dark";
  const palette = dark
    ? {
        menu: "bg-[#232323] border-[#3a3a3a]",
        field: "bg-[#303030] border-[#474747]",
        row: "border-[#3a3a3a]",
        selectedRow: "bg-[#303030]",
        text: "text-[#f4f1ea]",
        selectedText: "text-[#f4f1ea]",
        muted: "text-[#777d90]",
        icon: "#f4f1ea"
      }
    : {
        menu: "bg-white border-[#dde2ea]",
        field: "bg-white border-[#dde2ea]",
        row: "border-[#edf0f4]",
        selectedRow: "bg-[#e7e7e9]",
        text: "text-[#20252d]",
        selectedText: "text-[#20252d]",
        muted: "text-[#9aa2ad]",
        icon: "#20252d"
      };

  return (
    <>
      <Pressable
        onPress={() => setOpen((current) => !current)}
        style={tw`min-h-13 px-4 flex-row items-center border rounded-xl ${palette.field}`}
      >
        <Text style={tw`flex-1 text-base ${value ? palette.text : palette.muted}`}>
          {value || placeholder}
        </Text>
        {open ? <ChevronUp size={20} color={palette.icon} /> : <ChevronDown size={20} color={palette.icon} />}
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={tw`flex-1 justify-end bg-black/35`} onPress={() => setOpen(false)}>
          <Pressable style={tw`mx-4 mb-8 max-h-96 overflow-hidden rounded-2xl border shadow-lg ${palette.menu}`}>
            <ScrollView nestedScrollEnabled keyboardShouldPersistTaps="always">
              {dropdownOptions.length === 0 ? (
                <View style={tw`px-4 py-4`}>
                  <Text style={tw`text-base font-bold ${palette.muted}`}>Not found</Text>
                </View>
              ) : dropdownOptions.map((option, index) => {
                const label = option || placeholder;
                const selected = option === value;
                return (
                  <Pressable
                    key={`${label}-${index}`}
                    onPress={() => {
                      onChange(option);
                      setOpen(false);
                    }}
                    style={tw`px-4 py-4 border-b ${palette.row} ${selected ? palette.selectedRow : ""}`}
                  >
                    <Text style={tw`text-base ${selected ? `font-bold ${palette.selectedText}` : palette.text}`}>
                      {label}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}
