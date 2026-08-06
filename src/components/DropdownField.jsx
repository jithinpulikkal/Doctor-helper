import { ChevronDown } from "lucide-react-native";
import { useState } from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import tw from "twrnc";

export default function DropdownField({ allowEmpty = false, onChange, options, placeholder = "Select", value, variant = "light" }) {
  const [open, setOpen] = useState(false);
  const modalOptions = allowEmpty ? ["", ...options] : options;
  const dark = variant === "dark";
  const palette = dark
    ? {
        modal: "bg-[#232323] border-[#3a3a3a]",
        header: "bg-[#303030] border-[#3a3a3a]",
        row: "bg-[#232323] border-[#3a3a3a]",
        selectedRow: "bg-[#3a3a3a] border-[#474747]",
        title: "text-[#f4f1ea]",
        text: "text-[#f4f1ea]",
        selectedText: "text-[#f4f1ea]"
      }
    : {
        modal: "bg-white border-[#dde2ea]",
        header: "bg-[#20252d] border-[#20252d]",
        row: "bg-white border-[#edf0f4]",
        selectedRow: "bg-[#fff2ef] border-[#edf0f4]",
        title: "text-white",
        text: "text-[#20252d]",
        selectedText: "text-[#f26d5b]"
      };

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        style={tw`min-h-13 px-4 flex-row items-center border rounded-2xl ${
          dark ? "bg-[#303030] border-[#474747]" : "bg-white border-[#dde2ea]"
        }`}
      >
        <Text style={tw`flex-1 text-base ${
          value ? (dark ? "text-white" : "text-[#20252d]") : "text-[#9aa2ad]"
        }`}>
          {value || placeholder}
        </Text>
        <ChevronDown size={20} color={dark ? "#f4f1ea" : "#20252d"} />
      </Pressable>

      <Modal transparent visible={open} animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable onPress={() => setOpen(false)} style={tw`flex-1 justify-end bg-black/55`}>
          <Pressable style={tw`max-h-96 mx-5 mb-7 overflow-hidden rounded-3xl border ${palette.modal}`}>
            <View style={tw`px-5 py-5 border-b ${palette.header}`}>
              <Text style={tw`text-lg font-black ${palette.title}`}>{placeholder}</Text>
            </View>
            <ScrollView>
              {modalOptions.map((option) => {
                const label = option || placeholder;
                const selected = option === value;
                return (
                  <Pressable
                    key={label}
                    onPress={() => {
                      onChange(option);
                      setOpen(false);
                    }}
                    style={tw`px-5 py-4 border-b ${selected ? palette.selectedRow : palette.row}`}
                  >
                    <Text style={tw`text-base ${selected ? `font-black ${palette.selectedText}` : palette.text}`}>
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
