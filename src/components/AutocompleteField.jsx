import { Check, ChevronDown } from "lucide-react-native";
import { useMemo, useRef, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
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
  const inputRef = useRef(null);
  const blurTimerRef = useRef(null);
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

    return matches.slice(0, 30);
  }, [focused, normalizedValue, uniqueOptions]);
  const exactMatch = normalizedValue
    ? uniqueOptions.some((option) => option.toLowerCase() === normalizedValue)
    : false;
  const showOptions = focused && visibleOptions.length > 0;
  const showNotFound = focused && normalizedValue && visibleOptions.length === 0;
  const inputTheme = dark ? "bg-[#303030] border-[#474747] text-[#f4f1ea]" : "bg-white border-[#dde2ea] text-[#20252d]";
  const placeholderColor = dark ? "#777d90" : "#8d96a3";

  function selectOption(option) {
    if (blurTimerRef.current) {
      clearTimeout(blurTimerRef.current);
      blurTimerRef.current = null;
    }
    onSelect?.(option);
    onChange?.(option);
    setFocused(false);
    inputRef.current?.blur();
  }

  function openOptions() {
    if (blurTimerRef.current) {
      clearTimeout(blurTimerRef.current);
      blurTimerRef.current = null;
    }
    setFocused(true);
    inputRef.current?.focus();
  }

  function closeOptionsSoon() {
    blurTimerRef.current = setTimeout(() => {
      setFocused(false);
      blurTimerRef.current = null;
    }, 300);
  }

  return (
    <View>
      <Pressable
        onPress={openOptions}
        style={tw`min-h-13 px-4 flex-row items-center border ${showOptions || showNotFound ? "rounded-t-2xl rounded-b-none" : "rounded-2xl"} ${inputTheme}`}
      >
        <TextInput
          ref={inputRef}
          value={value}
          onChangeText={onChange}
          onFocus={openOptions}
          onBlur={closeOptionsSoon}
          placeholder={placeholder}
          placeholderTextColor={placeholderColor}
          style={tw`flex-1 min-h-13 text-base ${dark ? "text-[#f4f1ea]" : "text-[#20252d]"}`}
        />
        {exactMatch ? (
          <Check size={18} color={dark ? "#f4f1ea" : "#f26d5b"} />
        ) : (
          <ChevronDown size={18} color={dark ? "#f4f1ea" : "#20252d"} />
        )}
      </Pressable>

      {showOptions || showNotFound ? (
        <View style={tw`mt-1 max-h-64 overflow-hidden rounded-b-2xl border border-t-0 ${dark ? "bg-[#232323] border-[#3a3a3a]" : "bg-white border-[#dde2ea]"}`}>
          {showNotFound ? (
            <View style={tw`px-4 py-3`}>
              <Text style={tw`text-sm font-bold ${dark ? "text-[#777d90]" : "text-[#8d96a3]"}`}>Not found</Text>
            </View>
          ) : (
            <ScrollView nestedScrollEnabled keyboardShouldPersistTaps="always">
              {visibleOptions.map((option) => {
                const selected = option.toLowerCase() === normalizedValue;
                return (
                  <Pressable
                    key={option}
                    onPress={() => selectOption(option)}
                    style={tw`px-4 py-3 border-b ${dark ? "border-[#3a3a3a]" : "border-[#edf0f4]"} ${
                      selected ? (dark ? "bg-[#303030]" : "bg-[#e7e7e9]") : ""
                    }`}
                  >
                    <Text style={tw`text-sm ${selected ? "font-bold" : ""} ${dark ? "text-[#f4f1ea]" : "text-[#20252d]"}`}>
                      {option}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          )}
        </View>
      ) : null}
    </View>
  );
}
