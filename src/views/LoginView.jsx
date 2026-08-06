import { ArrowLeft, LogIn, ShieldCheck } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import tw from "twrnc";

export default function LoginView({ controller }) {
  const [loginForm, setLoginForm] = useState({
    ownerName: controller.profile.ownerName || "",
    businessName: controller.profile.businessName || "",
    phone: controller.profile.phone || "",
    email: controller.profile.email || ""
  });
  const inputStyle = tw`px-4 min-h-13 text-base border rounded-2xl ${controller.theme.input}`;
  const placeholderColor = controller.themeMode === "dark" ? "#94a3b8" : "#7b8491";

  useEffect(() => {
    setLoginForm((current) => ({
      ownerName: current.ownerName || controller.profile.ownerName || "",
      businessName: current.businessName || controller.profile.businessName || "",
      phone: current.phone || controller.profile.phone || "",
      email: current.email || controller.profile.email || ""
    }));
  }, [controller.profile]);

  function setField(field, value) {
    setLoginForm((current) => ({ ...current, [field]: value }));
  }

  function submitLogin() {
    if (!loginForm.ownerName.trim() || !loginForm.businessName.trim()) {
      controller.showDialog("Missing details", "Doctor name and clinic name are required.", "warning");
      return;
    }
    controller.login(loginForm);
  }

  return (
    <View style={tw`flex-1 ${controller.theme.page}`}>
      <ScrollView contentContainerStyle={tw`px-5 pt-10 flex-grow justify-center`}>
        <Pressable
          onPress={() => controller.setScreen("start")}
          style={tw`w-12 h-12 mb-5 items-center justify-center rounded-full ${controller.theme.card}`}
        >
          <ArrowLeft size={20} color={controller.themeMode === "dark" ? "#f8fafc" : "#20252d"} />
        </Pressable>

        <View style={tw`p-5 rounded-3xl ${controller.theme.card} shadow-sm`}>
          <View style={tw`w-16 h-16 items-center justify-center rounded-3xl ${controller.theme.accentBg}`}>
            <ShieldCheck size={30} color={controller.theme.accentColor} />
          </View>
          <Text style={tw`mt-5 text-3xl font-black ${controller.theme.text}`}>Login</Text>
          <Text style={tw`mt-2 leading-6 ${controller.theme.muted}`}>
            Enter your doctor or clinic details. These are saved locally and shown on your profile page.
          </Text>

          <View style={tw`gap-3 mt-5`}>
            <LoginField label="Name" controller={controller}>
              <TextInput
                value={loginForm.ownerName}
                onChangeText={(value) => setField("ownerName", value)}
                placeholder="Your name"
                placeholderTextColor={placeholderColor}
                style={inputStyle}
              />
            </LoginField>
            <LoginField label="Clinic / Library Name" controller={controller}>
              <TextInput
                value={loginForm.businessName}
                onChangeText={(value) => setField("businessName", value)}
                placeholder="Clinic or medicine library name"
                placeholderTextColor={placeholderColor}
                style={inputStyle}
              />
            </LoginField>
            <LoginField label="Phone Number" controller={controller}>
              <TextInput
                value={loginForm.phone}
                onChangeText={(value) => setField("phone", value)}
                placeholder="Phone number"
                placeholderTextColor={placeholderColor}
                style={inputStyle}
                keyboardType="phone-pad"
              />
            </LoginField>
            <LoginField label="Email" controller={controller}>
              <TextInput
                value={loginForm.email}
                onChangeText={(value) => setField("email", value)}
                placeholder="Email address"
                placeholderTextColor={placeholderColor}
                style={inputStyle}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </LoginField>
          </View>

          <Pressable
            onPress={submitLogin}
            style={tw`h-15 mt-5 flex-row items-center justify-center rounded-full ${controller.theme.primary}`}
          >
            <LogIn size={20} color={controller.themeMode === "dark" ? "#171717" : "#ffffff"} />
            <Text style={tw`ml-2 text-base font-black ${controller.theme.primaryText}`}>Login</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

function LoginField({ children, controller, label }) {
  return (
    <View>
      <Text style={tw`mb-2 text-xs font-black uppercase tracking-wide ${controller.theme.muted}`}>{label}</Text>
      {children}
    </View>
  );
}
