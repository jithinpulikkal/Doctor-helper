import { BackHandler, StatusBar, View } from "react-native";
import { useEffect } from "react";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import tw from "twrnc";
import AppDialog from "./src/components/AppDialog";
import BottomBar from "./src/components/BottomBar";
import { useCustomerController } from "./src/controllers/useCustomerController";
import CustomerFormView from "./src/views/CustomerFormView";
import DetailView from "./src/views/DetailView";
import ExportView from "./src/views/ExportView";
import FormView from "./src/views/FormView";
import GetStartedView from "./src/views/GetStartedView";
import ListView from "./src/views/ListView";
import MedicineResearchView from "./src/views/MedicineResearchView";
import LoginView from "./src/views/LoginView";
import NewEntryView from "./src/views/NewEntryView";
import ProfileView from "./src/views/ProfileView";
import SettingsView from "./src/views/SettingsView";
import StatusFormView from "./src/views/StatusFormView";
import DashboardView from "./src/views/DashboardView";
import TypeFormView from "./src/views/TypeFormView";

export default function App() {
  return (
    <SafeAreaProvider>
      <AppShell />
    </SafeAreaProvider>
  );
}

function AppShell() {
  const controller = useCustomerController();
  const insets = useSafeAreaInsets();
  const mainScreens = ["dashboard", "list", "profile", "settings", "export"];

  useEffect(() => {
    const subscription = BackHandler.addEventListener("hardwareBackPress", () => {
      if (controller.screen === "dashboard") {
        controller.showDialog("Exit app", "Do you want to close the app?", "confirm", [
          { text: "Cancel" },
          { text: "Exit", style: "destructive", onPress: () => BackHandler.exitApp() }
        ]);
        return true;
      }

      if (["list", "profile", "export", "settings"].includes(controller.screen)) {
        controller.setScreen("dashboard");
        return true;
      }

      if (["detail", "form", "login", "newEntry", "customerForm", "statusForm", "typeForm", "research"].includes(controller.screen)) {
        controller.goBack(controller.loggedIn ? "dashboard" : "start");
        return true;
      }

      if (controller.screen === "start") {
        controller.showDialog("Exit app", "Do you want to close the app?", "confirm", [
          { text: "Cancel" },
          { text: "Exit", style: "destructive", onPress: () => BackHandler.exitApp() }
        ]);
        return true;
      }

      return false;
    });

    return () => subscription.remove();
  }, [controller]);

  return (
    <View style={tw`flex-1 ${controller.theme.page}`}>
      <StatusBar
        backgroundColor={controller.themeMode === "dark" ? "#171717" : "#eef0f4"}
        barStyle={controller.themeMode === "dark" ? "light-content" : "dark-content"}
      />
      <View style={[tw`flex-1`, { paddingTop: insets.top }]}>
        {controller.screen === "start" && <GetStartedView controller={controller} />}
        {controller.screen === "login" && <LoginView controller={controller} />}
        {controller.screen === "list" && <ListView controller={controller} />}
        {controller.screen === "export" && <ExportView controller={controller} />}
        {controller.screen === "newEntry" && <NewEntryView controller={controller} />}
        {controller.screen === "form" && <FormView controller={controller} />}
        {controller.screen === "customerForm" && <CustomerFormView controller={controller} />}
        {controller.screen === "statusForm" && <StatusFormView controller={controller} />}
        {controller.screen === "typeForm" && <TypeFormView controller={controller} />}
        {controller.screen === "detail" && controller.selectedEntry && (
          <DetailView controller={controller} entry={controller.selectedEntry} />
        )}
        {controller.screen === "research" && controller.selectedEntry && (
          <MedicineResearchView controller={controller} entry={controller.selectedEntry} />
        )}
        {controller.screen === "profile" && <ProfileView controller={controller} />}
        {controller.screen === "dashboard" && <DashboardView controller={controller} />}
        {controller.screen === "settings" && <SettingsView controller={controller} />}
        {mainScreens.includes(controller.screen) ? <BottomBar controller={controller} bottomInset={insets.bottom} /> : null}
      </View>
      <AppDialog
        dialog={controller.dialog}
        onClose={controller.closeDialog}
        theme={controller.theme}
      />
    </View>
  );
}
