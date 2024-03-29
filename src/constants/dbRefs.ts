export const dbRef = {
  table_names: {
    city: "city",
    cities: "cities",
    users: "users",
    clients: "clients",
    counties: "counties",
    examiners: "examiners",
    prop_types: "prop_types",
    properties: "properties",
    prop_status: "prop_status",
    prop_assign: "prop_assign",
    buyer_seller: "buyer_seller",
    client_status: "client_status",
    insurance_titles: "insurance_titles",
  },
  cities: {
    id: "id",
    city: "city",
    county: "county",
    state_abbrv: "state_abbrv",
  },
  city: {
    city: "city",
    county: "county",
  },
  counties: {
    id: "id",
    code: "code",
    county: "county",
  },
  properties: {
    id: "id",
    p_number: "p_number",
    p_input_date: "p_input_date",
    p_city: "p_city",
    p_county: "p_county",
    p_street: "p_street",
    p_lot: "p_lot",
    p_condo: "p_condo",
    p_unit: "p_unit",
    p_book_1: "p_book_1",
    p_book_2: "p_book_2",
    p_page_1: "p_page_1",
    p_page_2: "p_page_2",
    p_cert_1: "p_cert_1",
    p_requester: "p_requester",
    p_file: "p_file",
    p_type: "p_type",
    p_status: "p_status",
    p_assign: "p_assign",
    p_assign_2: "p_assign_2",
    p_comp_ref: "p_comp_ref",
    p_instructions: "p_instructions",
    c_file: "c_file",
    FILE: "FILE",
    p_state: "p_state",
    p_zip: "p_zip",
    p_request_date: "p_request_date",
    p_closed_date: "p_closed_date",
    created_by: "created_by",
    last_updated_by: "last_updated_by",
    last_updated: "last_updated",
    created_at: "created_at",
  },

  buyer_seller: {
    id: "id",
    p_comp_ref: "p_comp_ref",
    seller_1: "seller_1",
    seller_2: "seller_2",
    seller_3: "seller_3",
    seller_4: "seller_4",
    buyer_1: "buyer_1",
    buyer_2: "buyer_2",
  },

  clients: {
    id: "id",
    c_number: "c_number",
    c_name: "c_name",
    c_address_1: "c_address_1",
    c_address_2: "c_address_2",
    c_city: "c_city",
    c_state: "c_state",
    c_zip: "c_zip",
    c_phone: "c_phone",
    c_fax: "c_fax",
    c_contact: "c_contact",
    c_status: "c_status",
    c_statement_addressee: "c_statement_addressee",
    c_email: "c_email",
    c_notes: "c_notes",
    created_by: "created_by",
    last_updated_by: "last_updated_by",
    last_updated: "last_updated",
    created_at: "created_at",
  },

  insurance_titles: {
    id: "id",
    i_number: "i_number",
    i_file: "i_file",
    i_city: "i_city",
    i_street: "i_street",
    i_lot: "i_lot",
    i_condo: "i_condo",
    i_unit: "i_unit",
    prem_due: "prem_due",
    prem_paid: "prem_paid",
    agent_fee: "agent_fee",
    ticofee: "ticofee",
    rwfee: "rwfee",
    titleco: "titleco",
    o_policy_num: "o_policy_num",
    o_policy_amt: "o_policy_amt",
    l_policy_num: "l_policy_num",
    l_policy_amt: "l_policy_amt",
    i_status: "i_status",
    i_close_date: "i_close_date",
    i_paid_date: "i_paid_date",
    i_bill: "i_bill",
    i_policy_date: "i_policy_date",
    i_remit: "i_remit",
    export: "export",
    i_state: "i_state",
    i_zip: "i_zip",
    i_notes: "i_notes",
  },

  users: {
    id: "id",
    is_admin: "is_admin",
    f_name: "f_name",
    l_name: "l_name",
    username: "username",
    password: "password",
    created_at: "created_at",
    last_updated: "last_updated",
  },

  examiners: {
    id: "id",
    name: "name",
    code: "code",
    type: "type",
    compensate: "compensate",
    is_active: "is_active",
    created_at: "created_at",
    created_by: "created_by",
    last_updated: "last_updated",
    last_updated_by: "last_updated_by",
  },
};
