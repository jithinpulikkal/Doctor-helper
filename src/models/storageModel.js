import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system/legacy";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { Platform } from "react-native";
import * as XLSX from "xlsx";
import { defaultCategories, defaultProfile, defaultTypes, STORAGE_KEYS } from "../constants/appConstants";
import { toExcelRows } from "./medicineModel";

const legacyPresetTypes = ["General", "Urgent", "Service", "Sales", "Follow Up"];

export async function loadAppData() {
  const [savedEntries, savedCustomStatuses, savedTypes, savedCategories, savedProfile, savedLoggedIn, savedTheme] = await Promise.all([
    AsyncStorage.getItem(STORAGE_KEYS.entries),
    AsyncStorage.getItem(STORAGE_KEYS.customStatuses),
    AsyncStorage.getItem(STORAGE_KEYS.types),
    AsyncStorage.getItem(STORAGE_KEYS.categories),
    AsyncStorage.getItem(STORAGE_KEYS.profile),
    AsyncStorage.getItem(STORAGE_KEYS.loggedIn),
    AsyncStorage.getItem(STORAGE_KEYS.theme)
  ]);

  return {
    entries: savedEntries ? JSON.parse(savedEntries) : [],
    customStatuses: savedCustomStatuses ? JSON.parse(savedCustomStatuses) : [],
	    types: savedTypes
	      ? JSON.parse(savedTypes).filter((type) => !legacyPresetTypes.includes(type))
	      : defaultTypes,
	    categories: savedCategories ? JSON.parse(savedCategories) : defaultCategories,
    profile: savedProfile ? { ...defaultProfile, ...JSON.parse(savedProfile) } : defaultProfile,
    loggedIn: savedLoggedIn === "true",
    themeMode: savedTheme || "light"
  };
}

export const saveEntries = (entries) =>
  AsyncStorage.setItem(STORAGE_KEYS.entries, JSON.stringify(entries));

export const saveCustomStatuses = (customStatuses) =>
  AsyncStorage.setItem(STORAGE_KEYS.customStatuses, JSON.stringify(customStatuses));

export const saveTypes = (types) =>
  AsyncStorage.setItem(STORAGE_KEYS.types, JSON.stringify(types));

export const saveCategories = (categories) =>
  AsyncStorage.setItem(STORAGE_KEYS.categories, JSON.stringify(categories));

export const saveProfile = (profile) =>
  AsyncStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(profile));

export const saveLoggedIn = (loggedIn) => AsyncStorage.setItem(STORAGE_KEYS.loggedIn, loggedIn ? "true" : "false");

export const saveThemeMode = (themeMode) => AsyncStorage.setItem(STORAGE_KEYS.theme, themeMode);

const excelMimeType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
const excelUti = "org.openxmlformats.spreadsheetml.sheet";
const excelXmlMimeType = "application/vnd.ms-excel";
const excelXmlUti = "com.microsoft.excel.xls";

function createWorkbook(entries) {
  const rows = toExcelRows(entries);
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(rows);
  XLSX.utils.book_append_sheet(workbook, worksheet, "Medicines");
  return { rows, workbook };
}

