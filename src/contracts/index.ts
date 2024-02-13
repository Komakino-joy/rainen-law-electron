export type UserCredentials = {
  username: string;
  password: string;
};

export type ModalType = 'property' | 'client';
export type TableRefs =
  | 'cities'
  | 'pType'
  | 'pStat'
  | 'PAssign'
  | 'clientStat'
  | 'examiners'
  | 'users';
export interface Property {
  p_input_date: string;
  c_name: string;
  clientName: string;
  c_number: string;
  id: string;
  p_city: string;
  p_street: string;
  p_lot: string;
  p_condo: string;
  p_county: string;
  p_unit: string;
  p_state: string;
  p_zip: string;
  p_status: string;
  p_type: string;
  p_assign: string;
  p_comp_ref: string;
  p_instructions: string;
  p_number: string;
  p_requester: string;
  p_request_date: string;
  p_closed_date: string;
  p_file: string;
  c_file: string;
  p_book_1: string;
  p_book_2: string;
  p_page_1: string;
  p_page_2: string;
  p_cert_1: string;
  seller_1: string;
  seller_2: string;
  seller_3: string;
  seller_4: string;
  buyer_1: string;
  buyer_2: string;
  username: string;
}

export interface ReportProperty {
  p_input_date: string;
  p_lot: string;
  p_street: string;
  p_city: string;
  county_code: string;
  county_name: string;
  p_comp_ref: number;
  p_number: number;
  c_name: string;
  p_type: 'FT' | 'RD' | 'FC' | 'H';
  p_assign: string;
  p_assign2: string;
}

export interface Client {
  c_id: string;
  c_number: number;
  c_name: string;
  c_address_1: string;
  c_address_2: string;
  c_city: string;
  c_state: string;
  c_zip: string;
  c_phone: string;
  c_fax: string;
  c_contact: string;
  c_status: string;
  c_statement_addressee: string;
  c_search: string;
  c_email: string;
  c_notes: string;
  id: number;
  last_updated: string;
  propcount: number;
  titlescount: number;
  created_by: string;
  last_updated_by: string;
}

export interface DateTime {
  date: string;
  time: string;
}

export interface ClientInfoSnippet {
  id: string;
  c_number: number | null;
  c_name: string | null;
  last_updated: DateTime | null;
}

export interface INSTitle {
  id: string;
  tticoname: string;
  INMBR: string;
  ISTAT: string;
  IREMIT: string;
  TITLECO: string;
  IPOLDATE: string;
  ILOT: string;
  ISTRET: string;
  ICITY: string;
  PREMDUE: number;
  LPOLICYAMT: number;
  LPOLICYNUM: string;
  OPOLICYAMT: number;
  OPOLICYNUM: string;
  c_name: string;
  IFILE: string;
  AGENTFEE: string;
  PREMPAID: string;
}
export interface LabelValuePair {
  label: string;
  value: any;
}

export interface Policy {
  id: string;
  tticoname: string;
  IPOLDATE: string;
  IFILE: string;
  ICITY: string;
  ISTRET: string;
  ILOT: string;
  ICONDO: string;
  IUNIT: string;
  INMBR: string;
  PREMDUE: string;
  PREMPAID: string;
  AGENTFEE: string;
  TICOFEE: string;
  RWFEE: string;
  TITLECO: string;
  OPOLICYNUM: string;
  LPOLICYNUM: string;
  OPOLICYAMT: string;
  LPOLICYAMT: string;
  ISTAT: string;
  DATEBILLED: string;
  DATEPAID: string;
  IBILL: string;
  POLICYDATE: string;
  IREMIT: string;
  c_name: string;
  IPDATE: string;
  ICDATE: string;
}

export interface ClientStatus {
  id: number;
  status_code: string;
  status_desc: string;
}

export interface InsStatus {
  id: number;
  status_code: string;
  status_desc: string;
}

export interface PropertyStatus {
  id: number;
  status_code: string;
  status_desc: string;
}

export interface PropertyType {
  id: number;
  type_code: string;
  type_desc: string;
}

export interface County {
  id: number;
  code: string;
  county: string;
}

export interface Examiner {
  id: string;
  name: string;
  code: string;
  type: string;
  compensate: string;
  last_updated: string;
  created_at: string;
  is_active: boolean;
}

export interface City {
  id: string;
  city: string;
  county: string;
  state_abbrv: string;
}

export interface User {
  id: string;
  username: string;
  f_name: string;
  l_name: string;
}

export interface BuyerSeller {
  id: string;
  seller_1: string;
  seller_2: string;
  seller_3: string;
  seller_4: string;
  buyer_1: string;
  buyer_2: string;
}
