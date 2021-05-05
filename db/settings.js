const countries = [
  { _id: "Argentina", text: "Argentina", value: "Argentina", dollar_ratio: 3.50923244, euro_ratio: 0.733207457},
  { _id: "Australia", text: "Australia", value: "Australia", dollar_ratio: 4.57845, euro_ratio: 0.956606249},
  { _id: "Azerbaijan", text: "Azerbaijan", value: "Azerbaijan", dollar_ratio: 2.324896998, euro_ratio: 0.485756314},
  { _id: "Bahrain", text: "Bahrain", value: "Bahrain", dollar_ratio: 3.713035406, euro_ratio: 0.775789377},
  { _id: "Brazil", text: "Brazil", value: "Brazil", dollar_ratio: 3.913527886, euro_ratio: 0.817679615},
  { _id: "Britain", text: "Britain", value: "Britain", dollar_ratio: 4.2773325, euro_ratio: 0.893691752},
  { _id: "Canada", text: "Canada", value: "Canada", dollar_ratio: 5.07674144, euro_ratio: 1.06071762},
  { _id: "Chile", text: "Chile", value: "Chile", dollar_ratio: 3.478481655, euro_ratio: 0.72678249},
  { _id: "China", text: "China", value: "China", dollar_ratio: 3.098450775, euro_ratio: 0.64738009},
  { _id: "Colombia", text: "Colombia", value: "Colombia", dollar_ratio: 3.290010257, euro_ratio: 0.687403897},
  { _id: "Costa Rica", text: "Costa Rica", value: "Costa Rica", dollar_ratio: 4.039015168, euro_ratio: 0.843898514},
  { _id: "Croatia", text: "Croatia", value: "Croatia", dollar_ratio: 3.319652342, euro_ratio: 0.693597217},
  { _id: "Czech Republic", text: "Czech Republic", value: "Czech Republic", dollar_ratio: 3.801242024, euro_ratio: 0.794218977},
  { _id: "Denmark", text: "Denmark", value: "Denmark", dollar_ratio: 4.580607236, euro_ratio: 0.957056975},
  { _id: "Egypt", text: "Egypt", value: "Egypt", dollar_ratio: 2.63322884, euro_ratio: 0.550178153},
  { _id: "Euro area", text: "Euro area", value: "Euro area", dollar_ratio: 4.7861385, euro_ratio: 1},
  { _id: "Guatemala", text: "Guatemala", value: "Guatemala", dollar_ratio: 3.249707526, euro_ratio: 0.678983177},
  { _id: "Honduras", text: "Honduras", value: "Honduras", dollar_ratio: 3.523593904, euro_ratio: 0.736208094},
  { _id: "Hong Kong", text: "Hong Kong", value: "Hong Kong", dollar_ratio: 2.644837084, euro_ratio: 0.552603541},
  { _id: "Hungary", text: "Hungary", value: "Hungary", dollar_ratio: 2.890378076, euro_ratio: 0.603906067},
  { _id: "India", text: "India", value: "India", dollar_ratio: 2.526679743, euro_ratio: 0.527916136},
  { _id: "Indonesia", text: "Indonesia", value: "Indonesia", dollar_ratio: 2.355386214, euro_ratio: 0.492126631},
  { _id: "Israel", text: "Israel", value: "Israel", dollar_ratio: 4.946605756, euro_ratio: 1.033527499},
  { _id: "Japan", text: "Japan", value: "Japan", dollar_ratio: 3.635516197, euro_ratio: 0.759592769},
  { _id: "Jordan", text: "Jordan", value: "Jordan", dollar_ratio: 3.244005642, euro_ratio: 0.677791844},
  { _id: "Kuwait", text: "Kuwait", value: "Kuwait", dollar_ratio: 3.736192333, euro_ratio: 0.780627709},
  { _id: "Lebanon", text: "Lebanon", value: "Lebanon", dollar_ratio: 5.952380952, euro_ratio: 1.243670853},
  { _id: "Malaysia", text: "Malaysia", value: "Malaysia", dollar_ratio: 2.342046653, euro_ratio: 0.489339507},
  { _id: "Mexico", text: "Mexico", value: "Mexico", dollar_ratio: 2.228561241, euro_ratio: 0.465628239},
  { _id: "Moldova", text: "Moldova", value: "Moldova", dollar_ratio: 2.752562225, euro_ratio: 0.575111277},
  { _id: "New Zealand", text: "New Zealand", value: "New Zealand", dollar_ratio: 4.34841, euro_ratio: 0.90854245},
  { _id: "Nicaragua", text: "Nicaragua", value: "Nicaragua", dollar_ratio: 3.49088878, euro_ratio: 0.729374794},
  { _id: "Norway", text: "Norway", value: "Norway", dollar_ratio: 5.549004647, euro_ratio: 1.159390738},
  { _id: "Oman", text: "Oman", value: "Oman", dollar_ratio: 2.857142857, euro_ratio: 0.59696201},
  { _id: "Pakistan", text: "Pakistan", value: "Pakistan", dollar_ratio: 3.303303303, euro_ratio: 0.690181302},
  { _id: "Peru", text: "Peru", value: "Peru", dollar_ratio: 3.402624882, euro_ratio: 0.710933226},
  { _id: "Philippines", text: "Philippines", value: "Philippines", dollar_ratio: 2.872981831, euro_ratio: 0.600271353},
  { _id: "Poland", text: "Poland", value: "Poland", dollar_ratio: 2.789435646, euro_ratio: 0.582815488},
  { _id: "Qatar", text: "Qatar", value: "Qatar", dollar_ratio: 3.570447679, euro_ratio: 0.745997568},
  { _id: "Romania", text: "Romania", value: "Romania", dollar_ratio: 2.323916386, euro_ratio: 0.485551429},
  { _id: "Russia", text: "Russia", value: "Russia", dollar_ratio: 1.91258766, euro_ratio: 0.399609761},
  { _id: "Saudi Arabia", text: "Saudi Arabia", value: "Saudi Arabia", dollar_ratio: 3.732288293, euro_ratio: 0.779812012},
  { _id: "Singapore", text: "Singapore", value: "Singapore", dollar_ratio: 4.251945806, euro_ratio: 0.888387539},
  { _id: "South Africa", text: "South Africa", value: "South Africa", dollar_ratio: 1.859349228, euro_ratio: 0.388486298},
  { _id: "South Korea", text: "South Korea", value: "South Korea", dollar_ratio: 3.747033598, euro_ratio: 0.782892847},
  { _id: "Sri Lanka", text: "Sri Lanka", value: "Sri Lanka", dollar_ratio: 3.658864676, euro_ratio: 0.764471123},
  { _id: "Sweden", text: "Sweden", value: "Sweden", dollar_ratio: 5.755931016, euro_ratio: 1.202625251},
  { _id: "Switzerland", text: "Switzerland", value: "Switzerland", dollar_ratio: 6.905710491, euro_ratio: 1.442856384},
  { _id: "Taiwan", text: "Taiwan", value: "Taiwan", dollar_ratio: 2.444282247, euro_ratio: 0.510700275},
  { _id: "Thailand", text: "Thailand", value: "Thailand", dollar_ratio: 4.078381392, euro_ratio: 0.852123563},
  { _id: "Turkey", text: "Turkey", value: "Turkey", dollar_ratio: 2.039507253, euro_ratio: 0.426127922},
  { _id: "Ukraine", text: "Ukraine", value: "Ukraine", dollar_ratio: 2.174714338, euro_ratio: 0.454377645},
  { _id: "United Arab Emirates", text: "United Arab Emirates", value: "United Arab Emirates", dollar_ratio: 4.015845574, euro_ratio: 0.839057535},
  { _id: "United States", text: "United States", value: "United States", dollar_ratio: 5.71, euro_ratio: 1.193028576},
  { _id: "Uruguay", text: "Uruguay", value: "Uruguay", dollar_ratio: 4.327418432, euro_ratio: 0.904156541},
  { _id: "Vietnam", text: "Vietnam", value: "Vietnam", dollar_ratio: 2.84728214, euro_ratio: 0.594901744},
];

