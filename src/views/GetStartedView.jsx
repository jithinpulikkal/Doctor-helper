import { ArrowRight, BarChart3, FileSpreadsheet, LogIn, Pill } from "lucide-react-native";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import tw from "twrnc";

const slides = [
  {
    icon: Pill,
    title: "Medicine Library",
    text: "Store medicine names, types, alternates, uses, dosage, warnings, and notes."
  },
  {
    icon: BarChart3,
    title: "Doctor Dashboard",
    text: "Review medicines, availability, saved names, and medicine types visually."
  },
  {
    icon: FileSpreadsheet,
    title: "Clinical Backup",
    text: "Export the local medicine library and share backups when needed."
  }
];

export default function GetStartedView({ controller }) {
  const [page, setPage] = useState(0);
  const slide = slides[page];
  const Icon = slide.icon;
  const isLastPage = page === slides.length - 1;

  return (
    <View style={tw`flex-1 ${controller.theme.page}`}>
      <View style={tw`flex-1 justify-center px-5 py-8`}>
        <View style={tw`overflow-hidden rounded-[36px] ${controller.theme.card} shadow-sm`}>
          <View style={tw`h-42 ${controller.theme.primary}`} />
          <View style={tw`px-5 pb-6 -mt-28`}>
            <View style={tw`flex-row justify-between items-start`}>
              {slides.map((item, index) => (
                <MiniSlide
                  active={index === page}
                  controller={controller}
                  key={item.title}
                  onPress={() => setPage(index)}
                  slide={item}
                  style={index === 1 ? "mt-0" : "mt-12"}
                />
              ))}
            </View>

            <View style={tw`mt-6 p-5 rounded-3xl ${controller.theme.cardAlt}`}>
              <View style={tw`w-13 h-13 items-center justify-center rounded-2xl ${controller.theme.accentBg}`}>
                <Icon size={26} color={controller.theme.accentColor} />
              </View>
              <Text style={tw`mt-4 text-3xl font-black ${controller.theme.text}`}>{slide.title}</Text>
              <Text style={tw`mt-3 leading-6 ${controller.theme.muted}`}>{slide.text}</Text>

              <View style={tw`flex-row items-center justify-center gap-2 mt-5`}>
                {slides.map((item, index) => (
                  <View
                    key={item.title}
                    style={tw`h-2 rounded-full ${index === page ? `w-7 ${controller.theme.primary}` : "w-2 bg-[#c8d0df]"}`}
                  />
                ))}
              </View>
            </View>
          </View>
        </View>

        <Pressable
          onPress={() => {
            if (isLastPage) {
              controller.setScreen("login");
              return;
            }
            setPage((current) => Math.min(current + 1, slides.length - 1));
          }}
          style={tw`h-15 mt-5 flex-row items-center justify-center rounded-full ${controller.theme.primary}`}
        >
          <Text style={tw`mr-2 text-base font-black ${controller.theme.primaryText}`}>{isLastPage ? "Login" : "Next"}</Text>
          {isLastPage ? (
            <LogIn size={20} color={controller.themeMode === "dark" ? "#171717" : "#ffffff"} />
          ) : (
            <ArrowRight size={20} color={controller.themeMode === "dark" ? "#171717" : "#ffffff"} />
          )}
        </Pressable>
      </View>
    </View>
  );
}

function MiniSlide({ active, controller, onPress, slide, style }) {
  const Icon = slide.icon;

  return (
    <Pressable
      onPress={onPress}
      style={tw`w-[31%] ${style} p-3 items-center rounded-3xl shadow-sm ${
        active ? controller.theme.card : controller.theme.cardAlt
      }`}
    >
      <View style={tw`w-12 h-12 items-center justify-center rounded-2xl ${controller.theme.accentBg}`}>
        <Icon size={22} color={controller.theme.accentColor} />
      </View>
      <Text numberOfLines={2} style={tw`mt-3 text-center text-xs font-black ${controller.theme.text}`}>
        {slide.title}
      </Text>
      <Text numberOfLines={3} style={tw`mt-2 text-center text-[9px] leading-3 ${controller.theme.muted}`}>
        {slide.text}
      </Text>
    </Pressable>
  );
}
