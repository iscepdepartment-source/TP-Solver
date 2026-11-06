
(function (root) {
  'use strict';

  const round = (x) => Math.round(x * 1e9) / 1e9; // avoid floating point noise
  const sum = (arr) => round(arr.reduce((a, b) => a + b, 0));

  function balanceProblem(costs, supply, demand) {
    const m = supply.length;
    const n = demand.length;
    const rowLabels = Array.from({ length: m }, (_, i) => 'S' + (i + 1));
    const colLabels = Array.from({ length: n }, (_, j) => 'D' + (j + 1));
    const totalSupply = sum(supply);
    const totalDemand = sum(demand);

    const c = costs.map((r) => r.slice());
    const s = supply.slice();
    const d = demand.slice();
    let dummy = null;

    if (totalSupply > totalDemand) {
      
      c.forEach((r) => r.push(0));
      d.push(round(totalSupply - totalDemand));
      colLabels.push('Dummy D');
      dummy = { type: 'destination', quantity: round(totalSupply - totalDemand) };
    } else if (totalDemand > totalSupply) {
      
      c.push(new Array(n).fill(0));
      s.push(round(totalDemand - totalSupply));
      rowLabels.push('Dummy S');
      dummy = { type: 'source', quantity: round(totalDemand - totalSupply) };
    }

    return {
      costs: c, supply: s, demand: d,
      rowLabels, colLabels, dummy,
      totalSupply, totalDemand,
      balanced: dummy === null
    };
  }

 
  function solveLCM(costs, supply, demand, tieBreak, initialAlloc) {
    tieBreak = tieBreak || 'first';
    const original = {
      costs: costs.map((r) => r.slice()),
      supply: supply.slice(),
      demand: demand.slice()
    };
    const bal = balanceProblem(costs, supply, demand);
    const m = bal.supply.length;
    const n = bal.demand.length;

    const s = bal.supply.slice();
    const d = bal.demand.slice();
    const alloc = Array.from({ length: m }, () => new Array(n).fill(0));
    const seeded = Array.from({ length: m }, () => new Array(n).fill(0));
    (initialAlloc || []).forEach((row, i) => row.forEach((value, j) => {
      seeded[i][j] = value;
      alloc[i][j] = value;
      s[i] = round(s[i] - value);
      d[j] = round(d[j] - value);
    }));
    const rowActive = s.map((v) => v > 0); // zero-supply rows start crossed out
    const colActive = d.map((v) => v > 0); // zero-demand columns start crossed out
    const steps = [];

    const cellName = (i, j) => bal.rowLabels[i] + ' \u2192 ' + bal.colLabels[j];

    let guard = 0;
    while (guard++ < m * n + 5) {
     
      let min = Infinity;
      for (let i = 0; i < m; i++) {
        if (!rowActive[i]) continue;
        for (let j = 0; j < n; j++) {
          if (colActive[j] && bal.costs[i][j] < min) min = bal.costs[i][j];
        }
      }
      if (min === Infinity) break; // nothing left

      const ties = [];
      for (let i = 0; i < m; i++) {
        if (!rowActive[i]) continue;
        for (let j = 0; j < n; j++) {
          if (colActive[j] && bal.costs[i][j] === min) ties.push([i, j]);
        }
      }

      let pick = ties[0];
      if (tieBreak === 'max') {
        let best = -1;
        ties.forEach(([i, j]) => {
          const q = Math.min(s[i], d[j]);
          if (q > best) { best = q; pick = [i, j]; }
        });
      }
      const [i, j] = pick;

      const supBefore = s[i];
      const demBefore = d[j];
      const q = round(Math.min(supBefore, demBefore));

      // 3. update supply and demand
      s[i] = round(supBefore - q);
      d[j] = round(demBefore - q);
      alloc[i][j] = round(alloc[i][j] + q);

      const rowElim = s[i] === 0;
      const colElim = d[j] === 0;
      if (rowElim) rowActive[i] = false;
      if (colElim) colActive[j] = false;

      steps.push({
        step: steps.length + 1,
        row: i, col: j,
        cell: cellName(i, j),
        cost: min,
        ties: ties.map(([a, b]) => cellName(a, b)),
        supplyBefore: supBefore,
        demandBefore: demBefore,
        quantity: q,
        supplyAfter: s[i],
        demandAfter: d[j],
        rowEliminated: rowElim,
        colEliminated: colElim,
        both: rowElim && colElim,
        snapshot: {
          alloc: alloc.map((r) => r.slice()),
          supply: s.slice(),
          demand: d.slice(),
          rowActive: rowActive.slice(),
          colActive: colActive.slice()
        }
      });
    }

   
    const terms = [];
    let total = 0;
    for (let i = 0; i < m; i++) {
      for (let j = 0; j < n; j++) {
        if (alloc[i][j] > 0) {
          const t = round(bal.costs[i][j] * alloc[i][j]);
          total = round(total + t);
          terms.push({
            row: i, col: j, cell: cellName(i, j),
            cost: bal.costs[i][j], quantity: alloc[i][j], product: t
          });
        }
      }
    }

    const occupied = terms.length;
    const required = m + n - 1;
    const degenerate = occupied < required;

    return {
      original, balanced: bal, steps, alloc, terms, total, initialAlloc: seeded,
      occupied, required, degenerate, tieBreak,
      m, n
    };
  }

  const api = { balanceProblem, solveLCM };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.LCM = api;
})(typeof window !== 'undefined' ? window : globalThis);
