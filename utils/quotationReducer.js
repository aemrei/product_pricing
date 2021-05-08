import { CATEGORY_PRODUCT } from "../db/settings";

export const SET_PRODUCT_ACTIVATION = "SET_PRODUCT_ACTIVATION";
export const SET_PROPERTY = "SET_PROPERTY";

function calculatePrice(state) {
  const { settingsAsObject } = state;

  const collected = {
    onetime_eur: state.productSettings.reduce((x, y) => x + y.activated * y.value, 0),
    annual_eur: 0,
    bigmac_onetime_eur: 0,
    bigmac_annual_eur: 0,
    bigmac_onetime_usd: 0,
    bigmac_annual_usd: 0,
  };

  collected.annual_eur = (collected.onetime_eur * settingsAsObject.maintenanceFeePerCent.value) / 100;

  return collected;
}

export const quotationReducer = (state, action) => {
  const { summary, ...updatedState } = { ...state };

  switch (action.type) {
    case SET_PRODUCT_ACTIVATION:
      updatedState.productSettings = updatedState.productSettings.map((p) => {
        if (p._id === action.payload._id) {
          return {
            ...p,
            activated: action.payload.activated,
          };
        }
        return p;
      });
      break;
    case SET_PROPERTY:
      updatedState.values = {
        ...updatedState.values,
        [action.payload.property]: action.payload.value,
      };

      updatedState.values.numberOfInterfaces =
        +updatedState.values.numberOfInterfaces * updatedState.values.interfaceActivated;
      break;
    default:
      updatedState[action.type] = action.payload;
  }

  const result = {
    ...updatedState,
    summary: calculatePrice(updatedState),
  };

  return result;
};

const filterByCategory = (list, category) => {
  return list.filter((i) => i.category === category);
};

export const initiateQuotationState = ({ ranges = [], settings = [], countries = [], rates = [] }) => {
  const productSettings = filterByCategory(settings, CATEGORY_PRODUCT).map((p) => ({
    ...p,
    activated: p.readOnly || false,
  }));

  const settingsAsObject = settings.reduce((obj, set) => {
    obj[set._id] = set;
    return obj;
  }, {});

  const result = {
    version: "0.0.1",
    countries: countries,
    rates: rates,
    productSettings,
    settingsAsObject,
    values: {
      interfaceActivated: true,
      additionalRemarks: "",
      country: "eur",
      customerName: "",
      numberOfInterfaces: 1,
      numberOfUsers: 1,
      numberOfLegalEntities: 1,
    },
    summary: {
      onetime_eur: 0,
      annual_eur: 0,
      bigmac_onetime_eur: 0,
      bigmac_annual_eur: 0,
      bigmac_onetime_usd: 0,
      bigmac_annual_usd: 0,
    },
  };

  result.summary = calculatePrice(result);

  return result;
};
