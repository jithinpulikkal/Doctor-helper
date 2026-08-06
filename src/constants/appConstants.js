export const STORAGE_KEYS = {
  entries: "customer_requirement_entries_v1",
  customStatuses: "customer_requirement_custom_statuses_v1",
  types: "customer_requirement_types_v1",
  categories: "customer_requirement_categories_v1",
  profile: "customer_requirement_profile_v1",
  loggedIn: "customer_requirement_logged_in_v1",
  theme: "customer_requirement_theme_v1"
};

export const APP_DETAILS = {
  name: "Doctor Helper",
  version: "1.0.0",
  storage: "On-device phone storage",
  backend: "Offline medicine library with optional web research"
};

export const themes = {
  light: {
    mode: "light",
    page: "bg-[#eef0f4]",
    card: "bg-white",
    cardAlt: "bg-[#f2f8f7]",
    text: "text-[#17252f]",
    muted: "text-[#64748b]",
    border: "border-[#dcebe8]",
    header: "bg-[#eef0f4]",
    bottom: "bg-[#12313a] border-[#24515b]",
    primary: "bg-[#0f766e]",
    primaryText: "text-white",
    accentText: "text-[#0e7490]",
    accentBg: "bg-[#e6f8f7]",
    accentColor: "#0e7490",
    iconMuted: "#6b8b95",
    input: "bg-white border-[#cfe3df] text-[#17252f]",
    inputMuted: "text-[#64748b]"
  },
  dark: {
    mode: "dark",
    page: "bg-[#071314]",
    card: "bg-[#102326]",
    cardAlt: "bg-[#183437]",
    text: "text-[#eefcf9]",
    muted: "text-[#9db8b7]",
    border: "border-[#24484a]",
    header: "bg-[#071314]",
    bottom: "bg-[#020809] border-[#24484a]",
    primary: "bg-[#5eead4]",
    primaryText: "text-[#071314]",
    accentText: "text-[#99f6e4]",
    accentBg: "bg-[#123f43]",
    accentColor: "#5eead4",
    iconMuted: "#7aa4a4",
    input: "bg-[#183437] border-[#31585b] text-[#eefcf9]",
    inputMuted: "text-[#9db8b7]"
  }
};



export const defaultTypes = ["Tablet", "Capsule", "Syrup", "Injection", "Drops", "Ointment", "Inhaler"];

export const defaultCategories = ["Antibiotic", "Analgesic", "Antihistamine", "Antacid", "Vitamin", "Antifungal"];

export const defaultProfile = {
  businessName: "Doctor Helper",
  ownerName: "",
  designation: "",
  phone: "",
  email: "",
  place: "",
  photoUri: ""
};

export const emptyForm = {
  date: "",
  slno: "",
  name: "",
  phone: "",
  details: "",
  location: "",
  detail1: "",
  detail2: "",
  detail3: "",
  alternates: "",
  usedFor: "",
  dosage: "",
  warnings: "",
  type: "",
  notes: "",
  status: ""
};

export const emptyStatusForm = {
  name: ""
};

export const emptyTypeForm = {
  name: ""
};

export const emptyCategoryForm = {
  name: ""
};
