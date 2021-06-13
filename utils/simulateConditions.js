export default function simulateConditions(data) {
  let result = [...data];
  const iterations = [...new Set(data.map((d) => d.calcOrder))].sort();

  iterations.forEach((iter) => {
    result.forEach((r, index) => {
      if (iter === r.calcOrder) {
        result = [
          ...result.slice(0, index),
          { ...r, result: r.result + 1 },
          ...result.slice(index + 1),
        ];
      }
    });
  });

  return result;
}
