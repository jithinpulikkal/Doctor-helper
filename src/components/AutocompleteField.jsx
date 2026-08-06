import { Check, ChevronDown } from "lucide-react-native";
import { useMemo, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import tw from "twrnc";

export default function AutocompleteField({
  onChange,
  onSelect,
  options = [],
  placeholder = "Type or select",
  value,
  variant = "light"
}) {
  const [focused, setFocused] = useState(false);
  const dark = variant === "dark";
  const normalizedValue = `${value || ""}`.trim().toLowerCase();
  const uniqueOptions = useMemo(
    () => Array.from(new Set(options.map((option) => `${option || ""}`.trim()).filter(Boolean))),
    [options]
  );
  const visibleOptions = useMemo(() => {
    if (!focused) {
      return [];
    }

    const matches = normalizedValue
      ? uniqueOptions.filter((option) => option.toLowerCase().includes(normalizedValue))
      : uniqueOptions;

    return matches.slice(0, 6);
  }, [focused, normalizedValue, uniqueOptions]);
  const exactMatch = normalizedValue
    ? uniqueOptions.some((option) => option.toLowerCase() === normalizedValue)
    : false;
  const inputTheme = dark ? "bg-[#303030] border-[#474747] text-[#f4f1ea]" : "bg-white border-[#dde2ea] text-[#20252d]";
  const placeholderColor = dark ? "#777d90" : "#8d96a3";

  function selectOption(option) {
    onSelect?.(option);
    onChange?.(option);
    setFocused(false);
  }

  return (
    <View>
      <View style={tw`min-h-13 px-4 flex-row items-center border rounded-2xl ${inputTheme}`}>
        <TextInput
          value={value}
          onChangeText={onChange}
          onFocus={() => setFocused(true)}
          placeholder={placeholder}
          placeholderTextColor={placeholderColor}
          style={tw`flex-1 min-h-13 text-base ${dark ? "text-[#f4f1ea]" : "text-[#20252d]"}`}
        />
        {exactMatch ? (
          <Check size={18} color={dark ? "#f4f1ea" : "#f26d5b"} />
        ) : (
          <ChevronDown size={18} color={dark ? "#f4f1ea" : "#20252d"} />
        )}
      </View>

      {visibleOptions.length ? (
        <View style={tw`mt-2 overflow-hidden rounded-2xl border ${dark ? "bg-[#232323] border-[#3a3a3a]" : "bg-white border-[#edf0f4]"}`}>
          {visibleOptions.map((option) => {
            const selected = option.toLowerCase() === normalizedValue;
            return (
              <Pressable
                key={option}
                onPress={() => selectOption(option)}
                style={tw`px-4 py-3 border-b ${dark ? "border-[#3a3a3a]" : "border-[#edf0f4]"} ${
                  selected ? (dark ? "bg-[#3a3a3a]" : "bg-[#fff2ef]") : ""
                }`}
              >
                <Text style={tw`text-base ${selected ? "font-black" : ""} ${dark ? "text-[#f4f1ea]" : "text-[#20252d]"}`}>
                  {option}
                </Text>
              </Pressable>
            );
          })}
        </View>
      ) : null}
    </View>
  );
}
