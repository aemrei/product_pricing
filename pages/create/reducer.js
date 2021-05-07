import { CATEGORY_INTERFACE, CATEGORY_PRODUCT } from "../../db/settings";

function calculateePrice(state) {
  return state.summary;
}

export const quotationReducer = (state, action) => {
  const { summary, ...updatedState } = { ...state };

  switch (action.type) {
    case "activate":
      break;
    default:
      updatedState[action.type] = action.payload;
  }

  const result = {
    ...updatedState,
    summary: calculateePrice(updatedState),
  };

  return result;
};

const filterByCategory = (list, category) => {
  return list.filter((i) => i.category === category);
};

export const initiateQuotationState = ({ ranges = [], settings = [], countries = [], rates = [] }) => {
  const interfaceSettings = filterByCategory(settings, CATEGORY_INTERFACE);
  const productSettings = filterByCategory(settings, CATEGORY_PRODUCT).map((p) => ({
    ...p,
    activated: p.readOnly || false,
  }));

  return {
    version: "0.0.1",
    name: "",
    country: "eur",
    countries: countries,
    rates: rates,
    interfaceSettings,
    productSettings,
    additionalRemarks: "",
    summary: {
      onetime_eur: 0,
      annual_eur: 0,
      bigmac_onetime_eur: 0,
      bigmac_annual_eur: 0,
      bigmac_onetime_usd: 0,
      bigmac_annual_usd: 0,
    },
  };
};
