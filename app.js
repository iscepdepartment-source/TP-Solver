
(function () {
  'use strict';

  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  const fmt = (x) => Number(x).toLocaleString('en-US', { maximumFractionDigits: 4 });
  const CURRENCY_SIGNS = { USD: '$', PHP: '₱', EUR: '€', GBP: '£' };
  const fmtMoney = (x, currency) => (CURRENCY_SIGNS[currency] || CURRENCY_SIGNS.USD) + fmt(x);
  const LANGUAGE_KEY = 'tp_lcm_language';
  const THEME_KEY = 'tp_lcm_theme';
  const translations = {
    method: ['Least Cost Method', 'Pamamaraang Least Cost'],
    dashboard: ['Dashboard', 'Pangunahing Pahina'],
    newProblem: ['New Problem', 'Bagong Problema'],
    practice: ['Practice Mode', 'Pagsasanay'],
    results: ['Results', 'Mga Resulta'],
    about: ['About LCM', 'Tungkol sa LCM'],
    themeDark: ['Dark mode', 'Dark mode'],
    themeLight: ['Light mode', 'Light mode'],
    sidebarFoot: ['Operations Research<br>Initial Feasible Solution', 'Pananaliksik sa Operasyon<br>Paunang Posibleng Solusyon'],
    language: ['Language', 'Wika'],
    problemsSolved: ['Total Problems Solved', 'Kabuuang Problemang Nasagot'],
    sourcesLast: ['Sources (last problem)', 'Mga Pinagmulan (huling problema)'],
    destinationsLast: ['Destinations (last problem)', 'Mga Destinasyon (huling problema)'],
    recentCalculations: ['Recent Calculations', 'Mga Kamakailang Kalkulasyon'],
    clear: ['Clear', 'I-clear'],
    date: ['Date', 'Petsa'],
    size: ['Size', 'Sukat'],
    planType: ['Plan type', 'Uri ng plano'],
    manualPlan: ['Manual shipment plan', 'Manu-manong plano ng padala'],
    balanceStatus: ['Balance', 'Balanse'],
    positiveShipments: ['Positive shipment quantities', 'Mga positibong dami ng padala'],
    completePlan: ['Complete manual plan', 'Kumpletong manu-manong plano'],
    totalCost: ['Total Cost', 'Kabuuang Gastos'],
    status: ['Status', 'Kalagayan'],
    problemSize: ['1. Problem Size', '1. Laki ng Problema'],
    sourcesCount: ['Number of sources (rows)', 'Bilang ng mga pinagmulan (mga hilera)'],
    destinationsCount: ['Number of destinations (columns)', 'Bilang ng mga destinasyon (mga kolum)'],
    currency: ['Currency sign', 'Simbolo ng pera'],
    generateMatrix: ['Generate Matrix', 'Buuin ang Matrix'],
    loadSample: ['Load Sample Problem', 'Mag-load ng Halimbawang Problema'],
    transportMatrix: ['2. Transportation Matrix', '2. Matrix ng Transportasyon'],
    matrixHelp: ['Enter each source supply and destination demand in the margin boxes. Enter unit costs in the small top-right boxes and shipment quantities in the larger boxes. Supply and demand are independent values; the balance status compares their totals.', 'Ilagay ang supply ng bawat pinagmulan at demand ng bawat destinasyon sa mga kahon sa gilid. Ilagay ang gastos bawat yunit sa maliit na kahon sa kanang itaas at dami ng padala sa malaking kahon. Magkahiwalay na halaga ang supply at demand; inihahambing ng status ng balanse ang kabuuan ng mga ito.'],
    allocationStatusTitle: ['Shipment totals by source and destination', 'Kabuuang padala bawat pinagmulan at destinasyon'],
    supplyTotalLabel: ['Supply', 'Supply'],
    demandTotalLabel: ['Demand', 'Demand'],
    shipmentQuantity: ['Shipment quantity', 'Dami ng padala'],
    sourceStatus: ['Sources', 'Mga Pinagmulan'],
    destinationStatus: ['Destinations', 'Mga Destinasyon'],
    assigned: ['shipped', 'naipadala'],
    received: ['received', 'natanggap'],
    originalValues: ['Supply and demand are the values entered independently for each source and destination', 'Magkahiwalay na inilagay ang supply at demand ng bawat pinagmulan at destinasyon'],
    afterStarting: ['The dummy row or column balances the totals for reference only. The entered shipment plan is not changed.', 'Pantay lang sa kabuuan ang dummy row o column bilang sanggunian. Hindi binabago ang inilagay na plano ng padala.'],
    finalAllocationExplanation: ['Compare each row shipment total with its source supply and each column shipment total with its destination demand. The grand totals may differ if the problem is unbalanced.', 'Ihambing ang kabuuang padala ng bawat hilera sa supply ng pinagmulan at ang kabuuang natanggap ng bawat kolum sa demand ng destinasyon. Maaaring magkaiba ang kabuuang supply at demand kung unbalanced ang problema.'],
    reset: ['Reset', 'I-reset'],
    solve: ['Calculate Shipment Plan', 'Kuwentahin ang Plano ng Padala'],
    manualPlanNote: ['Enter supply and demand separately from shipment quantities. The tool checks whether their totals balance and compares each entered shipment total with its required supply or demand.', 'Ilagay nang hiwalay ang supply at demand mula sa dami ng padala. Sinusuri ng system kung magkapantay ang kabuuan ng mga ito at inihahambing ang bawat kabuuang padala sa kinakailangang supply o demand.'],
    manualPlanSummary: ['The entered quantities are the final plan. No additional allocations were generated automatically.', 'Ang mga inilagay na quantity ang panghuling plano. Walang idinagdag na alokasyon ang system.'],
    manualAllocationExplanation: ['This is part of the complete shipment plan you entered. The row shipment sum is compared with its separately entered supply, and the column shipment sum is compared with its separately entered demand.', 'Bahagi ito ng kumpletong plano ng padala na inilagay mo. Inihahambing ang suma ng mga padala sa hilera sa hiwalay na inilagay na supply nito, at ang suma sa kolum sa hiwalay na inilagay na demand nito.'],
    allocationsCount: ['Positive shipment quantities', 'Mga positibong dami ng padala'],
    enterMargins: ['Enter supply and demand values to check balance.', 'Ilagay ang mga halaga ng supply at demand upang masuri ang balanse.'],
    balanceHowTitle: ['How to check balance', 'Paano suriin kung balanse'],
    balanceEqualExplain: ['Add all source supplies and all destination demands. Since the totals are equal, the problem is BALANCED.', 'Pagsamahin ang lahat ng supply ng mga pinagmulan at demand ng mga destinasyon. Dahil magkapantay ang kabuuan, BALANSE ang problema.'],
    balanceSupplyExplain: ['Add all source supplies and all destination demands. Supply is greater by {difference}, so the problem is UNBALANCED. A dummy destination can represent the excess supply.', 'Pagsamahin ang lahat ng supply ng mga pinagmulan at demand ng mga destinasyon. Mas mataas ang supply nang {difference}, kaya HINDI BALANSE ang problema. Maaaring kumatawan ang dummy destination sa sobrang supply.'],
    balanceDemandExplain: ['Add all source supplies and all destination demands. Demand is greater by {difference}, so the problem is UNBALANCED. A dummy source can represent the extra demand.', 'Pagsamahin ang lahat ng supply ng mga pinagmulan at demand ng mga destinasyon. Mas mataas ang demand nang {difference}, kaya HINDI BALANSE ang problema. Maaaring kumatawan ang dummy source sa sobrang demand.'],
    matches: ['matches', 'tugma'],
    shortBy: ['short by', 'kulang ng'],
    overBy: ['over by', 'sobra ng'],
    planFulfillment: ['Shipment plan compared with requirements', 'Paghahambing ng plano ng padala sa mga kinakailangan'],
    dummyForBalanceOnly: ['A dummy row or column is shown to balance the totals for comparison. No shipments are automatically assigned to it.', 'Ipinapakita ang dummy row o column upang mapantay ang kabuuan para sa paghahambing. Walang awtomatikong inilalagay na padala rito.'],
    manualTotalNote: ['The total is calculated from the exact quantities entered above; the method did not choose or optimize those quantities.', 'Kinuwenta ang kabuuang gastos mula mismo sa mga inilagay na quantity; hindi pinili o in-optimize ng pamamaraan ang mga quantity na iyon.'],
    chatOpen: ['Help with this result', 'Tulong sa resultang ito'],
    chatTitle: ['Understand this result', 'Unawain ang Resulta'],
    chatSubtitle: ['Choose a question about this problem', 'Pumili ng tanong tungkol sa problemang ito'],
    chatClose: ['Close', 'Isara'],
    chatQuestionBalance: ['What does the balance status mean?', 'Ano ang ibig sabihin ng status ng balanse?'],
    chatQuestionTotals: ['How were the supply and demand totals calculated?', 'Paano kinuwenta ang kabuuang supply at demand?'],
    chatQuestionFulfillment: ['Does my shipment plan meet the requirements?', 'Natugunan ba ng plano ng padala ang mga kinakailangan?'],
    chatQuestionCost: ['How was the total transportation cost calculated?', 'Paano kinuwenta ang kabuuang gastos sa transportasyon?'],
    chatNote: ['Answers are calculated from this problem. No AI or internet connection is needed.', 'Kinukuwenta ang mga sagot mula sa problemang ito. Hindi kailangan ng AI o internet connection.'],
    noResults: ['No solved problem yet.', 'Wala pang nalutas na problema.'],
    enterProblem: ['Enter a problem', 'Maglagay ng problema'],
    printResults: ['Print Results', 'I-print ang mga Resulta'],
    exportPdf: ['Export PDF', 'I-export bilang PDF'],
    solveAnother: ['Solve Another Problem', 'Lutasin ang Ibang Problema'],
    aboutTitle: ['The Least Cost Method (Matrix Minima)', 'Pamamaraang Least Cost (Pinakamababang Halaga sa Matrix)'],
    aboutStep1: ['Balance the problem (add a dummy destination or source with zero costs if total supply &ne; total demand).', 'Pantayin ang problema (magdagdag ng kunwaring destinasyon o pinagmulan na may serong gastos kung hindi magkapantay ang kabuuang suplay at demand).'],
    aboutStep2: ['Find the cell with the lowest transportation cost among the rows and columns still active.', 'Hanapin ang kahong may pinakamababang gastos sa mga aktibong hilera at kolum.'],
    aboutStep3: ['Allocate <code>MIN(supply, demand)</code> to that cell.', 'Ilaan ang <code>MIN(suplay, demand)</code> sa kahong iyon.'],
    aboutStep4: ['Subtract the allocation from that row\'s supply and that column\'s demand.', 'Ibawas ang alokasyon sa suplay ng hilera at demand ng kolum na iyon.'],
    aboutStep5: ['Cross out the row if its supply is 0, and the column if its demand is 0.', 'Alisin ang hilera kapag sero na ang suplay nito, at ang kolum kapag sero na ang demand nito.'],
    aboutStep6: ['Repeat until every supply and demand is satisfied.', 'Ulitin hanggang matugunan ang lahat ng suplay at demand.'],
    aboutTies: ['<strong>Ties:</strong> if several cells share the lowest cost, a consistent rule can be used to choose one. When an allocation exhausts both a row and a column, both are crossed out and the solution can be <em>degenerate</em>.', '<strong>Kapag tabla:</strong> kung maraming kahon ang may pinakamababang gastos, maaaring gumamit ng pare-parehong panuntunan sa pagpili. Kapag sabay na naubos ang suplay at demand sa isang alokasyon, inaalis ang hilera at kolum at maaaring maging <em>degenerate</em> ang solusyon.'],
    aboutImportant: ['<strong>Important:</strong> the Least Cost Method gives an <em>initial basic feasible solution</em>. It is usually better than the Northwest Corner Method, but it does <strong>not</strong> guarantee an optimal solution. Use the MODI (u-v) method or the stepping-stone method to test for optimality.', '<strong>Mahalaga:</strong> nagbibigay ang Pamamaraang Least Cost ng <em>paunang basic feasible solution</em>. Hindi nito <strong>ginagarantiya</strong> ang pinakamahusay na solusyon. Gamitin ang MODI (u-v) o stepping-stone method upang suriin kung optimal ito.']
  };
  const taglishOverrides = {
    method: 'Least Cost Method',
    dashboard: 'Dashboard',
    newProblem: 'New Problem',
    practice: 'Practice Mode',
    results: 'Results',
    about: 'About LCM',
    themeDark: 'Dark mode',
    themeLight: 'Light mode',
    language: 'Wika / Language',
    recentCalculations: 'Recent Calculations',
    problem: 'Practice Problem',
    manualPlan: 'Manual shipment plan',
    balanceStatus: 'Balance',
    totalCost: 'Total Cost',
    problemSize: 'Problem Size',
    transportMatrix: 'Transportation Matrix',
    solve: 'Calculate Shipment Plan',
    reset: 'Reset',
    chatOpen: 'Help with this result',
    chatTitle: 'Understand this result',
    noResults: 'Wala pang solved problem.'
  };
  const taglishTerms = [
    ['HINDI BALANSE', 'UNBALANCED'],
    ['Pamamaraang Least Cost', 'Least Cost Method'],
    ['gastos bawat yunit', 'unit cost'],
    ['dami ng padala', 'shipment quantity'],
    ['balanseng', 'balanced'],
    ['pinakamababang', 'lowest'],
    ['pinakamataas', 'highest'],
    ['pagkakaiba', 'difference'],
    ['alokasyon', 'allocation'],
    ['kabuuang', 'total'],
    ['destinasyon', 'destination'],
    ['pinagmulan', 'source'],
    ['kunwaring', 'dummy'],
    ['suplay', 'supply'],
    ['gastos', 'cost'],
    ['problema', 'problem'],
    ['balanse', 'balanced'],
    ['hilera', 'row'],
    ['kolum', 'column'],
    ['serong', 'zero'],
    ['Ilagay', 'I-enter'],
    ['Suriin', 'I-check'],
    ['Kuwentahin', 'I-compute']
  ];
  const toTaglish = (value) => taglishTerms.reduce((result, [source, replacement]) =>
    result.replace(new RegExp(source, 'gi'), (match) =>
      match[0] === match[0].toUpperCase()
        ? replacement[0].toUpperCase() + replacement.slice(1)
        : replacement), value);
  window.transportationToTaglish = toTaglish;
  const savedLanguage = load(LANGUAGE_KEY, 'en');
  let language = ['tl', 'tl-en'].includes(savedLanguage) ? savedLanguage : 'en';
  let theme = document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
  const tr = (english, tagalog) => language === 'tl' ? tagalog : language === 'tl-en' ? toTaglish(tagalog) : english;
  const staticText = (key) => {
    const values = translations[key] || ['', ''];
    if (language === 'tl-en') return taglishOverrides[key] || toTaglish(values[1]);
    return values[language === 'tl' ? 1 : 0];
  };

  function applyLanguage() {
    document.documentElement.lang = language === 'tl' ? 'fil' : 'en';
    $('#languageSelect').value = language;
    $('#languageSelect').setAttribute('aria-label', staticText('language'));
    $$('[data-i18n]').forEach((el) => {
      const translation = staticText(el.dataset.i18n);
      if (translation) el.innerHTML = translation;
    });
    $$('[data-i18n-placeholder]').forEach((el) => {
      el.placeholder = staticText(el.dataset.i18nPlaceholder);
    });
    updateThemeControl();
    $('#pageTitle').textContent = ({
      dashboard: staticText('dashboard'),
      input: staticText('newProblem'),
      practice: staticText('practice'),
      results: staticText('results'),
      about: staticText('about')
    })[$('.sidebar .nav-link.active').dataset.view];
    renderDashboard();
    updateMarginalTotals();
    if (current) renderResults(current.input, current.result, current.currency);
    window.dispatchEvent(new CustomEvent('transportation-language-changed', { detail: { language: language } }));
  }

  function updateThemeControl() {
    const isDark = theme === 'dark';
    const label = $('#themeToggleLabel');
    const nextThemeKey = isDark ? 'themeLight' : 'themeDark';
    label.textContent = staticText(nextThemeKey);
    label.dataset.i18n = nextThemeKey;
    $('#themeToggle').setAttribute('aria-pressed', String(isDark));
    $('#themeToggle').setAttribute('aria-label', staticText(nextThemeKey));
    $('#themeToggle i').className = isDark ? 'bi bi-sun' : 'bi bi-moon-stars';
  }

  function setTheme(nextTheme) {
    theme = nextTheme === 'dark' ? 'dark' : 'light';
    document.documentElement.dataset.theme = theme;
    updateThemeControl();
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (error) {
      console.warn('Theme preference could not be saved in this browser.');
    }
  }

  const SAMPLE = {
    costs: [[4, 8, 8], [16, 24, 16], [8, 16, 24]],
    supply: [76, 82, 77],
    demand: [72, 102, 61],
    initialAlloc: [[50, 22, 4], [12, 50, 20], [10, 30, 37]]
  };

  const STORE = { solved: 'tp_lcm_solved', history: 'tp_lcm_history', last: 'tp_lcm_last' };
  let current = null; // { input, result }
  let guidedIndex = 0;
  let guidedShowExplanation = false;
  let guidedShowCalculation = false;


  function load(key, fallback) {
    try { const v = JSON.parse(localStorage.getItem(key)); return v == null ? fallback : v; }
    catch (e) { return fallback; }
  }
  function save(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* storage unavailable */ }
  }


  function showView(name) {
    $$('.view').forEach((v) => v.classList.add('d-none'));
    $('#view-' + name).classList.remove('d-none');
    $$('.sidebar .nav-link').forEach((a) => a.classList.toggle('active', a.dataset.view === name));
    $('#pageTitle').textContent = ({
      dashboard: staticText('dashboard'),
      input: staticText('newProblem'),
      practice: staticText('practice'),
      results: staticText('results'),
      about: staticText('about')
    })[name];
    $('#sidebar').classList.remove('open');
    $('#studentChat').hidden = name !== 'results' || !current;
    if (name === 'dashboard') renderDashboard();
    window.scrollTo(0, 0);
  }

  function showAlert(msg, type) {
    const box = $('#alertBox');
    box.innerHTML = '<div class="alert alert-' + (type || 'danger') + ' alert-dismissible fade show" role="alert">' +
      msg + '<button type="button" class="btn-close" data-bs-dismiss="alert"></button></div>';
    window.scrollTo(0, 0);
  }
  function clearAlert() { $('#alertBox').innerHTML = ''; }


  function renderDashboard() {
    const history = load(STORE.history, []);
    $('#statSolved').textContent = load(STORE.solved, 0);
    const last = history[0];
    $('#statSources').textContent = last ? last.input.supply.length : 0;
    $('#statDest').textContent = last ? last.input.demand.length : 0;

    const body = $('#historyBody');
    if (!history.length) {
      body.innerHTML = '<tr><td colspan="7" class="text-center text-muted py-4">' +
        tr('No calculations yet. Click <strong>New Problem</strong> to start.', 'Wala pang kalkulasyon. I-click ang <strong>Bagong Problema</strong> upang magsimula.') + '</td></tr>';
      return;
    }
    body.innerHTML = history.map((h, idx) =>
      '<tr>' +
      '<td>' + (idx + 1) + '</td>' +
      '<td>' + h.date + '</td>' +
      '<td>' + h.input.supply.length + ' &times; ' + h.input.demand.length + '</td>' +
      '<td>' + (h.tie === 'manual' ? staticText('manualPlan') : tr('Least Cost Method', 'Pamamaraang Least Cost')) + '</td>' +
      '<td><strong>' + fmtMoney(h.total, h.currency) + '</strong></td>' +
      '<td>' + (Math.abs(h.input.supply.reduce((a, b) => a + b, 0) - h.input.demand.reduce((a, b) => a + b, 0)) <= 1e-9
        ? '<span class="badge text-bg-success">' + tr('BALANCED', 'BALANSE') + '</span>'
        : '<span class="badge text-bg-warning">' + tr('UNBALANCED', 'HINDI BALANSE') + '</span>') + '</td>' +
      '<td class="text-end text-nowrap">' +
      '<button class="btn btn-sm btn-outline-primary me-1" data-view-hist="' + idx + '">' + tr('View', 'Tingnan') + '</button>' +
      '<button class="btn btn-sm btn-outline-secondary" data-edit-hist="' + idx + '">' + tr('Edit', 'I-edit') + '</button></td>' +
      '</tr>').join('');
  }

  function pushHistory(input, result, currency) {
    const history = load(STORE.history, []);
    history.unshift({
      date: new Date().toLocaleString(),
      input: input, tie: 'manual',
      total: result.total, degenerate: result.degenerate, currency: currency
    });
    save(STORE.history, history.slice(0, 10));
    save(STORE.solved, load(STORE.solved, 0) + 1);
  }


  function readSize() {
    const m = parseInt($('#inSources').value, 10);
    const n = parseInt($('#inDest').value, 10);
    if (!Number.isInteger(m) || !Number.isInteger(n) || m < 1 || n < 1 || m > 10 || n > 10) return null;
    return { m, n };
  }

  // Capture what the user already typed so resizing keeps existing values
  function captureValues() {
    const cost = {}, alloc = {}, sup = {}, dem = {};
    $$('.cost-in').forEach((e) => { cost[e.dataset.i + ',' + e.dataset.j] = e.value; });
    $$('.alloc-in').forEach((e) => { alloc[e.dataset.i + ',' + e.dataset.j] = e.value; });
    $$('.sup-in').forEach((e) => { sup[e.dataset.i] = e.value; });
    $$('.dem-in').forEach((e) => { dem[e.dataset.j] = e.value; });
    return { cost, alloc, sup, dem };
  }

  function updateCostCurrencySigns() {
    const sign = CURRENCY_SIGNS[$('#currency').value] || CURRENCY_SIGNS.USD;
    $$('.cost-entry-symbol').forEach((el) => { el.textContent = sign; });
  }

  function buildMatrix(prefill) {
    const size = readSize();
    if (!size) {
      showAlert(tr('Number of sources and destinations must be whole numbers from 1 to 10.', 'Ang bilang ng pinagmulan at destinasyon ay dapat buong bilang mula 1 hanggang 10.'));
      return false;
    }
    clearAlert();
    const { m, n } = size;
    const pf = prefill || { cost: {}, alloc: {}, sup: {}, dem: {} };
    const val = (v) => (v === undefined || v === null ? '' : v);

    let html = '<thead><tr><th></th>';
    for (let j = 0; j < n; j++) html += '<th>D' + (j + 1) + '</th>';
    html += '<th>' + tr('Supply', 'Suplay') + '</th></tr></thead><tbody>';
    for (let i = 0; i < m; i++) {
      html += '<tr><th class="row-label">S' + (i + 1) + '</th>';
      for (let j = 0; j < n; j++) {
        html += '<td class="cost-entry-cell"><input type="number" min="0" step="any" class="form-control form-control-sm alloc-in" data-i="' + i + '" data-j="' + j +
          '" aria-label="' + staticText('shipmentQuantity') + ' S' + (i + 1) + ' ' + tr('to', 'papuntang') + ' D' + (j + 1) +
          '" value="' + val(pf.alloc && pf.alloc[i + ',' + j]) + '"><div class="cost-entry-control"><span class="cost-entry-symbol" aria-hidden="true">' +
          (CURRENCY_SIGNS[$('#currency').value] || CURRENCY_SIGNS.USD) + '</span><input type="number" min="0" step="any" class="form-control form-control-sm cost-in" data-i="' + i + '" data-j="' + j +
          '" aria-label="' + tr('Unit cost', 'Gastos bawat yunit') + ' S' + (i + 1) + ' ' + tr('to', 'papuntang') + ' D' + (j + 1) + '" value="' + val(pf.cost[i + ',' + j]) + '"></div></td>';
      }
      html += '<td class="supply-cell"><input type="number" min="0" step="any" class="form-control form-control-sm sup-in" data-i="' + i +
        '" aria-label="' + tr('Supply for source', 'Supply ng pinagmulan') + ' S' + (i + 1) + '" value="' + val(pf.sup && pf.sup[i]) + '"></td></tr>';
    }
    html += '<tr><th class="row-label">' + tr('Demand', 'Demand') + '</th>';
    for (let j = 0; j < n; j++) {
      html += '<td class="demand-cell"><input type="number" min="0" step="any" class="form-control form-control-sm dem-in" data-j="' + j +
        '" aria-label="' + tr('Demand for destination', 'Demand ng destinasyon') + ' D' + (j + 1) + '" value="' + val(pf.dem && pf.dem[j]) + '"></td>';
    }
    html += '<td class="lab grand-total-cell" id="totalsCell">-</td></tr></tbody>';
    $('#inputMatrix').innerHTML = html;
    updateCostCurrencySigns();
    updateMarginalTotals();
    return true;
  }

  function updateBalanceBadge() {
    const supplyInputs = $$('.sup-in');
    const demandInputs = $$('.dem-in');
    const badge = $('#balanceBadge');
    if (supplyInputs.some((input) => input.value.trim() === '') || demandInputs.some((input) => input.value.trim() === '')) {
      const totalCell = $('#totalsCell');
      if (totalCell) totalCell.innerHTML = grandTotalsMarkup(NaN, NaN);
      badge.className = 'badge text-bg-secondary';
      badge.textContent = staticText('enterMargins');
      $('#balanceExplanation').textContent = staticText('enterMargins');
      return;
    }
    const sup = supplyInputs.reduce((a, e) => a + (parseFloat(e.value) || 0), 0);
    const dem = demandInputs.reduce((a, e) => a + (parseFloat(e.value) || 0), 0);
    const totalCell = $('#totalsCell');
    if (totalCell) totalCell.innerHTML = grandTotalsMarkup(sup, dem);
    let text = tr('Supply ', 'Suplay ') + fmt(sup) + ' | ' + tr('Demand ', 'Demand ') + fmt(dem);
    let cls = 'text-bg-success';
    if (Math.abs(sup - dem) > 1e-9) {
      cls = 'text-bg-warning';
      const difference = fmt(Math.abs(sup - dem));
      text = tr('UNBALANCED', 'HINDI BALANSE') + ' — ' + text +
        (sup > dem
          ? tr(' | Excess supply: a dummy destination will be added', ' | Sobra ang suplay: magdaragdag ng kunwaring destinasyon')
          : tr(' | Excess demand: a dummy source will be added', ' | Sobra ang demand: magdaragdag ng kunwaring pinagmulan'));
      $('#balanceExplanation').textContent =
        (sup > dem ? staticText('balanceSupplyExplain') : staticText('balanceDemandExplain')).replace('{difference}', difference);
    } else {
      text = tr('BALANCED', 'BALANSE') + ' — ' + text;
      $('#balanceExplanation').textContent = staticText('balanceEqualExplain');
    }
    badge.className = 'badge ' + cls;
    badge.textContent = text;
  }

  function grandTotalsMarkup(supply, demand) {
    const format = (value) => Number.isFinite(value) ? fmt(value) : '—';
    if (Number.isFinite(supply) && Number.isFinite(demand) && Math.abs(supply - demand) <= 1e-9) {
      return '<div class="grand-total-value grand-total-balanced"><span>' + tr('Total', 'Kabuuan') + '</span><strong>' + format(supply) + '</strong></div>';
    }
    return '<div class="grand-total-value"><span>' + tr('Supply', 'Suplay') + '</span><strong>' + format(supply) + '</strong></div>' +
      '<div class="grand-total-value"><span>' + tr('Demand', 'Demand') + '</span><strong>' + format(demand) + '</strong></div>';
  }

  function updateAllocationStatus() {
    const target = $('#allocationStatus');
    if (!target) return;
    const sources = $$('.sup-in');
    const destinations = $$('.dem-in');
    if (!sources.length || !destinations.length) {
      target.textContent = '';
      return;
    }
    const allocations = Array.from({ length: sources.length }, () => new Array(destinations.length).fill(0));
    $$('.alloc-in').forEach((input) => {
      allocations[+input.dataset.i][+input.dataset.j] = parseFloat(input.value) || 0;
    });
    const sourceSummary = sources.map((input, i) => {
      const assigned = allocations[i].reduce((sum, value) => sum + value, 0);
      const required = parseFloat(input.value);
      if (!Number.isFinite(required)) return 'S' + (i + 1) + ': ' + fmt(assigned) + ' / —';
      return 'S' + (i + 1) + ': ' + fmt(assigned) + ' / ' + fmt(required) + ' ' + marginDifference(assigned, required);
    });
    const destinationSummary = destinations.map((input, j) => {
      const received = allocations.reduce((sum, row) => sum + row[j], 0);
      const required = parseFloat(input.value);
      if (!Number.isFinite(required)) return 'D' + (j + 1) + ': ' + fmt(received) + ' / —';
      return 'D' + (j + 1) + ': ' + fmt(received) + ' / ' + fmt(required) + ' ' + marginDifference(received, required);
    });
    target.innerHTML = '<strong>' + staticText('planFulfillment') + ':</strong><br>' +
      '<strong>' + staticText('sourceStatus') + ':</strong> ' + sourceSummary.join(' &nbsp; | &nbsp; ') + '<br>' +
      '<strong>' + staticText('destinationStatus') + ':</strong> ' + destinationSummary.join(' &nbsp; | &nbsp; ');
  }

  function updateMarginalTotals() {
    updateBalanceBadge();
    updateAllocationStatus();
  }

  function marginDifference(actual, required) {
    if (!Number.isFinite(required)) return staticText('enterMargins');
    const difference = Math.round((required - actual) * 1e9) / 1e9;
    if (Math.abs(difference) <= 1e-9) return staticText('matches');
    return (difference > 0 ? staticText('shortBy') : staticText('overBy')) + ' ' + fmt(Math.abs(difference));
  }

  function fillProblem(p) {
    $('#inSources').value = p.costs.length;
    $('#inDest').value = p.costs[0].length;
    const pf = { cost: {}, alloc: {}, sup: {}, dem: {} };
    p.costs.forEach((row, i) => row.forEach((c, j) => { pf.cost[i + ',' + j] = c; }));
    (p.initialAlloc || []).forEach((row, i) => row.forEach((q, j) => { pf.alloc[i + ',' + j] = q || ''; }));
    const allocations = p.initialAlloc || [];
    (p.supply || allocations.map((row) => row.reduce((sum, value) => sum + value, 0)))
      .forEach((value, i) => { pf.sup[i] = value; });
    (p.demand || Array.from({ length: p.costs[0].length }, (_, j) =>
      allocations.reduce((sum, row) => sum + (row[j] || 0), 0)))
      .forEach((value, j) => { pf.dem[j] = value; });
    buildMatrix(pf);
  }


  function readInputs() {
    const size = readSize();
    if (!size) { showAlert(tr('Number of sources and destinations must be whole numbers from 1 to 10.', 'Ang bilang ng pinagmulan at destinasyon ay dapat buong bilang mula 1 hanggang 10.')); return null; }
    if (!$$('.cost-in').length) { showAlert(tr('Generate the matrix first.', 'Buuin muna ang matrix.')); return null; }

    $$('#inputMatrix input').forEach((e) => e.classList.remove('is-invalid'));
    const { m, n } = size;
    let problems = 0;
    const read = (el) => {
      const raw = el.value.trim();
      const v = Number(raw);
      if (raw === '' || !Number.isFinite(v) || v < 0) { el.classList.add('is-invalid'); problems++; return 0; }
      return v;
    };

    const costs = Array.from({ length: m }, () => new Array(n).fill(0));
    const initialAlloc = Array.from({ length: m }, () => new Array(n).fill(0));
    const supply = Array.from({ length: m }, () => 0);
    const demand = Array.from({ length: n }, () => 0);
    $$('.cost-in').forEach((e) => { costs[+e.dataset.i][+e.dataset.j] = read(e); });
    $$('.sup-in').forEach((e) => { supply[+e.dataset.i] = read(e); });
    $$('.dem-in').forEach((e) => { demand[+e.dataset.j] = read(e); });
    $$('.alloc-in').forEach((e) => {
      const raw = e.value.trim();
      if (raw === '') return;
      const value = Number(raw);
      if (!Number.isFinite(value) || value < 0) {
        e.classList.add('is-invalid');
        problems++;
      } else {
        initialAlloc[+e.dataset.i][+e.dataset.j] = value;
      }
    });
    if (problems) {
      showAlert(tr('Please fix the ' + problems + ' highlighted field(s): supply, demand, unit costs, and shipment quantities must be numbers that are zero or greater; every field except shipment quantities is required.',
        'Pakisuri ang ' + problems + ' naka-highlight na patlang: dapat mga numerong sero o mas mataas ang supply, demand, gastos bawat yunit, at dami ng padala; maaaring iwanang blangko ang mga kahon ng dami ng padala.'));
      return null;
    }
    if (supply.reduce((a, b) => a + b, 0) <= 0 || demand.reduce((a, b) => a + b, 0) <= 0) {
      showAlert(tr('Enter a total greater than zero for both supply and demand.', 'Maglagay ng kabuuang mas mataas sa sero para sa supply at demand.'));
      return null;
    }
    if (initialAlloc.every((row) => row.every((quantity) => quantity === 0))) {
      showAlert(tr('Enter at least one shipment quantity in the large cells.', 'Maglagay ng kahit isang dami ng padala sa malalaking cell.'));
      return null;
    }
    clearAlert();
    return { costs, supply, demand, initialAlloc };
  }


  function matrixTable(o, currency) {
    // o: rowLabels, colLabels, costs, supply, demand, alloc, rowActive, colActive, current, showTotals
    const m = o.rowLabels.length, n = o.colLabels.length;
    const isDummyRow = (i) => /^Dummy/.test(o.rowLabels[i]);
    const isDummyCol = (j) => /^Dummy/.test(o.colLabels[j]);

    let h = '<table class="tp-table"><thead><tr><th></th>';
    for (let j = 0; j < n; j++) {
      const crossed = o.colActive && !o.colActive[j];
      h += '<th class="' + (crossed ? 'crossed ' : '') + (o.focusCol === j ? 'focus-margin ' : '') + (isDummyCol(j) ? 'dummy-label' : '') + '">' + o.colLabels[j] + '</th>';
    }
    h += '<th>' + tr('Supply', 'Suplay') + '</th></tr></thead><tbody>';

    for (let i = 0; i < m; i++) {
      const rowCrossed = o.rowActive && !o.rowActive[i];
      h += '<tr class="' + (rowCrossed ? 'crossed' : '') + '"><th class="lab ' + (o.focusRow === i ? 'focus-margin ' : '') + (isDummyRow(i) ? 'dummy-label' : '') + '">' + o.rowLabels[i] + '</th>';
      for (let j = 0; j < n; j++) {
        const q = o.alloc ? o.alloc[i][j] : 0;
        const cls = [];
        if (q > 0) cls.push('allocated');
        if (o.current && o.current[0] === i && o.current[1] === j) cls.push('current');
        if (o.colActive && !o.colActive[j]) cls.push('crossed');
        if (isDummyRow(i) || isDummyCol(j)) cls.push('dummy-cell');
        h += '<td class="' + cls.join(' ') + '">';
        h += '<span class="cost">' + fmtMoney(o.costs[i][j], currency) + '</span>' +
          '<span class="qty' + (o.alloc ? '' : ' qty-empty') + '">' + (o.alloc ? fmt(q) : '') + '</span>';
        h += '</td>';
      }
      h += '<td class="sd ' + (o.focusRow === i ? 'focus-margin' : '') + '">' + fmt(o.supply[i]) + '</td></tr>';
    }
    h += '<tr><th class="lab">' + tr('Demand', 'Demand') + '</th>';
    for (let j = 0; j < n; j++) h += '<td class="sd ' + (o.colActive && !o.colActive[j] ? 'crossed ' : '') + (o.focusCol === j ? 'focus-margin' : '') + '">' + fmt(o.demand[j]) + '</td>';
    const totalSupply = o.supply.reduce((a, b) => a + b, 0);
    const totalDemand = o.demand.reduce((a, b) => a + b, 0);
    h += '<td class="sd grand-total-cell">' + (o.showTotals ? grandTotalsMarkup(totalSupply, totalDemand) : '') + '</td></tr></tbody></table>';
    return h;
  }

  function guidedStages(r) {
    const b = r.balanced;
    const stages = [{ kind: 'balance' }];
    r.terms.forEach((term) => {
      const { row, col, quantity, cost } = term;
      const rowQuantities = r.alloc[row].slice(0, r.original.demand.length);
      const colQuantities = r.alloc.slice(0, r.original.supply.length).map((line) => line[col]);
      const shipped = rowQuantities.reduce((sum, value) => sum + value, 0);
      const received = colQuantities.reduce((sum, value) => sum + value, 0);
      stages.push({
        kind: 'allocation', source: 'manual', step: stages.length,
        row, col, cell: term.cell, cost, quantity, product: term.product,
        rowCalculation: rowQuantities.map(fmt).join(' + ') + ' = ' + fmt(shipped) +
          ' (' + tr('required supply', 'kinakailangang supply') + ': ' + fmt(r.original.supply[row]) + '; ' + marginDifference(shipped, r.original.supply[row]) + ')',
        colCalculation: colQuantities.map(fmt).join(' + ') + ' = ' + fmt(received) +
          ' (' + tr('required demand', 'kinakailangang demand') + ': ' + fmt(r.original.demand[col]) + '; ' + marginDifference(received, r.original.demand[col]) + ')',
        snapshot: {
          alloc: r.alloc.map((line) => line.slice()),
          supply: b.supply.slice(), demand: b.demand.slice(),
          rowActive: b.supply.map(() => true), colActive: b.demand.map(() => true)
        }
      });
    });
    stages.push({ kind: 'summary' });
    return stages;
  }

  function renderGuidedLearning(r, currency) {
    const b = r.balanced;
    const stages = guidedStages(r);
    guidedIndex = Math.max(0, Math.min(guidedIndex, stages.length - 1));
    const stage = stages[guidedIndex];
    const isEnglish = language !== 'tl';
    const stepNumber = guidedIndex + 1;
    let title, action, explanation, calculation, matrix = '';

    if (stage.kind === 'balance') {
      title = tr('Check total supply and demand', 'Suriin ang kabuuang suplay at demand');
      action = tr('Add all source supplies and all destination demands, then compare the totals.', 'Pagsamahin ang lahat ng suplay at lahat ng demand, saka paghambingin ang kabuuan.');
      explanation = b.balanced
        ? tr('They are equal, so the problem is balanced. No dummy row or column is needed.', 'Magkapantay ang mga ito kaya balanse ang problema. Walang kailangang idagdag na kunwaring hilera o kolum.')
        : b.dummy.type === 'destination'
          ? tr('Supply is greater, so a dummy destination with zero transportation costs is added to use the excess supply.', 'Mas mataas ang suplay kaya nagdagdag ng kunwaring destinasyon na sero ang gastos para magamit ang sobrang suplay.')
          : tr('Demand is greater, so a dummy source with zero transportation costs is added to meet the extra demand.', 'Mas mataas ang demand kaya nagdagdag ng kunwaring pinagmulan na sero ang gastos upang matugunan ang sobrang demand.');
      calculation = tr('Total supply = ', 'Kabuuang suplay = ') + fmt(b.totalSupply) + ' · ' +
        tr('Total demand = ', 'Kabuuang demand = ') + fmt(b.totalDemand) + '. ' +
        (b.balanced ? tr('Balanced.', 'Balanse.') :
          tr('Difference = ', 'Pagkakaiba = ') + fmt(b.dummy.quantity) + '.');
      matrix = matrixTable({
        rowLabels: b.rowLabels, colLabels: b.colLabels, costs: b.costs,
        supply: b.supply, demand: b.demand,
        showTotals: true
      }, currency);
    } else if (stage.kind === 'allocation') {
      const s = stage.data || stage;
      title = tr('Choose a cell and allocate the quantity', 'Pumili ng cell at ilaan ang dami');
      action = tr('Review the quantity entered in ', 'Suriin ang daming inilagay sa ') + s.cell + '.';
      explanation = staticText('manualAllocationExplanation');
      calculation = tr('Entered shipment quantity = ', 'Inilagay na dami ng padala = ') + '<strong>' + fmt(s.quantity) + '</strong>.<br>' +
        tr('Unit transportation cost = ', 'Gastos bawat yunit = ') + fmtMoney(s.cost, currency) + '.<br>' +
        tr('Shipment cost = quantity × unit cost = ', 'Gastos sa padala = dami × gastos bawat yunit = ') +
        fmt(s.quantity) + ' × ' + fmtMoney(s.cost, currency) + ' = <strong>' + fmtMoney(s.product, currency) + '</strong>.<br>' +
        tr('Source shipment total = ', 'Kabuuang padala mula sa pinagmulan = ') + s.rowCalculation + '.<br>' +
        tr('Destination shipment total = ', 'Kabuuang padala sa destinasyon = ') + s.colCalculation + '.';
      matrix = matrixTable({
        rowLabels: b.rowLabels, colLabels: b.colLabels, costs: b.costs,
        supply: s.snapshot.supply, demand: s.snapshot.demand, alloc: s.snapshot.alloc,
        rowActive: s.snapshot.rowActive, colActive: s.snapshot.colActive,
        current: [s.row, s.col], focusRow: s.row, focusCol: s.col
      }, currency);
    } else {
      title = tr('Final solution summary', 'Buod ng panghuling solusyon');
      action = tr('Compare the shipment totals with the supply and demand requirements, then review the total cost.', 'Ihambing ang kabuuang padala sa mga kinakailangang supply at demand, saka suriin ang kabuuang gastos.');
      explanation = tr('Each row shipment total should match its source supply, and each column shipment total should match its destination demand. The problem is balanced only when the grand supply and demand totals are equal.', 'Dapat tumugma ang kabuuang padala sa bawat hilera sa supply ng pinagmulan nito at ang kabuuang padala sa bawat kolum sa demand ng destinasyon nito. Balanced lamang ang problema kapag magkapantay ang kabuuang supply at demand.');
      calculation = tr('Initial supply = ', 'Paunang suplay = ') + fmt(b.totalSupply) + '; ' +
        tr('initial demand = ', 'paunang demand = ') + fmt(b.totalDemand) + '; ' +
        tr('balance status = ', 'kalagayan ng balanse = ') + (b.balanced ? tr('BALANCED', 'BALANSE') : tr('UNBALANCED', 'HINDI BALANSE')) + '; ' +
        tr('allocations = ', 'bilang ng positibong alokasyon = ') + r.occupied + '; ' +
        tr('total transportation cost = ', 'kabuuang gastos sa transportasyon = ') + fmtMoney(r.total, currency) + '.<br>' +
        r.terms.map((term) => term.cell + ': ' + fmt(term.quantity) + ' × ' + fmtMoney(term.cost, currency) + ' = ' + fmtMoney(term.product, currency)).join('<br>') +
        '<br><strong>' + tr('Final total = ', 'Kabuuang gastos = ') + fmtMoney(r.total, currency) + '</strong>';
      if (b.dummy) {
        calculation += '<br>' + tr('Dummy ', 'Kunwaring ') +
          (b.dummy.type === 'destination' ? tr('destination', 'destinasyon') : tr('source', 'pinagmulan')) +
          ' = ' + fmt(b.dummy.quantity);
      }
      matrix = matrixTable({
        rowLabels: b.rowLabels, colLabels: b.colLabels, costs: b.costs,
        supply: b.supply, demand: b.demand, alloc: r.alloc, showTotals: true
      }, currency);
    }

    const explanationButton = guidedShowExplanation ? tr('Hide Explanation', 'Itago ang Paliwanag') : tr('Show Explanation', 'Ipakita ang Paliwanag');
    const calculationButton = guidedShowCalculation ? tr('Hide Calculation', 'Itago ang Kalkulasyon') : tr('Show Calculation', 'Ipakita ang Kalkulasyon');
    let html = '<div class="panel guided-learning mb-4" id="guidedLearning" aria-live="polite">' +
      '<div class="panel-head"><div><h2>' + tr('Guided Learning Mode', 'Gabay sa Pag-aaral') + '</h2><p class="text-muted small mb-0">' +
      tr('Follow one clear action at a time. Use Next Step to continue.', 'Sundin ang bawat hakbang. Pindutin ang Susunod na Hakbang upang magpatuloy.') +
      '</p></div><span class="badge text-bg-primary">' + tr('Step ', 'Hakbang ') + stepNumber + ' / ' + stages.length + '</span></div>' +
      '<div class="progress mb-3" role="progressbar" aria-valuenow="' + stepNumber + '" aria-valuemin="1" aria-valuemax="' + stages.length + '">' +
      '<div class="progress-bar" style="width:' + (stepNumber / stages.length * 100) + '%"></div></div>' +
      '<h3 class="guided-step-title">' + (isEnglish ? 'Step ' : 'Hakbang ') + stepNumber + ': ' + title + '</h3>' +
      '<p class="mb-2"><strong>' + tr('Action:', 'Gawin:') + '</strong> ' + action + '</p>' +
      '<div class="d-flex flex-wrap gap-2 mb-3">' +
      '<button class="btn btn-outline-primary btn-sm" data-guided-action="explanation" aria-pressed="' + guidedShowExplanation + '">' + explanationButton + '</button>' +
      '<button class="btn btn-outline-primary btn-sm" data-guided-action="calculation" aria-pressed="' + guidedShowCalculation + '">' + calculationButton + '</button>' +
      '<button class="btn btn-outline-secondary btn-sm" data-guided-action="reset">' + tr('Reset Procedure', 'I-reset ang Pamamaraan') + '</button></div>';
    if (guidedShowExplanation) html += '<div class="alert alert-info py-2"><strong>' + tr('Why?', 'Bakit?') + '</strong> ' + explanation + '</div>';
    if (guidedShowCalculation) html += '<div class="alert alert-light border py-2"><strong>' + tr('Calculation and result:', 'Kalkulasyon at resulta:') + '</strong><br>' + calculation + '</div>';
    html += '<div class="table-responsive mb-3">' + matrix + '</div>' +
      '<div class="d-flex justify-content-between gap-2">' +
      '<button class="btn btn-outline-secondary" data-guided-action="previous"' + (guidedIndex === 0 ? ' disabled' : '') + '>' + tr('Previous Step', 'Nakaraang Hakbang') + '</button>' +
      '<button class="btn btn-primary" data-guided-action="next"' + (guidedIndex === stages.length - 1 ? ' disabled' : '') + '>' + tr('Next Step', 'Susunod na Hakbang') + '</button>' +
      '</div></div>';
    return html;
  }


  function renderResults(input, r, currency) {
    const b = r.balanced;
    const orig = r.original;
    const rowTotals = r.rowTotals || orig.supply.map((_, i) =>
      r.alloc[i].slice(0, orig.demand.length).reduce((sum, quantity) => sum + quantity, 0));
    const columnTotals = r.columnTotals || orig.demand.map((_, j) =>
      r.alloc.slice(0, orig.supply.length).reduce((sum, row) => sum + row[j], 0));
    const origLabels = {
      rowLabels: orig.supply.map((_, i) => 'S' + (i + 1)),
      colLabels: orig.demand.map((_, j) => 'D' + (j + 1))
    };
    let h = renderGuidedLearning(r, currency);

    // Summary
    h += '<div class="panel result-section">' +
      '<div class="mb-3"><span class="badge ' + (b.balanced ? 'text-bg-success' : 'text-bg-warning') + ' fs-6">' +
      (b.balanced ? tr('BALANCED', 'BALANSE') : tr('UNBALANCED — dummy row/column added', 'HINDI BALANSE — may idinagdag na kunwaring hilera/kolum')) +
      '</span></div>' +
      '<div class="row g-3 text-center">' +
      '<div class="col-6 col-md-3"><div class="text-muted small">' + tr('Problem size', 'Laki ng problema') + '</div><div class="fs-5 fw-bold">' + orig.supply.length + ' &times; ' + orig.demand.length + '</div></div>' +
      '<div class="col-6 col-md-3"><div class="text-muted small">' + staticText('positiveShipments') + '</div><div class="fs-5 fw-bold">' + r.occupied + '</div></div>' +
      '<div class="col-6 col-md-3"><div class="text-muted small">' + tr('Total transportation cost', 'Kabuuang gastos sa transportasyon') + '</div><div class="cost-total">' + fmtMoney(r.total, currency) + '</div></div>' +
      '<div class="col-6 col-md-3"><div class="text-muted small">' + staticText('balanceStatus') + '</div><div class="fs-5 fw-bold">' +
      (b.balanced ? '<span class="text-success">' + tr('BALANCED', 'BALANSE') + '</span>' : '<span class="text-warning-emphasis">' + tr('UNBALANCED', 'HINDI BALANSE') + '</span>') + '</div></div>' +
      '</div></div>';

    // 1. Original matrix
    h += '<div class="result-section"><h3>' + tr('1. Original Matrix', '1. Orihinal na Matrix') + '</h3>' +
      '<p class="small text-muted">' + staticText('originalValues') + '.</p><div class="table-responsive">' +
      matrixTable({ rowLabels: origLabels.rowLabels, colLabels: origLabels.colLabels, costs: orig.costs, supply: orig.supply, demand: orig.demand, showTotals: true }, currency) +
      '</div></div>';

    // 2. Balance check + balanced matrix
    h += '<div class="result-section"><h3>' + tr('2. Balance Check &amp; Balanced Matrix', '2. Pagsusuri ng Balanse at Balanseng Matrix') + '</h3>' +
      '<p class="mb-2">' + tr('Total Supply', 'Kabuuang Suplay') + ' = <span class="hl">' + fmt(b.totalSupply) + '</span> &nbsp; ' + tr('Total Demand', 'Kabuuang Demand') + ' = <span class="hl">' + fmt(b.totalDemand) + '</span></p>';
    if (b.balanced) {
      h += '<div class="alert alert-success py-2">' + tr('The problem is balanced: total supply equals total demand. No dummy row or column is needed.', 'Balanse ang problema: magkapantay ang kabuuang suplay at demand. Hindi kailangan ng kunwaring hilera o kolum.') + '</div>';
    } else if (b.dummy.type === 'destination') {
      h += '<div class="alert alert-info py-2">' + tr('Supply exceeds demand by ', 'Mas mataas ang suplay kaysa demand ng ') + fmt(b.totalSupply) + ' &minus; ' + fmt(b.totalDemand) + ' = <strong>' +
        fmt(b.dummy.quantity) + '</strong>. ' + tr('A dummy destination with demand ', 'Nagdagdag ng kunwaring destinasyon na may demand na ') + fmt(b.dummy.quantity) + tr(' and zero costs.', ' at serong gastos.') + '</div>';
    } else {
      h += '<div class="alert alert-info py-2">' + tr('Demand exceeds supply by ', 'Mas mataas ang demand kaysa suplay ng ') + fmt(b.totalDemand) + ' &minus; ' + fmt(b.totalSupply) + ' = <strong>' +
        fmt(b.dummy.quantity) + '</strong>. ' + tr('A dummy source with supply ', 'Nagdagdag ng kunwaring pinagmulan na may suplay na ') + fmt(b.dummy.quantity) + tr(' and zero costs.', ' at serong gastos.') + '</div>';
    }
    if (b.dummy) h += '<div class="alert alert-secondary py-2">' + staticText('dummyForBalanceOnly') + '</div>';
    h += '<div class="small mb-2"><strong>' + staticText('planFulfillment') + '</strong><ul class="mb-2">';
    orig.supply.forEach((required, i) => {
      h += '<li>S' + (i + 1) + ': ' + fmt(rowTotals[i]) + ' / ' + fmt(required) + ' ' + marginDifference(rowTotals[i], required) + '</li>';
    });
    orig.demand.forEach((required, j) => {
      h += '<li>D' + (j + 1) + ': ' + fmt(columnTotals[j]) + ' / ' + fmt(required) + ' ' + marginDifference(columnTotals[j], required) + '</li>';
    });
    h += '</ul></div>';
    h += '<p class="small text-muted">' + staticText('manualPlanSummary') + '</p><div class="table-responsive">' +
      matrixTable({ rowLabels: b.rowLabels, colLabels: b.colLabels, costs: b.costs, supply: b.supply, demand: b.demand, alloc: r.alloc, showTotals: true }, currency) +
      '</div></div>';

    // 3. Steps
    h += '<div class="result-section"><h3>' + tr('3. Step-by-Step Solution', '3. Sunod-sunod na Solusyon') + '</h3>';
    h += '<div class="alert alert-info py-2">' + staticText('manualPlanSummary') + '</div>' +
      '<div class="table-responsive"><table class="table table-sm table-bordered w-auto align-middle"><thead class="table-light"><tr><th>' + tr('Step', 'Hakbang') + '</th><th>' + tr('Cell', 'Cell') + '</th><th>' + tr('Unit cost', 'Gastos bawat yunit') + '</th><th>' + tr('Shipment quantity', 'Dami ng padala') + '</th><th>' + tr('Calculation', 'Kuwenta') + '</th></tr></thead><tbody>';
    r.terms.forEach((term, index) => {
      h += '<tr><td>' + (index + 1) + '</td><td>' + term.cell + '</td><td>' + fmtMoney(term.cost, currency) + '</td><td>' + fmt(term.quantity) + '</td><td>' +
        fmt(term.quantity) + ' × ' + fmtMoney(term.cost, currency) + ' = <strong>' + fmtMoney(term.product, currency) + '</strong></td></tr>';
    });
    h += '</tbody></table></div><p class="text-muted small">' +
      tr('The entered quantities are the final plan. The solver calculates their row and column totals and transportation cost; it does not select the quantities using the Least Cost Method.', 'Ang mga inilagay na quantity ang panghuling plano. Kinukuwenta ng system ang kabuuan bawat hilera at kolum pati ang gastos; hindi nito pinipili ang quantity gamit ang Pamamaraang Least Cost.') +
      '</p>';
    h += '</div>';

    // 4. Final allocation matrix
    h += '<div class="result-section"><h3>' + tr('4. Final Allocation Matrix', '4. Panghuling Matrix ng Alokasyon') + '</h3>' +
      '<p class="small text-muted mb-2">' + staticText('finalAllocationExplanation') + '</p>' +
      '<p class="small text-muted mb-2"><span class="legend-box" style="background:#ffe58a;border:2px solid #1e4fb8"></span>' + tr('Allocated cell', 'Kahong may alokasyon') + ' &nbsp; ' +
      tr('Small number (top-right) = unit cost, large number = allocated quantity.', 'Maliit na numero (kanang itaas) = gastos bawat yunit; malaking numero = dami ng alokasyon.') + '</p><div class="table-responsive">' +
      matrixTable({ rowLabels: b.rowLabels, colLabels: b.colLabels, costs: b.costs, supply: b.supply, demand: b.demand, alloc: r.alloc, showTotals: true }, currency) +
      '</div></div>';

    // 5. Total cost
    h += '<div class="result-section"><h3>' + tr('5. Total Transportation Cost', '5. Kabuuang Gastos sa Transportasyon') + '</h3>' +
      '<p class="mb-2">' + tr('Total Cost', 'Kabuuang Gastos') + ' = &Sigma; (' + tr('Cost', 'Gastos') + ' &times; ' + tr('Allocation', 'Alokasyon') + ')</p>' +
      '<div class="table-responsive"><table class="table table-sm table-bordered w-auto align-middle"><thead class="table-light"><tr><th>' + tr('Cell', 'Kahon') + '</th><th>' + tr('Cost', 'Gastos') + '</th><th>' + tr('Allocation', 'Alokasyon') + '</th><th>' + tr('Cost', 'Gastos') + ' &times; ' + tr('Allocation', 'Alokasyon') + '</th></tr></thead><tbody>';
    r.terms.forEach((t) => {
      h += '<tr><td>' + t.cell + '</td><td>' + fmtMoney(t.cost, currency) + '</td><td>' + fmt(t.quantity) + '</td><td>' + fmtMoney(t.cost, currency) + ' &times; ' + fmt(t.quantity) + ' = <strong>' + fmtMoney(t.product, currency) + '</strong></td></tr>';
    });
    h += '</tbody></table></div>' +
      '<div class="calc-line mb-1">' + tr('Total Cost', 'Kabuuang Gastos') + ' = ' + r.terms.map((t) => fmtMoney(t.product, currency)).join(' + ') + '</div>' +
      '<div class="calc-line">' + tr('Total Cost', 'Kabuuang Gastos') + ' = <span class="cost-total">' + fmtMoney(r.total, currency) + '</span></div>' +
      '<div class="alert alert-info mt-3 mb-0 py-2 small">' + staticText('manualTotalNote') + '</div>' +
      '</div>';

    $('#resultsContent').innerHTML = h;
    $('#noResults').classList.add('d-none');
    $('#resultsWrap').classList.remove('d-none');
  }

  function solveAndShow(input, tie, record, currency) {
    currency = currency || 'USD';
    let result;
    if (tie === 'manual') {
      const m = input.supply.length, n = input.demand.length;
      const balanced = LCM.balanceProblem(input.costs, input.supply, input.demand);
      const rounded = (value) => Math.round(value * 1e9) / 1e9;
      const terms = [];
      let totalCost = 0;
      const rowTotals = input.initialAlloc.map((row) => rounded(row.reduce((sum, quantity) => sum + quantity, 0)));
      const columnTotals = Array.from({ length: n }, (_, j) =>
        rounded(input.initialAlloc.reduce((sum, row) => sum + row[j], 0)));
      const alloc = Array.from({ length: balanced.supply.length }, () => new Array(balanced.demand.length).fill(0));
      input.initialAlloc.forEach((row, i) => row.forEach((quantity, j) => { alloc[i][j] = quantity; }));
      input.initialAlloc.forEach((row, i) => row.forEach((quantity, j) => {
        if (quantity <= 0) return;
        const product = rounded(input.costs[i][j] * quantity);
        totalCost = rounded(totalCost + product);
        terms.push({
          row: i, col: j, cell: balanced.rowLabels[i] + ' → ' + balanced.colLabels[j],
          cost: input.costs[i][j], quantity, product
        });
      }));
      result = {
        original: {
          costs: input.costs.map((row) => row.slice()),
          supply: input.supply.slice(),
          demand: input.demand.slice()
        },
        balanced,
        steps: [],
        alloc,
        terms,
        total: totalCost,
        initialAlloc: input.initialAlloc.map((row) => row.slice()),
        occupied: terms.length,
        rowTotals,
        columnTotals,
        m, n
      };
    } else {
      result = LCM.solveLCM(input.costs, input.supply, input.demand, tie, input.initialAlloc);
    }
    current = { input: input, result: result, currency: currency };
    guidedIndex = 0;
    guidedShowExplanation = false;
    guidedShowCalculation = false;
    renderResults(input, result, currency);
    if (record) pushHistory(input, result, currency);
    showView('results');
    window.dispatchEvent(new CustomEvent('transportation-problem-updated'));
  }

  function onSolve() {
    const input = readInputs();
    if (!input) return;
    solveAndShow(input, 'manual', true, $('#currency').value);
  }

  function resetInput() {
    $('#inSources').value = 3;
    $('#inDest').value = 3;
    $('#currency').value = 'USD';
    buildMatrix();
    clearAlert();
  }

  function resetAll() {
    current = null;
    $('#resultsContent').innerHTML = '';
    $('#resultsWrap').classList.add('d-none');
    $('#noResults').classList.remove('d-none');
    resetInput();
    showView('input');
  }

  function solveAnother() {
    current = null;
    $('#resultsContent').innerHTML = '';
    $('#resultsWrap').classList.add('d-none');
    $('#noResults').classList.remove('d-none');
    buildMatrix(); // same size, empty values
    showView('input');
  }

  function exportPdf() {
    if (!current) return;
    const el = $('#resultsContent');
    if (typeof html2pdf === 'undefined') {
      showAlert('The PDF library could not be loaded (check your internet connection). The print dialog will open instead: choose "Save as PDF" as the printer.', 'warning');
      window.print();
      return;
    }
    html2pdf().set({
      margin: 10,
      filename: 'lcm-transportation-solution.pdf',
      image: { type: 'jpeg', quality: 0.95 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['css', 'legacy'], avoid: '.step-card' }
    }).from(el).save();
  }

  function getTransportationChatContext() {
    if (!current || $('#view-results').classList.contains('d-none')) return null;
    const input = current.input;
    const result = current.result;
    return {
      problem: {
        supply: input.supply,
        demand: input.demand,
        costs: input.costs,
        shipments: input.initialAlloc,
        currency: current.currency,
        totalCost: result.total,
        balanced: result.balanced.balanced,
        dummy: result.balanced.dummy,
        rowTotals: result.rowTotals,
        columnTotals: result.columnTotals,
        terms: result.terms
      }
    };
  }


  function init() {
    window.getTransportationChatContext = getTransportationChatContext;
    $$('.sidebar .nav-link').forEach((a) => a.addEventListener('click', (e) => {
      e.preventDefault();
      clearAlert();
      showView(a.dataset.view);
    }));
    $$('[data-goto]').forEach((b) => b.addEventListener('click', () => showView(b.dataset.goto)));
    $('#menuToggle').addEventListener('click', () => $('#sidebar').classList.toggle('open'));
    $('#themeToggle').addEventListener('click', () => setTheme(theme === 'dark' ? 'light' : 'dark'));

    $('#btnNewProblem').addEventListener('click', () => { buildMatrix(); showView('input'); });
    $('#btnClearHistory').addEventListener('click', () => {
      if (confirm(tr('Clear all recent calculations and reset the solved counter?', 'I-clear ang lahat ng kamakailang kalkulasyon at i-reset ang bilang ng mga nalutas na problema?'))) {
        save(STORE.history, []); save(STORE.solved, 0); renderDashboard();
      }
    });

    $('#btnGenerate').addEventListener('click', () => buildMatrix(captureValues()));
    $('#btnSample').addEventListener('click', () => { fillProblem(SAMPLE); clearAlert(); });
    $('#btnSolve').addEventListener('click', onSolve);
    $('#btnResetInput').addEventListener('click', resetInput);
    $('#inputMatrix').addEventListener('input', () => {
      updateMarginalTotals();
    });
    $('#currency').addEventListener('change', updateCostCurrencySigns);
    $('#languageSelect').addEventListener('change', (e) => {
      language = ['tl', 'tl-en'].includes(e.target.value) ? e.target.value : 'en';
      save(LANGUAGE_KEY, language);
      applyLanguage();
    });

    $('#btnPrint').addEventListener('click', () => window.print());
    $('#btnPdf').addEventListener('click', exportPdf);
    $('#btnResetResults').addEventListener('click', resetAll);
    $('#btnAnother').addEventListener('click', solveAnother);
    $('#resultsContent').addEventListener('click', (e) => {
      const button = e.target.closest('[data-guided-action]');
      if (!button || !current) return;
      const action = button.dataset.guidedAction;
      if (action === 'previous') guidedIndex = Math.max(0, guidedIndex - 1);
      else if (action === 'next') guidedIndex = Math.min(guidedStages(current.result).length - 1, guidedIndex + 1);
      else if (action === 'explanation') guidedShowExplanation = !guidedShowExplanation;
      else if (action === 'calculation') guidedShowCalculation = !guidedShowCalculation;
      else if (action === 'reset') {
        guidedIndex = 0;
        guidedShowExplanation = false;
        guidedShowCalculation = false;
      }
      renderResults(current.input, current.result, current.currency);
      $('#guidedLearning').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    // history buttons (event delegation)
    $('#historyBody').addEventListener('click', (e) => {
      const v = e.target.closest('[data-view-hist]');
      const ed = e.target.closest('[data-edit-hist]');
      const history = load(STORE.history, []);
      if (v) {
        const h = history[+v.dataset.viewHist];
        if (h) solveAndShow(h.input, h.tie, false, h.currency); // recalculated from stored inputs
      } else if (ed) {
        const h = history[+ed.dataset.editHist];
        if (h) {
          fillProblem(h.input);
          $('#currency').value = h.currency || 'USD';
          updateCostCurrencySigns();
          showView('input');
        }
      }
    });

    applyLanguage();
    buildMatrix();
    renderDashboard();
  }

  document.addEventListener('DOMContentLoaded', init);
})();