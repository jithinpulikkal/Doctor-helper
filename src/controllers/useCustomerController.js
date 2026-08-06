import { useEffect, useMemo, useState } from "react";
import { Linking, Platform } from "react-native";
import { defaultProfile, emptyCategoryForm, emptyStatusForm, emptyTypeForm, themes } from "../constants/appConstants";
import { filterAndSortEntries, getNextSlno, makeForm, today } from "../models/medicineModel";
import {
  loadAppData,
  saveCategories,
  saveCustomStatuses,
  saveEntries,
  saveLoggedIn,
  saveProfile,
  saveThemeMode,
  saveTypes,
  shareExcelFile,
  sharePdfReport,
  uploadExcelToGoogleDrive
} from "../models/storageModel";

export function useCustomerController() {
  const [entries, setEntries] = useState([]);
  const [customStatuses, setCustomStatuses] = useState([]);
  const [types, setTypes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [profile, setProfile] = useState(defaultProfile);
  const [screen, setScreen] = useState("start");
  const [screenHistory, setScreenHistory] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedStatusId, setSelectedStatusId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editingStatusId, setEditingStatusId] = useState(null);
  const [editingTypeName, setEditingTypeName] = useState(null);
  const [editingCategoryName, setEditingCategoryName] = useState(null);
  const [form, setForm] = useState(makeForm());
  const [statusForm, setStatusForm] = useState(emptyStatusForm);
  const [typeForm, setTypeForm] = useState(emptyTypeForm);
  const [categoryForm, setCategoryForm] = useState(emptyCategoryForm);
  const [listMode, setListMode] = useState("entries");
  const [newType, setNewType] = useState("");
  const [filter, setFilter] = useState({ date: "", medicine: "", type: "", status: "" });
  const [exportFilter, setExportFilter] = useState({ fromDate: "", toDate: "", medicine: "", category: "", status: "", type: "" });
  const [sortBy, setSortBy] = useState("slno");
  const [sortDir, setSortDir] = useState("desc");
  const [exporting, setExporting] = useState(false);
  const [exportingPdf, setExportingPdf] = useState(false);
  const [themeMode, setThemeModeState] = useState("light");
  const [loggedIn, setLoggedIn] = useState(false);
  const [dialog, setDialog] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await loadAppData();
        setEntries(data.entries);
        setCustomStatuses(data.customStatuses);
        setTypes(data.types);
        setCategories(data.categories);
        setProfile(data.profile);
        setThemeModeState(data.themeMode);
        setLoggedIn(data.loggedIn);
        setScreen(data.loggedIn ? "dashboard" : "start");
      } catch {
        showDialog("Storage error", "Saved data could not be loaded.", "error");
      }
    }
    load();
  }, []);

  useEffect(() => {
    saveEntries(entries);
  }, [entries]);

  useEffect(() => {
    saveCustomStatuses(customStatuses);
  }, [customStatuses]);

  useEffect(() => {
    saveTypes(types);
  }, [types]);

  useEffect(() => {
    saveCategories(categories);
  }, [categories]);

  useEffect(() => {
    saveProfile(profile);
  }, [profile]);

  useEffect(() => {
    saveThemeMode(themeMode);
  }, [themeMode]);

  const selectedEntry = useMemo(
    () => entries.find((entry) => entry.id === selectedId),
    [entries, selectedId]
  );

  const selectedStatus = useMemo(
    () => customStatuses.find((status) => status.id === selectedStatusId),
    [customStatuses, selectedStatusId]
  );

  const visibleEntries = useMemo(
    () => filterAndSortEntries(entries, filter, sortBy, sortDir),
    [entries, filter, sortBy, sortDir]
  );

  const statusOptions = useMemo(
    () => Array.from(new Set(customStatuses.map((status) => status.name).filter(Boolean))),
    [customStatuses]
  );

  const stats = useMemo(
    () => {
      const byStatus = statusOptions.reduce((result, status) => {
        result[status] = entries.filter((entry) => entry.status === status).length;
        return result;
      }, {});

      return {
        total: entries.length,
        byStatus
      };
    },
    [entries, statusOptions]
  );

  const exportEntriesList = useMemo(
    () =>
      entries
        .filter((entry) => {
          const matchesFrom = exportFilter.fromDate ? entry.date >= exportFilter.fromDate : true;
          const matchesTo = exportFilter.toDate ? entry.date <= exportFilter.toDate : true;
          const matchesMedicine = exportFilter.medicine
            ? `${entry.name || ""}`.toLowerCase().includes(exportFilter.medicine.toLowerCase())
            : true;
          const matchesCategory = exportFilter.category
            ? `${entry.location || ""}`.toLowerCase().includes(exportFilter.category.toLowerCase())
            : true;
          const matchesStatus = exportFilter.status ? entry.status === exportFilter.status : true;
          const matchesType = exportFilter.type
            ? `${entry.type || ""}`.toLowerCase().includes(exportFilter.type.toLowerCase())
            : true;
          return matchesFrom && matchesTo && matchesMedicine && matchesCategory && matchesStatus && matchesType;
        })
        .sort((left, right) => {
          const leftSlno = Number(left.slno);
          const rightSlno = Number(right.slno);
          if (Number.isFinite(leftSlno) && Number.isFinite(rightSlno)) {
            return leftSlno - rightSlno;
          }
          return `${left.slno || ""}`.localeCompare(`${right.slno || ""}`);
        }),
    [entries, exportFilter]
  );

  const exportStats = useMemo(
    () => {
      const byStatus = statusOptions.reduce((result, status) => {
        result[status] = exportEntriesList.filter((entry) => entry.status === status).length;
        return result;
      }, {});

      return {
        total: exportEntriesList.length,
        byStatus
      };
    },
    [exportEntriesList, statusOptions]
  );

  function normalizeListMode(mode) {
    const normalized = `${mode || ""}`.trim().toLowerCase();
    const aliases = {
      "current entries": "entries",
      entry: "entries",
      entries: "entries",
      status: "statuses",
      statuses: "statuses",
      type: "types",
      types: "types",
      category: "categories",
      categories: "categories"
    };

    return aliases[normalized] || "entries";
  }

  function changeListMode(mode) {
    setListMode(normalizeListMode(mode));
  }

  function showDialog(title, message, variant = "info", actions = null) {
    setDialog({ title, message, variant, actions });
  }

  function closeDialog() {
    setDialog(null);
  }

  function setField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function setStatusField(field, value) {
    setStatusForm((current) => ({ ...current, [field]: value }));
  }

  function setTypeField(field, value) {
    setTypeForm((current) => ({ ...current, [field]: value }));
  }

  function setCategoryField(field, value) {
    setCategoryForm((current) => ({ ...current, [field]: value }));
  }

  function resetEntryForm() {
    setEditingId(null);
    setForm(makeForm());
    setNewType("");
  }

  function resetStatusForm() {
    setEditingStatusId(null);
    setStatusForm(emptyStatusForm);
  }

  function resetTypeForm() {
    setEditingTypeName(null);
    setTypeForm(emptyTypeForm);
  }

  function resetCategoryForm() {
    setEditingCategoryName(null);
    setCategoryForm(emptyCategoryForm);
  }

  function navigate(nextScreen) {
    setScreen((currentScreen) => {
      if (currentScreen && currentScreen !== nextScreen) {
        setScreenHistory((current) => [...current, currentScreen].slice(-30));
      }
      return nextScreen;
    });
  }

  function replaceScreen(nextScreen) {
    setScreenHistory([]);
    setScreen(nextScreen);
  }

  function goBack(fallbackScreen = "dashboard") {
    setScreenHistory((current) => {
      const previousScreen = current[current.length - 1];
      if (previousScreen) {
        setScreen(previousScreen);
        return current.slice(0, -1);
      }

      if (screen !== fallbackScreen) {
        setScreen(fallbackScreen);
      }
      return current;
    });
  }

  async function login(profileData = {}) {
    const nextProfile = { ...profile, ...profileData };
    setProfile(nextProfile);
    await saveProfile(nextProfile);
    setLoggedIn(true);
    await saveLoggedIn(true);
    replaceScreen("dashboard");
  }

  async function logout() {
    setLoggedIn(false);
    await saveLoggedIn(false);
    replaceScreen("start");
  }

  function openCreate() {
    navigate("newEntry");
  }

  function openEntryCreate() {
    setEditingId(null);
    setForm({ ...makeForm(), slno: getNextSlno(entries), status: "" });
    setNewType("");
    navigate("form");
  }

  function openStatusCreate() {
    setEditingStatusId(null);
    setStatusForm(emptyStatusForm);
    navigate("statusForm");
  }

  function openTypeCreate() {
    setEditingTypeName(null);
    setTypeForm(emptyTypeForm);
    navigate("typeForm");
  }

  function openCategoryCreate() {
    setEditingCategoryName(null);
    setCategoryForm(emptyCategoryForm);
    navigate("categoryForm");
  }

  function openEdit(entry) {
    setEditingId(entry.id);
    setForm(makeForm(entry));
    setNewType("");
    navigate("form");
  }

  function openStatusEdit(status) {
    setEditingStatusId(status.id);
    setStatusForm({ name: status.name || "" });
    navigate("statusForm");
  }

  function openTypeEdit(typeName) {
    setEditingTypeName(typeName);
    setTypeForm({ name: typeName || "" });
    navigate("typeForm");
  }

  function openCategoryEdit(categoryName) {
    setEditingCategoryName(categoryName);
    setCategoryForm({ name: categoryName || "" });
    navigate("categoryForm");
  }

  function buildMedicineSearchUrl(entry) {
    const query = encodeURIComponent(`${entry?.name || ""} ${entry?.type || ""} medicine uses dosage alternatives`);
    return `https://www.google.com/search?q=${query}`;
  }

  async function openMedicineResearch(entry) {
    if (!entry?.name) {
      showDialog("Medicine name needed", "Save the medicine name before searching the web.", "warning");
      return;
    }

    try {
      if (Platform.OS === "web" && typeof navigator !== "undefined" && !navigator.onLine) {
        throw new Error("Offline");
      }
      if (Platform.OS !== "web") {
        const response = await fetch("https://www.google.com/generate_204", { method: "GET" });
        if (!response.ok && response.status !== 204) {
          throw new Error("Offline");
        }
      }
    } catch {
      showDialog("Internet required", "Please connect to the internet to search medicine details on Google.", "warning");
      return;
    }

    navigate("research");
  }

  async function openResearchInBrowser(entry) {
    const url = buildMedicineSearchUrl(entry);
    const supported = await Linking.canOpenURL(url);
    if (!supported) {
      showDialog("Unable to open Google", "This device cannot open the research link.", "warning");
      return;
    }
    Linking.openURL(url);
  }

  function hasTextMatch(items, text, getValue = (item) => item) {
    const normalizedText = `${text || ""}`.trim().toLowerCase();
    return items.some((item) => `${getValue(item) || ""}`.trim().toLowerCase() === normalizedText);
  }

  function saveEntry() {
    const finalName = form.name.trim();
    const finalPhone = form.phone.trim();
    const finalDetails = form.details.trim();
    const finalLocation = form.location.trim();
    const finalType = form.type.trim();
    const finalStatus = form.status.trim();
    const finalDate = form.date || today();

    if (!finalName) {
      showDialog("Missing medicine", "Medicine name is required.", "warning");
      return;
    }

    if (!finalType) {
      showDialog("Missing type", "Select or enter the medicine type.", "warning");
      return;
    }

    if (!hasTextMatch(types, finalType)) {
      setTypes((current) => [finalType, ...current]);
    }

    if (finalLocation && !hasTextMatch(categories, finalLocation)) {
      setCategories((current) => [finalLocation, ...current]);
    }

    if (finalStatus && !hasTextMatch(customStatuses, finalStatus, (status) => status.name)) {
      setCustomStatuses((current) => [
        {
          id: `${Date.now()}-status`,
          name: finalStatus,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        ...current
      ]);
    }

    const payload = {
      ...form,
      date: finalDate,
      name: finalName,
      phone: finalPhone,
      details: finalDetails,
      location: finalLocation,
      detail1: form.alternates || form.detail1,
      detail2: form.usedFor || form.detail2,
      detail3: form.dosage || form.detail3,
      type: finalType,
      status: finalStatus,
      updatedAt: new Date().toISOString()
    };

    if (editingId) {
      setEntries((current) =>
        current.map((entry) => (entry.id === editingId ? { ...entry, ...payload } : entry))
      );
      setSelectedId(editingId);
      resetEntryForm();
      replaceScreen("detail");
      showDialog("Medicine updated", "The medicine details have been saved successfully.", "success");
      return;
    }

    const id = `${Date.now()}`;
    setEntries((current) => [
      {
        ...payload,
        id,
        createdAt: new Date().toISOString()
      },
      ...current
    ]);
    setSelectedId(id);
    resetEntryForm();
    replaceScreen("detail");
    showDialog("Medicine saved", "The medicine details have been saved successfully.", "success");
  }

  function saveCustomStatus() {
    const name = statusForm.name.trim();
    if (!name) {
      showDialog("Missing details", "Availability name is required.", "warning");
      return;
    }

    if (customStatuses.some((status) => status.id !== editingStatusId && `${status.name || ""}`.trim().toLowerCase() === name.toLowerCase())) {
      showDialog("Duplicate availability", "This availability name already exists.", "warning");
      return;
    }

    const payload = { name, updatedAt: new Date().toISOString() };
    if (editingStatusId) {
      const previousStatus = customStatuses.find((status) => status.id === editingStatusId);
      setCustomStatuses((current) =>
        current.map((status) => (status.id === editingStatusId ? { ...status, ...payload } : status))
      );
      if (previousStatus?.name) {
        setEntries((current) =>
          current.map((entry) =>
            entry.status === previousStatus.name
              ? { ...entry, status: name, updatedAt: new Date().toISOString() }
              : entry
          )
        );
      }
    } else {
      setCustomStatuses((current) => [{ ...payload, id: `${Date.now()}`, createdAt: new Date().toISOString() }, ...current]);
    }
    resetStatusForm();
    changeListMode("statuses");
    replaceScreen("list");
    showDialog(
      editingStatusId ? "Availability updated" : "Availability saved",
      "The availability option has been saved successfully.",
      "success"
    );
  }

  function saveType() {
    const name = typeForm.name.trim();
    if (!name) {
      showDialog("Missing details", "Type name is required.", "warning");
      return;
    }

    if (types.some((type) => type !== editingTypeName && `${type || ""}`.trim().toLowerCase() === name.toLowerCase())) {
      showDialog("Duplicate type", "This type name already exists.", "warning");
      return;
    }

    if (editingTypeName) {
      setTypes((current) => current.map((type) => (type === editingTypeName ? name : type)));
      setEntries((current) => current.map((entry) => (entry.type === editingTypeName ? { ...entry, type: name } : entry)));
    } else {
      setTypes((current) => [name, ...current]);
    }
    resetTypeForm();
    changeListMode("types");
    replaceScreen("list");
    showDialog(
      editingTypeName ? "Type updated" : "Type saved",
      "The type option has been saved successfully.",
      "success"
    );
  }

  function saveCategory() {
    const name = categoryForm.name.trim();
    if (!name) {
      showDialog("Missing details", "Category name is required.", "warning");
      return;
    }

    if (categories.some((category) => category !== editingCategoryName && `${category || ""}`.trim().toLowerCase() === name.toLowerCase())) {
      showDialog("Duplicate category", "This category name already exists.", "warning");
      return;
    }

    if (editingCategoryName) {
      setCategories((current) => current.map((category) => (category === editingCategoryName ? name : category)));
      setEntries((current) =>
        current.map((entry) =>
          entry.location === editingCategoryName ? { ...entry, location: name, updatedAt: new Date().toISOString() } : entry
        )
      );
    } else {
      setCategories((current) => [name, ...current]);
    }
    resetCategoryForm();
    changeListMode("categories");
    replaceScreen("list");
    showDialog(
      editingCategoryName ? "Category updated" : "Category saved",
      "The category option has been saved successfully.",
      "success"
    );
  }

  function confirmDelete(title, message, onConfirm) {
    showDialog(title, message, "danger", [
      { text: "Cancel" },
      { text: "Delete", style: "destructive", onPress: onConfirm }
    ]);
  }

  function deleteEntry(id) {
    confirmDelete("Delete medicine ?", "This medicine record will be removed permanently.", () => {
      setEntries((current) => current.filter((entry) => entry.id !== id));
      setSelectedId(null);
      changeListMode("entries");
      replaceScreen("list");
    });
  }

  function deleteCustomStatus(id) {
    confirmDelete("Delete availability ?", "This availability option will be removed permanently.", () => {
      const deletedStatus = customStatuses.find((item) => item.id === id);
      setCustomStatuses((current) => current.filter((item) => item.id !== id));
      if (deletedStatus?.name) {
        setEntries((current) =>
          current.map((entry) =>
            entry.status === deletedStatus.name ? { ...entry, status: "", updatedAt: new Date().toISOString() } : entry
          )
        );
      }
      changeListMode("statuses");
      replaceScreen("list");
    });
  }

  function deleteType(typeName) {
    const normalizedName = `${typeName || ""}`.trim();
    if (!normalizedName) {
      return;
    }

    confirmDelete("Delete type ?", "This type option will be removed permanently.", () => {
      setTypes((current) => current.filter((type) => `${type || ""}`.trim() !== normalizedName));
      setEntries((current) =>
        current.map((entry) =>
          `${entry.type || ""}`.trim() === normalizedName ? { ...entry, type: "", updatedAt: new Date().toISOString() } : entry
        )
      );
      setFilter((current) => ({
        ...current,
        type: `${current.type || ""}`.trim() === normalizedName ? "" : current.type
      }));
      setForm((current) => ({
        ...current,
        type: `${current.type || ""}`.trim() === normalizedName ? "" : current.type
      }));
      setNewType((current) => (`${current || ""}`.trim() === normalizedName ? "" : current));
      setEditingTypeName((current) => (`${current || ""}`.trim() === normalizedName ? null : current));
      changeListMode("types");
      replaceScreen("list");
    });
  }

  function deleteCategory(categoryName) {
    const normalizedName = `${categoryName || ""}`.trim();
    if (!normalizedName) {
      return;
    }

    confirmDelete("Delete category ?", "This category option will be removed permanently.", () => {
      setCategories((current) => current.filter((category) => `${category || ""}`.trim() !== normalizedName));
      setEntries((current) =>
        current.map((entry) =>
          `${entry.location || ""}`.trim() === normalizedName
            ? { ...entry, location: "", updatedAt: new Date().toISOString() }
            : entry
        )
      );
      setForm((current) => ({
        ...current,
        location: `${current.location || ""}`.trim() === normalizedName ? "" : current.location
      }));
      setEditingCategoryName((current) => (`${current || ""}`.trim() === normalizedName ? null : current));
      changeListMode("categories");
      replaceScreen("list");
    });
  }

  async function exportEntries() {
    if (!exportEntriesList.length) {
      showDialog("No data", "No entries match the selected export conditions.", "warning");
      return;
    }

    try {
      setExporting(true);
      const file = await shareExcelFile(exportEntriesList);
      showDialog(
        "Export ready",
        `${file.fallback ? "Excel-compatible file" : "Excel file"} ${
          Platform.OS === "web" ? "downloaded" : "created"
        }:\n${file.uri}`,
        "success"
      );
    } catch (error) {
      showDialog("Export failed", error?.message || "The Excel file could not be created.", "error");
    } finally {
      setExporting(false);
    }
  }

  async function uploadToGoogleDrive() {
    if (!exportEntriesList.length) {
      showDialog("No data", "No entries match the selected export conditions.", "warning");
      return;
    }

    try {
      setExporting(true);
      const file = await uploadExcelToGoogleDrive(exportEntriesList);
      showDialog(
        "Upload ready",
        Platform.OS === "web"
          ? `${file.fallback ? "Excel-compatible file" : "Excel file"} downloaded:\n${file.uri}\nGoogle Drive opened in a new tab.`
          : `Choose Google Drive from the share sheet to upload the ${file.fallback ? "Excel-compatible file" : "Excel file"}.`,
        "success"
      );
    } catch (error) {
      showDialog("Upload failed", error?.message || "The Excel file could not be shared.", "error");
    } finally {
      setExporting(false);
    }
  }

  async function exportPdfReport() {
    if (!exportEntriesList.length) {
      showDialog("No data", "No entries match the selected export conditions.", "warning");
      return;
    }

    try {
      setExportingPdf(true);
      const uri = await sharePdfReport(exportEntriesList, profile, exportStats, exportFilter);
      showDialog(
        "PDF ready",
        Platform.OS === "web" ? "The report opened in a new print window." : `PDF report created:\n${uri}`,
        "success"
      );
    } catch {
      showDialog("PDF export failed", "The PDF report could not be created.", "error");
    } finally {
      setExportingPdf(false);
    }
  }

  function setThemeMode(mode) {
    setThemeModeState(mode);
  }

  return {
    entries,
    categories,
    categoryForm,
    exportEntriesList,
    exportFilter,
    customStatuses,
    dialog,
    editing: Boolean(editingId),
    exporting,
    exportingPdf,
    filter,
    form,
    listMode: normalizeListMode(listMode),
    newType,
    profile,
    loggedIn,
    screen,
    selectedEntry,
    selectedStatus,
    sortBy,
    sortDir,
    stats,
    statusForm,
    theme: themes[themeMode],
    themeMode,
    types,
    typeForm,
    visibleEntries,
    statusOptions,
    buildMedicineSearchUrl,
    closeDialog,
    deleteCategory,
    deleteEntry,
    deleteCustomStatus,
    deleteType,
    exportEntries,
    exportPdfReport,
    login,
    logout,
    openCreate,
    openCategoryCreate,
    openCategoryEdit,
    openEdit,
    openMedicineResearch,
    openResearchInBrowser,
    openEntryCreate,
    openStatusCreate,
    openStatusEdit,
    openTypeCreate,
    openTypeEdit,
    saveCategory,
    saveCustomStatus,
    saveEntry,
    saveType,
    showDialog,
    setCategoryField,
    setExportFilter,
    setField,
    setFilter,
    setListMode: changeListMode,
    setNewType,
    setProfile,
    setScreen: navigate,
    setSelectedId,
    setSelectedStatusId,
    setSortBy,
    setSortDir,
    setThemeMode,
    setStatusField,
    setTypeField,
    uploadToGoogleDrive,
    goBack,
    replaceScreen
  };
}
