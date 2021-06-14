import jsonata from "jsonata";

export default function simulateConditions(conditions, configs) {
  const initialData = conditions.map((c) => ({ ...c, result: 0 }));
  const iterations = [...new Set(initialData.map((d) => d.calcOrder))].sort();
  let iterationalResult = initialData;

  iterations.forEach((iter) => {
    let lineResult = iterationalResult;
    lineResult.forEach((r, index) => {
      if (iter === r.calcOrder) {
        let currentResult = 0;
        let errorText = "";
        try {
          const expression = jsonata(r.calculation);
          currentResult = expression.evaluate(
            {
              ...configs,
              Conditions: iterationalResult,
            },
            r,
          );
          if (typeof currentResult !== "number") {
            console.log({ row: r, configs, iterationalResult });
            throw new Error("Not numeric: " + currentResult);
          }
        } catch (e) {
          errorText = e.message;
          console.error(e);
        }
        lineResult = [
          ...lineResult.slice(0, index),
          { ...r, result: currentResult, errorText: errorText },
          ...lineResult.slice(index + 1),
        ];
      }
    });
    iterationalResult = lineResult;
  });

  return iterationalResult;
}
