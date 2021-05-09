import { CATEGORY_INTERFACE, CATEGORY_PRODUCT, CATEGORY_USER } from "../db/settings";

export const SET_PRODUCT_ACTIVATION = "SET_PRODUCT_ACTIVATION";
export const SET_PROPERTY = "SET_PROPERTY";

const getActiveRangeValue = (ranges, category, count) => {
  if (count === 0) {
    return 0;
  }

  return ranges
    .filter((l) => l.category === category)
    .reduce((acc, item) => {
      const upper = Math.min(item.upperLimit, Math.max(item.lowerLimit, count));
      const lower = Math.min(upper, item.lowerLimit);
      const newCost = (upper - lower) * item.value;
      return acc + newCost;
    }, 0);
};

function calculatePrice(state) {
  const { settingsAsObject, values, ranges, countries, exchangeRates } = state;
  const prodouct_prices = state.productSettings.reduce((x, y) => x + y.activated * y.value, 0);

  const interface_baseprice = values.interfaceActivated * settingsAsObject.interfaceBasePrice.value;
  const interface_countprice = getActiveRangeValue(ranges, CATEGORY_INTERFACE, +values.numberOfInterfaces);
  const interface_prices = interface_baseprice + interface_countprice;

  const user_baseprice = 0;
  const user_countprice = getActiveRangeValue(ranges, CATEGORY_USER, +values.numberOfUsers);
  const user_prices = user_baseprice + user_countprice;

  const lagalEntityPrice = (values.numberOfLegalEntities - 1) * settingsAsObject.perLegalEntity.value;

  const onetime_eur = prodouct_prices + interface_prices + user_prices + lagalEntityPrice;
  const annual_eur = Math.round((onetime_eur * settingsAsObject.maintenanceFeePerCent.value) / 100);

  const bigMacRate = countries.find(c => c._id === values.country);
  if (!bigMacRate) {
    throw new Error("Country could not found", values.country);
  }

  const dollar_rate = exchangeRates.find(c => c._id === "USD");
  if (!dollar_rate) {
    throw new Error("USD rate could not found", values.country);
  }

  const bigmac_onetime_eur = Math.round(onetime_eur * bigMacRate.euro_ratio);
  const bigmac_annual_eur = Math.round(annual_eur * bigMacRate.euro_ratio);
  const bigmac_onetime_usd = Math.round(bigmac_onetime_eur * dollar_rate.rate);
  const bigmac_annual_usd = Math.round(bigmac_annual_eur * dollar_rate.rate);

  return {
    onetime_eur,
    annual_eur,
    bigmac_onetime_eur,
    bigmac_annual_eur,
    bigmac_onetime_usd,
    bigmac_annual_usd,

    interface_countprice,
    user_countprice,
    lagalEntityPrice,
  };
}

export const quotationReducer = (state, action) => {
  const { summary, ...updatedState } = { ...state };

  switch (action.type) {
    case SET_PRODUCT_ACTIVATION:
      const basePrice = updatedState.productSettings.find(p => p._id === "base");
      basePrice.activated = false;
      updatedState.productSettings = updatedState.productSettings.map((p) => {
        if (p._id === action.payload._id) {
          return {
            ...p,
            activated: action.payload.activated,
          };
        }
        return p;
      });
      basePrice.activated = updatedState.productSettings.some(p => p.activated);
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

export const initiateQuotationState = ({ ranges = [], settings = [], countries = [], exchangeRates = [] }) => {
  const productSettings = filterByCategory(settings, CATEGORY_PRODUCT).map((p) => ({
    ...p,
    activated: false,
  }));

  const settingsAsObject = settings.reduce((obj, set) => {
    obj[set._id] = set;
    return obj;
  }, {});

  const result = {
    version: "0.0.1",
    countries: countries,
    exchangeRates,
    productSettings,
    settingsAsObject,
    ranges,
    values: {
      interfaceActivated: false,
      additionalRemarks: "",
      country: "eur",
      customerName: "",
      numberOfInterfaces: 0,
      numberOfUsers: 0,
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