function downloadWebFile(contents, fileName, mimeType) {
  const blob = contents instanceof Blob ? contents : new Blob([contents], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function writeCsvFile(entries) {
  const { rows } = createWorkbook(entries);
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const csv = XLSX.utils.sheet_to_csv(worksheet);
  const fileName = `doctor-helper-medicines-${new Date().toISOString().slice(0, 10)}.csv`;

  if (Platform.OS === "web") {
    downloadWebFile(csv, fileName, "text/csv;charset=utf-8");
    return { uri: fileName, mimeType: "text/csv", UTI: "public.comma-separated-values-text", fallback: true };
  }

  if (!FileSystem.documentDirectory) {
    throw new Error("Phone storage is not available for export.");
  }

  const uri = `${FileSystem.documentDirectory}${fileName}`;
  await FileSystem.writeAsStringAsync(uri, csv, {
    encoding: FileSystem.EncodingType.UTF8
  });

  const info = await FileSystem.getInfoAsync(uri);
  if (!info.exists) {
    throw new Error("The export file could not be saved on this phone.");
  }

  return { uri, mimeType: "text/csv", UTI: "public.comma-separated-values-text", fallback: true };
}

async function writeExcelXmlFile(entries) {
  const { rows } = createWorkbook(entries);
  const headers = rows.length ? Object.keys(rows[0]) : [ "SL No", "Date", "Medicine Name", "Manufacturer", "Details", "Category", "Alternates", "Used For", "Dosage", "Warnings", "Type", "Availability", "Notes"];
  const tableRows = [
    `<Row>${headers.map((header) => `<Cell><Data ss:Type="String">${escapeHtml(header)}</Data></Cell>`).join("")}</Row>`,
    ...rows.map((row) =>
      `<Row>${headers
        .map((header) => `<Cell><Data ss:Type="String">${escapeHtml(row[header] || "")}</Data></Cell>`)
        .join("")}</Row>`
    )
  ].join("");
  const workbookXml = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
  xmlns:o="urn:schemas-microsoft-com:office:office"
  xmlns:x="urn:schemas-microsoft-com:office:excel"
  xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
  <Worksheet ss:Name="Entries">
    <Table>${tableRows}</Table>
  </Worksheet>
</Workbook>`;
  const fileName = `doctor-helper-medicines-${new Date().toISOString().slice(0, 10)}.xls`;

  if (Platform.OS === "web") {
    downloadWebFile(workbookXml, fileName, excelXmlMimeType);
    return { uri: fileName, mimeType: excelXmlMimeType, UTI: excelXmlUti, fallback: true };
  }

  if (!FileSystem.documentDirectory) {
    throw new Error("Phone storage is not available for export.");
  }

  const uri = `${FileSystem.documentDirectory}${fileName}`;
  await FileSystem.writeAsStringAsync(uri, workbookXml, {
    encoding: FileSystem.EncodingType.UTF8
  });

  const info = await FileSystem.getInfoAsync(uri);
  if (!info.exists) {
    throw new Error("The Excel file could not be saved on this phone.");
  }

  return { uri, mimeType: excelXmlMimeType, UTI: excelXmlUti, fallback: true };
}

export async function createExcelFile(entries) {
  const { workbook } = createWorkbook(entries);

  const fileName = `doctor-helper-medicines-${new Date().toISOString().slice(0, 10)}.xlsx`;

  if (Platform.OS === "web") {
    try {
      const arrayBuffer = XLSX.write(workbook, { type: "array", bookType: "xlsx" });
      downloadWebFile(arrayBuffer, fileName, excelMimeType);
      return { uri: fileName, mimeType: excelMimeType, UTI: excelUti, fallback: false };
    } catch {
      return writeExcelXmlFile(entries);
    }
  }

  if (!FileSystem.documentDirectory) {
    throw new Error("Phone storage is not available for export.");
  }

  try {
    const base64 = XLSX.write(workbook, { type: "base64", bookType: "xlsx" });
    const uri = `${FileSystem.documentDirectory}${fileName}`;

    await FileSystem.writeAsStringAsync(uri, base64, {
      encoding: FileSystem.EncodingType.Base64
    });

    const info = await FileSystem.getInfoAsync(uri);
    if (!info.exists) {
      throw new Error("The Excel file could not be saved on this phone.");
    }

    return { uri, mimeType: excelMimeType, UTI: excelUti, fallback: false };
  } catch {
    return writeExcelXmlFile(entries);
  }
}

export async function shareExcelFile(entries) {
  const file = await createExcelFile(entries);
  if (Platform.OS === "web") {
    return file;
  }

  if (!(await Sharing.isAvailableAsync())) {
    throw new Error("Sharing is not available on this device.");
  }

  await Sharing.shareAsync(file.uri, {
    mimeType: file.mimeType,
    dialogTitle: "Export medicine data",
    UTI: file.UTI
  });

  return file;
}

export async function uploadExcelToGoogleDrive(entries) {
  const file = await createExcelFile(entries);

  if (Platform.OS === "web") {
    window.open("https://drive.google.com/drive/my-drive", "_blank");
    return file;
  }

  if (!(await Sharing.isAvailableAsync())) {
    throw new Error("Sharing is not available on this device.");
  }

  await Sharing.shareAsync(file.uri, {
    mimeType: file.mimeType,
    dialogTitle: "Upload medicine data to Google Drive",
    UTI: file.UTI
  });

  return file;
}

const escapeHtml = (value) =>
  `${value ?? ""}`
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

function buildPdfHtml(entries, profile, stats, filter = {}) {
  const rows = entries
    .map(
      (entry) => `
        <tr>
          <td class="center">${escapeHtml(entry.slno)}</td>
          <td class="strong">${escapeHtml(entry.name || "-")}</td>
          <td>${escapeHtml(entry.phone || "-")}</td>
          <td>${escapeHtml(entry.details || "-")}</td>
          <td>${escapeHtml(entry.location || "-")}</td>
          <td>${escapeHtml(entry.alternates || entry.detail1 || "-")}</td>
          <td>${escapeHtml(entry.usedFor || entry.detail2 || "-")}</td>
          <td>${escapeHtml(entry.dosage || entry.detail3 || "-")}</td>
          <td>${escapeHtml(entry.warnings || "-")}</td>
          <td>${escapeHtml(entry.type || "-")}</td>
          <td>${escapeHtml(entry.notes || "-")}</td>
        </tr>
      `
    )
    .join("");

  const typeCounts = entries.reduce((result, entry) => {
    const type = entry.type || "No type";
    result[type] = (result[type] || 0) + 1;
    return result;
  }, {});
  const typeRows = Object.entries(typeCounts)
    .map(
      ([type, count]) => `
        <tr>
          <td>${escapeHtml(type)}</td>
          <td class="right">${count}</td>
          <td class="right">${entries.length ? Math.round((count / entries.length) * 100) : 0}%</td>
        </tr>
      `
    )
    .join("");
  const emptyBreakdownRow = `<tr><td>-</td><td class="right">0</td><td class="right">0%</td></tr>`;
  const filterValue = (value, fallback = "All") => {
    const normalized = `${value || ""}`.trim();
    return normalized || fallback;
  };

  return `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          @page { size: A4 landscape; margin: 18mm; }
          * { box-sizing: border-box; }
          body {
            margin: 0;
            font-family: Arial, Helvetica, sans-serif;
            color: #1f2937;
            background: #ffffff;
            font-size: 11px;
          }
          @media print {
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          }
          h1, h2, h3, p { margin: 0; }
          .report-title {
            border-bottom: 3px solid #1f2937;
            padding-bottom: 14px;
            margin-bottom: 18px;
          }
          .eyebrow {
            color: #64748b;
            font-size: 10px;
            font-weight: 700;
            letter-spacing: 1.2px;
            text-transform: uppercase;
          }
          h1 {
            margin-top: 4px;
            font-size: 26px;
            line-height: 1.15;
            color: #111827;
          }
          .generated {
            margin-top: 8px;
            color: #64748b;
            font-size: 11px;
          }
          .grid {
            display: grid;
            grid-template-columns: 1.1fr 0.9fr;
            gap: 16px;
            margin-bottom: 18px;
          }
          .breakdown-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
            margin-top: 16px;
            margin-bottom: 16px;
          }
          .section {
            border: 1px solid #e5e7eb;
            border-radius: 10px;
            padding: 14px;
            break-inside: avoid;
          }
          .section h2 {
            font-size: 15px;
            color: #111827;
            margin-bottom: 10px;
          }
          .details {
            width: 100%;
            border-collapse: collapse;
          }
          .details td {
            border-bottom: 1px solid #eef2f7;
            padding: 7px 0;
          }
          .details td:first-child {
            width: 34%;
            color: #64748b;
            font-weight: 700;
          }
          .stats {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 8px;
          }
          .stat {
            background: #f8fafc;
            border: 1px solid #e5e7eb;
            border-radius: 10px;
            padding: 10px;
          }
          .stat strong {
            display: block;
            font-size: 22px;
            color: #111827;
            margin-bottom: 2px;
          }
          .stat span {
            color: #64748b;
            font-weight: 700;
          }
          table.entries {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
            table-layout: fixed;
          }
          .entries th {
            background: #1f2937;
            color: #ffffff;
            text-align: left;
            padding: 8px 6px;
            font-size: 9px;
            text-transform: uppercase;
          }
          .entries td {
            border: 1px solid #e5e7eb;
            padding: 7px 6px;
            vertical-align: top;
            line-height: 1.35;
            word-wrap: break-word;
          }
          .entries tr:nth-child(even) td { background: #f8fafc; }
          .center { text-align: center; }
          .right { text-align: right; }
          .strong { font-weight: 700; color: #111827; }
          .footer {
            margin-top: 16px;
            padding-top: 10px;
            border-top: 1px solid #e5e7eb;
            color: #64748b;
            font-size: 10px;
          }
        </style>
      </head>
      <body>
        <div class="report-title">
          <div class="eyebrow">Doctor Helper Medicine Report</div>
          <h1>${escapeHtml(profile?.businessName || "Medicine Report")}</h1>
          <div class="generated">Generated on ${new Date().toLocaleString()}</div>
        </div>

        <div class="grid">
          <div class="section">
            <h2>Doctor Details</h2>
            <table class="details">
              <tr><td>Owner Name</td><td>${escapeHtml(profile?.ownerName || "-")}</td></tr>
              <tr><td>Designation</td><td>${escapeHtml(profile?.designation || "-")}</td></tr>
              <tr><td>Clinic / Library</td><td>${escapeHtml(profile?.businessName || "-")}</td></tr>
              <tr><td>Phone</td><td>${escapeHtml(profile?.phone || "-")}</td></tr>
              <tr><td>Email</td><td>${escapeHtml(profile?.email || "-")}</td></tr>
              <tr><td>Place</td><td>${escapeHtml(profile?.place || "-")}</td></tr>
            </table>
          </div>
          <div class="section">
            <h2>Export Conditions</h2>
            <table class="details">
              <tr><td>Medicine</td><td>${escapeHtml(filterValue(filter.medicine))}</td></tr>
              <tr><td>Category</td><td>${escapeHtml(filterValue(filter.category))}</td></tr>
              <tr><td>Type</td><td>${escapeHtml(filterValue(filter.type))}</td></tr>
            </table>
          </div>
        </div>

        <div class="breakdown-grid">
          <div class="section">
            <h2>Type Breakdown</h2>
            <table class="details">
              <tr><td><strong>Type</strong></td><td class="right"><strong>Count</strong></td><td class="right"><strong>Percent</strong></td></tr>
              ${typeRows || emptyBreakdownRow}
            </table>
          </div>
        </div>

        <div class="section">
          <h2>Medicine Records</h2>
          <table class="entries">
          <thead>
	            <tr>
	              <th style="width: 4%;">SL</th>
	              <th style="width: 13%;">Medicine</th>
	              <th style="width: 10%;">Brand</th>
	              <th style="width: 11%;">Details</th>
	              <th style="width: 10%;">Category</th>
	              <th style="width: 11%;">Alternates</th>
	              <th style="width: 11%;">Used For</th>
	              <th style="width: 9%;">Dosage</th>
	              <th style="width: 9%;">Warnings</th>
	              <th style="width: 8%;">Type</th>
	              <th style="width: 8%;">Notes</th>
	            </tr>
	          </thead>
		          <tbody>${rows || `<tr><td colspan="11">No entries found.</td></tr>`}</tbody>
          </table>
        </div>

        <div class="footer">
          This report was generated locally from Doctor Helper.
        </div>
      </body>
    </html>
  `;
}

export async function sharePdfReport(entries, profile, stats, filter) {
  const html = buildPdfHtml(entries, profile, stats, filter);

  if (Platform.OS === "web") {
    const reportWindow = window.open("", "_blank");
    if (!reportWindow) {
      throw new Error("Unable to open report window");
    }

    reportWindow.document.open();
    reportWindow.document.write(html);
    reportWindow.document.close();
    reportWindow.onload = () => {
      reportWindow.focus();
      reportWindow.print();
    };
    return "PDF report opened in a new print window";
  }

  const { uri } = await Print.printToFileAsync({ html });

  if (!(await Sharing.isAvailableAsync())) {
    return uri;
  }

  await Sharing.shareAsync(uri, {
    mimeType: "application/pdf",
    dialogTitle: "Export PDF report",
    UTI: "com.adobe.pdf"
  });

  return uri;
}
