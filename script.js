const GRAPH_CONTAINER = document.getElementById("graph-container");
const CONTENTS_BOUNDS = GRAPH_CONTAINER.getBoundingClientRect();

const WIDTH = CONTENTS_BOUNDS.width;
const HEIGHT = CONTENTS_BOUNDS.height;

const A_INPUT = document.getElementById("a");
const B_INPUT = document.getElementById("b");
const C_INPUT = document.getElementById("c");

const FUNCTIONS_CONTAINER = document.getElementById("functions");
const RESULTS_CONTAINER = document.getElementById("results");

const setFunction = (fn, p, q, a) => {
  // JUST to make sure that we don't divide by 0
  const ZOOM_RATIO = 10 / Math.abs(a === 0 ? 1 : a);

  const domainY = [p - ZOOM_RATIO, p + ZOOM_RATIO];
  const domainX = [q - ZOOM_RATIO, q + ZOOM_RATIO];

  functionPlot({
    target: "#graph",
    width: WIDTH,
    height: HEIGHT,
    yAxis: { domain: domainX },
    xAxis: { domain: domainY },
    grid: true,
    data: fn ? [{ fn }] : [{ fn: "0" }],
  });
};

const calculateFunction = (a, b, c) => {
  if (a === 0) {
    RESULTS_CONTAINER.innerHTML = "";
    FUNCTIONS_CONTAINER.innerHTML =
      "Funkcja nie jest kwadratowa. Funkcja liniowa";

    // funkcja liniowa (ax + b)
    return {
      f: `${b}x + ${c}`,
      p: 0,
      q: 0,
      delta: 0,
      zeros: [],
    };
  }

  const delta = b * b - 4 * a * c;

  const p = -b / (2 * a);
  const q = -delta / (4 * a);

  const zeros = [];

  if (delta > 0) {
    const x1 = (-b + Math.sqrt(delta)) / (2 * a);
    const x2 = (-b - Math.sqrt(delta)) / (2 * a);

    zeros.push(x1, x2);
  } else if (delta === 0) {
    const x0 = -b / (2 * a);

    zeros.push(x0);
  }

  const f = `${a}x^2 ${b < 0 ? "-" : "+"} ${Math.abs(b)}x ${
    c < 0 ? "-" : "+"
  } ${Math.abs(c)}`;

  const f_pq = `${a}(x ${p < 0 ? "+" : "-"} ${Math.abs(p)})^2 ${
    q < 0 ? "-" : "+"
  } ${Math.abs(q)}`;

  // jeśli mamy dwa miejsca zerowe to możemy zapisać funkcję w postaci iloczynowej
  const f_x1x2 =
    zeros.length === 2
      ? `${a}(x ${zeros[0] < 0 ? "+" : "-"} ${Math.abs(zeros[0])})(x ${
          zeros[1] < 0 ? "+" : "-"
        } ${Math.abs(zeros[1])})`
      : undefined;

  FUNCTIONS_CONTAINER.innerHTML = `
    <h3>Funkcja w postatci ogólnej: f(x) = ${f}</h3>
    <h3>Funkcja w postatci kanonicznej: f(x) = ${f_pq}</h3>
    ${f_x1x2 ? `<h3>Funkcja w postaci iloczynowej: f(x) = ${f_x1x2}</h3>` : ""}
  `;

  return {
    f: `${a} * x^2 + ${b} * x + ${c}`,
    delta,
    p,
    q,
    zeros,
  };
};

const setResults = (delta, zeros) => {
  RESULTS_CONTAINER.innerHTML = `
    <div class="text">Δ: ${delta}</div>
    <div class="text">${
      zeros.length > 1
        ? "X1, X2:"
        : zeros.length === 0
        ? "BRAK miejsc przcięcia"
        : "X0: "
    } ${zeros.join(", ")}</div>
  `;
};

const onInputChange = () => {
  const a = isNaN(Number(A_INPUT.value)) ? 0 : Number(A_INPUT.value);
  const b = isNaN(Number(B_INPUT.value)) ? 0 : Number(B_INPUT.value);
  const c = isNaN(Number(C_INPUT.value)) ? 0 : Number(C_INPUT.value);

  const { f, p, q, delta, zeros } = calculateFunction(a, b, c);

  setFunction(f, p, q, a);
  a != 0 && setResults(delta, zeros);
};

A_INPUT.addEventListener("input", onInputChange);
B_INPUT.addEventListener("input", onInputChange);
C_INPUT.addEventListener("input", onInputChange);

functionPlot({
  target: "#graph",
  width: WIDTH,
  height: HEIGHT,
  yAxis: { domain: [-10, 10] },
  xAxis: { domain: [-10, 10] },
  grid: true,
  data: [
    {
      fn: "x^2",
    },
  ],
});
