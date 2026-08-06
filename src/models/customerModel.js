import { emptyForm } from "../constants/appConstants";

export const today = () => new Date().toISOString().slice(0, 10);

export const getNextSlno = (entries) => {
  const maxSlno = entries.reduce((max, entry) => {
    const value = Number(entry.slno);
    return Number.isFinite(value) && value > max ? value : max;
  }, 0);
  return `${maxSlno + 1}`;
};

export const makeForm = (entry) => ({
  ...emptyForm,
  date: entry?.date || today(),
  slno: entry?.slno || "",
  name: entry?.name || "",
  phone: entry?.phone || "",
  detail1: entry?.detail1 || "",
  detail2: entry?.detail2 || "",
  detail3: entry?.detail3 || "",
  alternates: entry?.alternates || entry?.detail1 || "",
  usedFor: entry?.usedFor || entry?.detail2 || "",
  dosage: entry?.dosage || entry?.detail3 || "",
  warnings: entry?.warnings || "",
  type: entry?.type || "",
  notes: entry?.notes || "",
  status: entry?.status || ""
});

export const filterAndSortEntries = (entries, filter, sortBy, sortDir) => {
  const filtered = entries.filter((entry) => {
    const matchesDate = filter.date ? entry.date.includes(filter.date) : true;
    const matchesCustomer = filter.customer ? entry.name === filter.customer : true;
    const matchesType = filter.type ? entry.type === filter.type : true;
    const matchesStatus = filter.status ? entry.status === filter.status : true;
    return matchesDate && matchesCustomer && matchesType && matchesStatus;
  });

  return filtered.sort((a, b) => {
    const left = sortBy === "slno" ? Number(a.slno) || a.slno : a[sortBy] || "";
    const right = sortBy === "slno" ? Number(b.slno) || b.slno : b[sortBy] || "";
    if (left < right) return sortDir === "asc" ? -1 : 1;
    if (left > right) return sortDir === "asc" ? 1 : -1;
    return 0;
  });
};

export const toExcelRows = (entries) =>
  entries.map((entry) => ({
    "SL No": entry.slno,
    Date: entry.date,
    "Medicine Name": entry.name,
    Manufacturer: entry.phone,
    Alternates: entry.alternates || entry.detail1,
    "Used For": entry.usedFor || entry.detail2,
    Dosage: entry.dosage || entry.detail3,
    Warnings: entry.warnings,
    Type: entry.type,
    Availability: entry.status,
    Notes: entry.notes,
    "Created At": entry.createdAt,
    "Updated At": entry.updatedAt
  }));
