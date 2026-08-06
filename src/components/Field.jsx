import { Text, View } from "react-native";
import tw from "twrnc";

export default function Field({ children, label, labelClass = "text-[#4d5663]" }) {
  return (
    <View>
      <Text style={tw`mb-2 text-sm font-bold ${labelClass}`}>{label}</Text>
      {children}
    </View>
  );
}
