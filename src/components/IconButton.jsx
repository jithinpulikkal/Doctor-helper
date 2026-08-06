import { Pressable, Text } from "react-native";
import tw from "twrnc";

export default function IconButton({ icon: Icon, label, onPress, dark = false }) {
  return (
    <Pressable
      onPress={onPress}
      style={tw`h-11 min-w-11 px-3 flex-row items-center justify-center rounded-full ${
        dark ? "bg-[#20252d]" : "bg-white"
      }`}
    >
      {Icon && <Icon size={18} color={dark ? "#ffffff" : "#20252d"} />}
      {label ? (
        <Text style={tw`ml-2 font-bold ${dark ? "text-white" : "text-[#20252d]"}`}>{label}</Text>
      ) : null}
    </Pressable>
  );
}
