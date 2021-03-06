import { CATEGORY_PRODUCT } from "../db/settings";
import simulateConditions, { AUTO_PARAM_REGEX } from "./simulateConditions";

export const SET_CONDITION = "SET_CONDITION";
export const SET_PROPERTY = "SET_PROPERTY";
export const RESET = "RESET";

function getSummary(conditions) {
  function getOverall(category, name, type) {
    return Math.round(
      conditions.find((c) => c.category === category && c.name === name && c.type === type)?.result,
    );
  }
  const autoVariables = conditions
    .filter((x) => AUTO_PARAM_REGEX.test(x.name))
    .reduce(
      (acc, x) => ({ ...acc, [x.name]: { result: x.result, uiConfigResult: x.uiConfigResult } }),
      {},
    );
  return {
    ...autoVariables,
    subtotal_onetime_conv: getOverall("Subtotal", "Onetime", "CONVERTED"),
    subtotal_annual_conv: getOverall("Subtotal", "Annual", "CONVERTED"),
    bigmac_onetime_eur: getOverall("Overall", "Onetime", "EUR"),
    bigmac_annual_eur: getOverall("Overall", "Annual", "EUR"),
    bigmac_onetime_usd: getOverall("Overall", "Onetime", "USD"),
    bigmac_annual_usd: getOverall("Overall", "Annual", "USD"),
    bigmac_onetime_conv: getOverall("Overall", "Onetime", "CONVERTED"),
    bigmac_annual_conv: getOverall("Overall", "Annual", "CONVERTED"),
  };
}

function runConditions(state) {
  const bigMac = state.countries.find((c) => c._id === state.values.country);
  const newConditions = simulateConditions(state.conditions, {
    dollarRate: state.exchanges.usd.rate,
    bigMacRatio: bigMac.euro_ratio,
  });
  return newConditions;
}

export const quotationReducer = (state, action) => {
  const { summary, role, ...updatedState } = { ...state };
  const { type, payload } = action;

  switch (type) {
    case SET_CONDITION:
      const selectedConditionIndex = updatedState.conditions.findIndex(
        (c) => c._id === payload._id,
      );
      if (selectedConditionIndex === -1) {
        throw new Error("Condition couldnot be found: " + payload._id);
      }
      let manual = +payload.manual || 0;
      const selectedCondition = updatedState.conditions[selectedConditionIndex];

      if (selectedCondition.name.match(/discount/gi)) {
        const maxDiscountPercent = +role.maxDiscountPercent || 0;
        manual = Math.max(0, Math.min(maxDiscountPercent, manual));
      }

      updatedState.conditions = [
        ...updatedState.conditions.slice(0, selectedConditionIndex),
        { ...selectedCondition, manual },
        ...updatedState.conditions.slice(selectedConditionIndex + 1),
      ];
      break;
    case SET_PROPERTY:
      updatedState.values = {
        ...updatedState.values,
        [payload.property]: payload.value,
      };
      break;
    case RESET:
      return initiateQuotationState(payload);
    default:
      updatedState[type] = payload;
  }

  const newConditions = runConditions(updatedState);

  const result = {
    ...updatedState,
    conditions: newConditions,
    role,
    summary: getSummary(newConditions),
  };

  return result;
};

const filterByCategory = (list, category) => {
  return list.filter((i) => i.category === category);
};

export const initiateQuotationState = (props) => {
  const {
    conditions = [],
    role = {},
    ranges = [],
    settings = [],
    countries = [],
    exchanges = [],
    values,
  } = props;
  const productSettings = filterByCategory(settings, CATEGORY_PRODUCT).map((p) => ({
    ...p,
    activated: !!p.activated,
  }));

  const result = {
    version: "0.0.1",
    _id: props._id || "",
    conditions,
    countries: countries,
    exchanges,
    productSettings,
    ranges,
    role,
    values: {
      archived: false,
      additionalRemarks: "",
      country: "eur",
      customerName: "",
      discountPercentage: 0,
      logoUrl: "",
      numberOfInterfaces: 0,
      numberOfUsers: 0,
      numberOfLegalEntities: 1,
      ...values,
    },
    summary: {
      bigmac_onetime_eur: 0,
      bigmac_annual_eur: 0,
      bigmac_onetime_usd: 0,
      bigmac_annual_usd: 0,
    },
  };

  result.conditions = runConditions(result);
  result.summary = getSummary(result.conditions);

  return result;
};
