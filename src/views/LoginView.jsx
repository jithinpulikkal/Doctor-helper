import { LogIn, ShieldCheck } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import tw from "twrnc";

export default function LoginView({ controller }) {
  const [loginForm, setLoginForm] = useState({
    username: controller.activeUsername || controller.profile.username || "",
    ownerName: controller.profile.ownerName || "",
    phone: controller.profile.phone || "",
    email: controller.profile.email || ""
  });
  const inputStyle = tw`px-4 min-h-13 text-base border rounded-2xl ${controller.theme.input}`;
  const placeholderColor = controller.themeMode === "dark" ? "#94a3b8" : "#7b8491";

  useEffect(() => {
    setLoginForm((current) => ({
      username: current.username || controller.activeUsername || controller.profile.username || "",
      ownerName: current.ownerName || controller.profile.ownerName || "",
      phone: current.phone || controller.profile.phone || "",
      email: current.email || controller.profile.email || ""
    }));
  }, [controller.profile]);

  function setField(field, value) {
    setLoginForm((current) => ({ ...current, [field]: value }));
  }

  function submitLogin() {
    if (!loginForm.username.trim() || !loginForm.ownerName.trim()) {
      controller.showDialog("Missing details", "Username and name are required.", "warning");
      return;
    }
    controller.login(loginForm);
  }

  return (
    <View style={tw`flex-1 ${controller.theme.page}`}>
      <ScrollView contentContainerStyle={tw`px-5 py-8 flex-grow justify-center`}>
        <View style={tw`p-5 rounded-3xl ${controller.theme.card} shadow-sm`}>
          <View style={tw`w-16 h-16 items-center justify-center rounded-3xl ${controller.theme.accentBg}`}>
            <ShieldCheck size={30} color={controller.theme.accentColor} />
          </View>
          <Text style={tw`mt-5 text-3xl font-black ${controller.theme.text}`}>Login</Text>
          <Text style={tw`mt-2 leading-6 ${controller.theme.muted}`}>
            Data is saved separately for each username.
          </Text>

          <View style={tw`gap-3 mt-3`}>
            <LoginField label="Username" controller={controller}>
              <TextInput
                value={loginForm.username}
                onChangeText={(value) => setField("username", value)}
                placeholder="Choose or enter username"
                placeholderTextColor={placeholderColor}
                style={inputStyle}
                autoCapitalize="none"
              />
            </LoginField>
            <LoginField label="Name" controller={controller}>
              <TextInput
                value={loginForm.ownerName}
                onChangeText={(value) => setField("ownerName", value)}
                placeholder="Your name"
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
        </View>

        <Pressable
          onPress={submitLogin}
          style={tw`h-15 mt-5 flex-row items-center justify-center rounded-full ${controller.theme.primary}`}
        >
          <Text style={tw`mr-2 text-base font-black ${controller.theme.primaryText}`}>Login</Text>
          <LogIn size={20} color={controller.themeMode === "dark" ? "#171717" : "#ffffff"} />
        </Pressable>
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