export const getCountries = async (db) => {
  return countries;
}

export const getProducts = async (db) => {
  return [
    { _id: "base", text: "Base price", price: "250,000", currency: "€", readOnly: true},
    { _id: "Fit-Prime", text: "Fit-Prime", price: "30,000", currency: "€"},
    { _id: "Fit-Parts", text: "Fit-Parts", price: "30,000", currency: "€"},
    { _id: "Fit-Service", text: "Fit-Service", price: "40,000", currency: "€"},
    { _id: "Fit-Rent", text: "Fit-Rent", price: "50,000", currency: "€"},
    { _id: "Fit-Lease", text: "Fit-Lease", price: "50,000", currency: "€"},
    { _id: "Fit-Fleet", text: "Fit-Fleet", price: "50,000", currency: "€"},
  ];
}

export const getFees = async (db) => {
  return [{
    _id: "perLegalEntity",
    text: "Price per extra legal entity (company code)",
    value: 10000,
    unit: "€",
  }, {
    _id: "meintenanceFeePerCent",
    text: "Annual maintenance fee",
    value: 22,
    unit: "%",
  }];
}

export const getInterfaceFees = async (db) => {
  return [{
    _id: "1",
    lowerLimit: 1,
    upperLimit: 50,
    value: "1,400",
    unit: "€",
  }, {
    _id: "2",
    lowerLimit: 51,
    upperLimit: 75,
    value: "1,100",
    unit: "€",
  }, {
    _id: "3",
    lowerLimit: 76,
    upperLimit: 300,
    value: "800",
    unit: "€",
  }];
}

export const getUserFees = async (db) => {
  return [{
    _id: "1",
    lowerLimit: 1,
    upperLimit: 50,
    value: "1,500",
    unit: "€",
  }, {
    _id: "2",
    lowerLimit: 51,
    upperLimit: 100,
    value: "1,100",
    unit: "€",
  }, {
    _id: "3",
    lowerLimit: 101,
    upperLimit: 250,
    value: "1000",
    unit: "€",
  }, {
    _id: "4",
    lowerLimit: 251,
    upperLimit: 1000,
    value: "750",
    unit: "€",
  }, {
    _id: "4",
    lowerLimit: 251,
    upperLimit: 1000000,
    value: "500",
    unit: "€",
  }];
}