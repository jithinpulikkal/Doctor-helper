import { AlertTriangle, CheckCircle2, HelpCircle, Info, Trash2, XCircle } from "lucide-react-native";
import { Modal, Pressable, Text, View } from "react-native";
import tw from "twrnc";

const icons = {
  confirm: HelpCircle,
  danger: Trash2,
  error: XCircle,
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle
};

export default function AppDialog({ dialog, onClose, theme }) {
  if (!dialog) {
    return null;
  }

  const Icon = icons[dialog.variant] || Info;
  const actions = dialog.actions?.length ? dialog.actions : [{ text: "OK", onPress: onClose }];
  const accent = dialog.variant === "danger" || dialog.variant === "error" ? "#ef4444" : theme.accentColor;

  function handleAction(action) {
    onClose();
    action.onPress?.();
  }

  return (
    <Modal transparent visible animationType="fade" onRequestClose={onClose}>
      <View style={tw`flex-1 justify-center px-5 bg-black/55`}>
        <View style={tw`p-5 rounded-3xl border ${theme.card} ${theme.border}`}>
          <View style={tw`flex-row items-start`}>
            <View style={tw`w-12 h-12 items-center justify-center rounded-2xl ${theme.cardAlt}`}>
              <Icon size={24} color={accent} />
            </View>
            <View style={tw`ml-4 flex-1`}>
              <Text style={tw`text-xl font-black ${theme.text}`}>{dialog.title}</Text>
              {dialog.message ? (
                <Text style={tw`mt-2 leading-6 ${theme.muted}`}>{dialog.message}</Text>
              ) : null}
            </View>
          </View>

          <View style={tw`mt-5 gap-2`}>
            {actions.map((action, index) => {
              const destructive = action.style === "destructive";
              const primary = action.style === "primary" || (actions.length === 1 && index === 0);
              const buttonClass = destructive
                ? "bg-[#ef4444]"
                : primary
                  ? theme.primary
                  : theme.cardAlt;
              const textClass = destructive
                ? "text-white"
                : primary
                  ? theme.primaryText
                  : theme.muted;

              return (
                <Pressable
                  key={`${action.text}-${index}`}
                  onPress={() => handleAction(action)}
                  style={tw`h-12 items-center justify-center rounded-2xl ${buttonClass}`}
                >
                  <Text style={tw`font-black ${textClass}`}>{action.text}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
}
