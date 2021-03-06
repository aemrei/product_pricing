import jsonata from "jsonata";

export const AUTO_PARAM_REGEX = /^[a-z]+[a-zA-Z0-9]+$/;

export default function simulateConditions(conditions, configs) {
  let iterationalResult = conditions.map((c) => ({ ...c, result: 0, errorText: "" }));
  const iterations = [...new Set(iterationalResult.map((d) => d.calcOrder))].sort();
  let autoParams = {};

  iterations.forEach((iter) => {
    let lineResult = iterationalResult;
    lineResult.forEach((r, index) => {
      if (r.DELETED) {
        return;
      }
      if (iter === r.calcOrder) {
        let currentResult = 0;
        let uiConfigResult = {};
        let errorText = "";
        const logs = iterationalResult.map(({category, name, type, result, remarks}) => ({category, name, type, result, remarks}));
        const input = {
          ...configs,
          ...autoParams,
          Conditions: iterationalResult,
          C: iterationalResult,
          logs,
        };
        try {
          const expression = jsonata(r.calculation);
          currentResult = expression.evaluate(
            input,
            r,
          );
          if (typeof currentResult !== "number") {
            console.log({ row: r, configs, autoParams, iterationalResult });
            throw new Error("Not numeric: " + currentResult);
          }
        } catch (e) {
          errorText = e.message;
          console.error(e);
        }
        if (r.uiConfig) {
          try {
            const expression = jsonata(r.uiConfig);
            uiConfigResult = expression.evaluate(input, r);
          } catch (e) {
            errorText += "\nUIConfigError: " + e.message;
            console.error(e);
          }
        }
        if (AUTO_PARAM_REGEX.test(r.name)) {
          autoParams = {...autoParams, [r.name]: currentResult};
        }

        lineResult = [
          ...lineResult.slice(0, index),
          { ...r, result: currentResult, uiConfigResult, errorText: errorText, _input: input },
          ...lineResult.slice(index + 1),
        ];
      }
    });
    iterationalResult = lineResult;
  });

  return iterationalResult;
}
