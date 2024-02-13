export const p_type_MAP = {
  FT: "Full Titles",
  RD: "Rundowns",
  FC: "Foreclosures",
  H: "On Hold",
};

export const FORM_BUTTON_TEXT = {
  update: "Update",
  insert: "Create",
};

export const RAINEN_LAW = {
  reportHeader: {
    name: "RAINEN LAW OFFICE, P.C.",
    plaza: "Two Center Plaza",
    suite: "Suite 520",
    cityStateZip: "Boston, Massachusetss 02108",
    phone: "TELEPHONE (617) 367-8284",
  },
};

export const CLIENT_STATUS_CODES_MAP = {
  O: "Open",
  C: "Closed",
};
export type ClientStatusCodeMapType = keyof typeof CLIENT_STATUS_CODES_MAP;

export const PROPERTY_STATUS_CODES_MAP = {
  N: "Open",
  P: "Pending",
  C: "Closed",
};
export type PropertyStatusCodeMapType = keyof typeof PROPERTY_STATUS_CODES_MAP;

export const CITY_HUB = "Hub of the universe aka Boston";
