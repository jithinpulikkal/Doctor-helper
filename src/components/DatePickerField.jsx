import { CalendarDays, ChevronLeft, ChevronRight, X } from "lucide-react-native";
import { useMemo, useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import tw from "twrnc";

const toDate = (value) => {
  if (!value) return new Date();
  const parsed = new Date(`${value}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
};

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const monthTitle = (date) =>
  date.toLocaleDateString("en", { month: "long", year: "numeric" });

const weekDays = ["S", "M", "T", "W", "T", "F", "S"];

export default function DatePickerField({ onChange, placeholder = "YYYY-MM-DD", value, variant = "light" }) {
  const [showPicker, setShowPicker] = useState(false);
  const [visibleMonth, setVisibleMonth] = useState(() => {
    const date = toDate(value);
    return new Date(date.getFullYear(), date.getMonth(), 1);
  });
  const selectedDate = toDate(value);
  const dark = variant === "dark";
  const palette = dark
    ? {
        card: "bg-[#232323]",
        cardAlt: "bg-[#303030]",
        text: "text-[#f4f1ea]",
        muted: "text-[#a9a49b]",
        border: "border-[#3a3a3a]",
        input: "bg-[#303030] border-[#474747]",
        accent: "bg-[#f4f1ea]",
        accentText: "text-[#f4f1ea]"
      }
    : {
        card: "bg-white",
        cardAlt: "bg-[#f6f7f9]",
        text: "text-[#20252d]",
        muted: "text-[#7b8491]",
        border: "border-[#dde2ea]",
        input: "bg-white border-[#dde2ea]",
        accent: "bg-[#20252d]",
        accentText: "text-[#20252d]"
      };

  const days = useMemo(() => {
    const year = visibleMonth.getFullYear();
    const month = visibleMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells = Array.from({ length: firstDay }, () => null);
    for (let day = 1; day <= daysInMonth; day += 1) {
      cells.push(new Date(year, month, day));
    }
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }, [visibleMonth]);

  function moveMonth(amount) {
    setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() + amount, 1));
  }

  function selectDate(date) {
    onChange(formatDate(date));
    setShowPicker(false);
  }

  return (
    <>
      <Pressable
        onPress={() => setShowPicker(true)}
        style={tw`min-h-13 px-4 flex-row items-center border rounded-2xl ${palette.input}`}
      >
        <Text style={tw`flex-1 text-base ${value ? palette.text : palette.muted}`}>
          {value || placeholder}
        </Text>
        {value ? (
          <Pressable
            onPress={(event) => {
              event.stopPropagation();
              onChange("");
            }}
            style={tw`w-8 h-8 items-center justify-center rounded-full ${palette.cardAlt}`}
          >
            <X size={16} color={dark ? "#f4f1ea" : "#20252d"} />
          </Pressable>
        ) : (
          <CalendarDays size={20} color={dark ? "#f4f1ea" : "#20252d"} />
        )}
      </Pressable>

      <Modal transparent visible={showPicker} animationType="fade" onRequestClose={() => setShowPicker(false)}>
        <Pressable onPress={() => setShowPicker(false)} style={tw`flex-1 justify-end bg-black/50`}>
          <Pressable style={tw`mx-5 mb-7 overflow-hidden rounded-3xl ${palette.card}`}>
            <View style={tw`px-5 py-4 ${palette.cardAlt}`}>
              <Text style={tw`text-lg font-black ${palette.text}`}>Select Date</Text>
              <Text style={tw`mt-1 text-sm ${palette.muted}`}>{value || placeholder}</Text>
            </View>

            <View style={tw`px-5 py-4`}>
              <View style={tw`flex-row items-center justify-between mb-4`}>
                <Pressable onPress={() => moveMonth(-1)} style={tw`w-10 h-10 items-center justify-center rounded-full ${palette.cardAlt}`}>
                  <ChevronLeft size={20} color={dark ? "#f4f1ea" : "#20252d"} />
                </Pressable>
                <Text style={tw`text-base font-black ${palette.text}`}>{monthTitle(visibleMonth)}</Text>
                <Pressable onPress={() => moveMonth(1)} style={tw`w-10 h-10 items-center justify-center rounded-full ${palette.cardAlt}`}>
                  <ChevronRight size={20} color={dark ? "#f4f1ea" : "#20252d"} />
                </Pressable>
              </View>

              <View style={tw`flex-row mb-2`}>
                {weekDays.map((day, index) => (
                  <Text key={`${day}-${index}`} style={tw`flex-1 text-center text-xs font-black ${palette.muted}`}>
                    {day}
                  </Text>
                ))}
              </View>

              <View style={tw`flex-row flex-wrap`}>
                {days.map((date, index) => {
                  const selected = date && formatDate(date) === formatDate(selectedDate) && value;
                  const today = date && formatDate(date) === formatDate(new Date());
                  return (
                    <View key={date ? formatDate(date) : `blank-${index}`} style={tw`w-[14.28%] p-1`}>
                      {date ? (
                        <Pressable
                          onPress={() => selectDate(date)}
                          style={tw`h-10 items-center justify-center rounded-full ${
                            selected ? palette.accent : today ? palette.cardAlt : ""
                          }`}
                        >
                          <Text style={tw`font-bold ${selected ? (dark ? "text-[#171717]" : "text-white") : palette.text}`}>
                            {date.getDate()}
                          </Text>
                        </Pressable>
                      ) : (
                        <View style={tw`h-10`} />
                      )}
                    </View>
                  );
                })}
              </View>
            </View>

            <View style={tw`flex-row border-t ${palette.border}`}>
              <Pressable onPress={() => setShowPicker(false)} style={tw`flex-1 items-center py-4`}>
                <Text style={tw`font-black ${palette.muted}`}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  onChange(formatDate(new Date()));
                  setVisibleMonth(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
                  setShowPicker(false);
                }}
                style={tw`flex-1 items-center py-4 ${palette.cardAlt}`}
              >
                <Text style={tw`font-black ${palette.accentText}`}>Today</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}
