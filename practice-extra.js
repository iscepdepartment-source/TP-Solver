(function () {
  'use strict';

  // Extra Practice Mode features: progress line graph, guided problems (auto-filled
  // matrices) and a quick quiz. Works next to practice.js and shares its points balance.

  const $ = (selector, root) => (root || document).querySelector(selector);
  const $$ = (selector, root) => Array.from((root || document).querySelectorAll(selector));
  const LEVELS = ['easy', 'medium', 'hard'];
  const ACTIVITY_KEY = 'tp_lcm_practice_activity_v1';
  const REVIEW_KEY = 'tp_lcm_practice_review_history_v1';
  const ACTIVITY_LIMIT = 300;
  const CHART_POINT_LIMIT = 40;
  const QUIZ_LENGTH = 5;
  const QUIZ_POINTS_EACH = 2;
  const QUIZ_PERFECT_BONUS = 5;
  const GUIDED_POINTS = 10;
  const currencySigns = { USD: '$', PHP: '₱', EUR: '€', GBP: '£' };
  const ARROW = ' → ';

  let language = 'en';
  let activity = [];
  let guided = null;
  let quiz = null;
  let chartState = null;

  /* ------------------------------------------------------------------ text */

  const UI = {
    progressTitle: ['My Progress', 'Ang Aking Progreso'],
    progressHelp: ['Every finished practice activity is saved on this device and drawn on the graph so you can see yourself improving.', 'Lahat ng natapos na pagsasanay ay naka-save sa device na ito at makikita sa graph para makita mo ang pagbuti mo.'],
    statCompleted: ['Activities completed', 'Natapos na gawain'],
    statBest: ['Fastest solve', 'Pinakamabilis na sagot'],
    statScore: ['Average score', 'Average na score'],
    statStreak: ['Day streak', 'Magkakasunod na araw'],
    statNone: ['—', '—'],
    metricLabel: ['Show', 'Ipakita'],
    metricDaily: ['Activities per day (last 14 days)', 'Gawain kada araw (huling 14 araw)'],
    metricTime: ['Solve time per activity', 'Oras ng pagsagot kada gawain'],
    metricScore: ['Score per activity', 'Score kada gawain'],
    filterLabel: ['Activity type', 'Uri ng gawain'],
    filterAll: ['All activities', 'Lahat ng gawain'],
    filterLcm: ['Full LCM problems', 'Buong LCM na problema'],
    filterGuided: ['Guided problems', 'Guided na problema'],
    filterQuiz: ['Quick quizzes', 'Quick quiz'],
    showTable: ['Show as table', 'Ipakita bilang table'],
    showChart: ['Show as graph', 'Ipakita bilang graph'],
    legendEach: ['Each activity', 'Bawat gawain'],
    legendAvg: ['5-activity average', 'Average ng 5 gawain'],
    unitMinutes: ['Minutes', 'Minuto'],
    unitScore: ['Score (%)', 'Score (%)'],
    unitCount: ['Activities completed', 'Natapos na gawain'],
    avgShort: ['Average', 'Average'],
    emptyProgress: ['No activities yet. Solve a practice problem, a guided problem or a quick quiz and your graph will appear here.', 'Wala pang gawain. Sumagot ng practice problem, guided problem o quick quiz at lalabas dito ang graph mo.'],
    emptyScore: ['No scored activities yet. Finish a guided problem or a quick quiz to see your scores.', 'Wala pang may score na gawain. Tapusin ang guided problem o quick quiz para makita ang mga score mo.'],
    tableNumber: ['No.', 'Blg.'],
    tableDate: ['Date', 'Petsa'],
    tableType: ['Type', 'Uri'],
    tableValue: ['Value', 'Halaga'],
    kindLcm: ['Full LCM', 'Buong LCM'],
    kindGuided: ['Guided', 'Guided'],
    kindQuiz: ['Quiz', 'Quiz'],
    chartAria: ['{title}. {count} points. Latest value: {latest}.', '{title}. {count} na punto. Pinakahuling halaga: {latest}.'],
    moreTitle: ['More Ways to Practice', 'Iba pang Paraan ng Pagsasanay'],
    tabGuided: ['Guided problems', 'Guided na problema'],
    tabQuiz: ['Quick quiz', 'Quick quiz'],
    guidedHelp: ['The matrix is already partly (or completely) filled in for you. You only enter the missing numbers or the final answer, so you can focus on one skill at a time.', 'Bahagya (o buo) nang may laman ang matrix. Ilalagay mo lang ang kulang na numero o ang huling sagot para isang kasanayan lang ang pagtutuunan mo.'],
    guidedKind: ['Activity', 'Gawain'],
    guidedKindFill: ['Fill in the blanks', 'Punan ang mga patlang'],
    guidedKindTotal: ['Find the total cost', 'Hanapin ang kabuuang gastos'],
    guidedLevel: ['Difficulty', 'Antas'],
    easyName: ['Easy', 'Madali'],
    mediumName: ['Medium', 'Katamtaman'],
    hardName: ['Hard', 'Mahirap'],
    guidedNew: ['New guided problem', 'Bagong guided na problema'],
    guidedBadge: ['{kind} · {level} · {rows} × {columns}', '{kind} · {level} · {rows} × {columns}'],
    guidedTaskFill: ['Blue numbers are already filled in. Type the missing shipment quantity in each empty cell so every row adds up to its supply and every column adds up to its demand.', 'Ang mga asul na numero ay nakalagay na. Ilagay ang kulang na dami ng padala sa bawat walang laman na cell para ang bawat row ay pumantay sa supply nito at ang bawat column ay pumantay sa demand nito.'],
    guidedTaskTotal: ['All Least Cost Method shipments are already filled in. Multiply each shipment by its unit cost, add the products, and enter the total least cost.', 'Nakalagay na ang lahat ng shipment mula sa Least Cost Method. I-multiply ang bawat shipment sa unit cost nito, idagdag ang mga produkto, at ilagay ang kabuuang least cost.'],
    guidedDummyNote: ['Routes to or from a dummy city or factory cost 0.', 'Ang mga ruta papunta o mula sa dummy na city o factory ay 0 ang gastos.'],
    guidedPointsInfo: ['Earn up to {points} points', 'Kumita ng hanggang {points} points'],
    totalLabel: ['Total least cost', 'Kabuuang least cost'],
    check: ['Check my answer', 'Suriin ang sagot'],
    hint: ['Hint', 'Clue'],
    showSteps: ['Show step-by-step products', 'Ipakita ang produkto kada hakbang'],
    hideSteps: ['Hide step-by-step products', 'Itago ang produkto kada hakbang'],
    stepsHelp: ['Each product is unit cost × quantity. Add them all to get the total. (Using this helper earns fewer points.)', 'Ang bawat produkto ay unit cost × dami. Idagdag lahat para makuha ang total. (Mas kaunting points ang makukuha kapag ginamit ito.)'],
    stepsRoute: ['Route', 'Ruta'],
    stepsUnit: ['Unit cost', 'Unit cost'],
    stepsQty: ['Quantity', 'Dami'],
    stepsProduct: ['Product', 'Produkto'],
    guidedFillAll: ['Fill in every blank cell first, then check.', 'Punan muna ang lahat ng patlang, saka suriin.'],
    guidedFillWrong: ['{count} blank(s) need another look. Remember: each row adds up to its supply and each column to its demand.', '{count} patlang ang kailangang suriin muli. Tandaan: ang bawat row ay pumapantay sa supply at ang bawat column sa demand.'],
    guidedEnterTotal: ['Enter the total least cost first.', 'Ilagay muna ang kabuuang least cost.'],
    guidedTooHigh: ['Your total is too high. Recheck each multiplication.', 'Masyadong mataas ang total mo. Suriin muli ang bawat multiplication.'],
    guidedTooLow: ['Your total is too low. Did you include every shipment?', 'Masyadong mababa ang total mo. Naisama mo ba ang bawat shipment?'],
    guidedTrySteps: ['Stuck? Use “Show step-by-step products”.', 'Nahihirapan? Gamitin ang “Ipakita ang produkto kada hakbang”.'],
    guidedHintRow: ['Look at {line}: its supply is {total} and the other cells in that row add up to {known}. How many units are left for the highlighted blank?', 'Tingnan ang {line}: ang supply nito ay {total} at ang ibang cell sa row na iyon ay may kabuuang {known}. Ilan ang natitira para sa naka-highlight na patlang?'],
    guidedHintCol: ['Look at {line}: its demand is {total} and the other cells in that column add up to {known}. How many units are left for the highlighted blank?', 'Tingnan ang {line}: ang demand nito ay {total} at ang ibang cell sa column na iyon ay may kabuuang {known}. Ilan ang natitira para sa naka-highlight na patlang?'],
    guidedHintNone: ['Every blank already has the right answer. Press Check.', 'Tama na ang lahat ng patlang. Pindutin ang Suriin.'],
    guidedCorrectTitle: ['Great job!', 'Magaling!'],
    guidedCorrectMessage: ['Solved in {time}. Score: {score}%.', 'Natapos sa loob ng {time}. Score: {score}%.'],
    pointsEarned: ['+{points} points', '+{points} points'],
    guidedNext: ['Next guided problem', 'Susunod na guided problem'],
    quizHelp: ['Answer 5 quick questions about the Least Cost Method. Some use fresh numbers every time, so no two rounds are the same.', 'Sagutin ang 5 mabilis na tanong tungkol sa Least Cost Method. May ilang gumagamit ng bagong numero kaya hindi pareho ang bawat round.'],
    quizMode: ['Questions', 'Mga tanong'],
    quizModeMixed: ['Mixed', 'Halo-halo'],
    quizModeCalc: ['Calculations only', 'Kalkulasyon lang'],
    quizModeConcept: ['Concepts only', 'Konsepto lang'],
    quizStart: ['Start quiz', 'Simulan ang quiz'],
    quizQuestionOf: ['Question {n} of {total}', 'Tanong {n} sa {total}'],
    quizScoreSoFar: ['Score: {score}', 'Score: {score}'],
    quizSubmit: ['Submit answer', 'Ipasa ang sagot'],
    quizNext: ['Next question', 'Susunod na tanong'],
    quizFinish: ['See my result', 'Tingnan ang resulta'],
    quizNumberLabel: ['Your answer', 'Iyong sagot'],
    quizEnterNumber: ['Type a number first.', 'Maglagay muna ng numero.'],
    quizRight: ['Correct!', 'Tama!'],
    quizWrong: ['Not quite.', 'Hindi pa tama.'],
    quizAnswerWas: ['The answer is {answer}.', 'Ang sagot ay {answer}.'],
    quizResultTitle: ['Quiz complete!', 'Tapos na ang quiz!'],
    quizResultScore: ['You got {correct} of {total} right ({percent}%).', 'Nakakuha ka ng {correct} sa {total} na tama ({percent}%).'],
    quizResultPerfect: ['Perfect round! Bonus included.', 'Perpektong round! Kasama na ang bonus.'],
    quizResultGood: ['Nice work! Try another round to keep improving.', 'Magaling! Subukan ang isa pang round para lalong gumaling.'],
    quizResultKeep: ['Good start. Review the explanations and try again.', 'Magandang simula. Basahin ang mga paliwanag at subukan ulit.'],
    quizAgain: ['Try another round', 'Subukan ang isa pang round'],
    cell: ['{source} to {destination}', '{source} papuntang {destination}'],
    supply: ['Supply', 'Suplay'],
    demand: ['Demand', 'Demand'],
    given: ['Given', 'Ibinigay'],
    blankLabel: ['Missing shipment from {source} to {destination}', 'Kulang na padala mula {source} papuntang {destination}']
  };

  const toTaglish = (value) => (window.transportationToTaglish ? window.transportationToTaglish(value) : value);
  const tx = (pair) => language === 'tl' ? pair[1] : language === 'tl-en' ? toTaglish(pair[1]) : pair[0];
  const fill = (message, values) => values
    ? message.replace(/\{(\w+)\}/g, (_, key) => (key in values ? values[key] : '{' + key + '}'))
    : message;
  const t = (key, values) => fill(tx(UI[key] || [key, key]), values);
  const fmt = (value) => Number(value).toLocaleString('en-US', { maximumFractionDigits: 4 });
  const currencySign = () => {
    const select = $('#practiceCurrency');
    return (select && currencySigns[select.value]) || '$';
  };
  const fmtMoney = (value) => currencySign() + fmt(value);
  const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const pick = (list) => list[randInt(0, list.length - 1)];
  const shuffle = (list) => {
    const copy = list.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = randInt(0, i);
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };
  const levelName = (level) => t(level + 'Name');
  const cellName = (source, destination) => source + ARROW + destination;

  function formatDuration(ms) {
    const totalSeconds = Math.max(0, Math.round(ms / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return minutes + ' min ' + String(seconds).padStart(2, '0') + ' sec';
  }

  /* -------------------------------------------------------------- activity */

  function validActivity(entry) {
    return entry && ['lcm', 'guided', 'quiz'].includes(entry.kind) &&
      Number.isFinite(entry.t) && Number.isFinite(entry.ms) && entry.ms >= 0 &&
      Number.isFinite(entry.score);
  }

  function persistActivity() {
    try {
      localStorage.setItem(ACTIVITY_KEY, JSON.stringify(activity));
    } catch (error) {
      console.warn('Practice activity could not be saved in this browser.');
    }
  }

  function seedFromHistory() {
    // Students who already finished classic problems keep their progress on the graph.
    try {
      const history = JSON.parse(localStorage.getItem(REVIEW_KEY) || '[]');
      if (!Array.isArray(history)) return [];
      return history
        .filter((entry) => entry && Number.isFinite(entry.completedAt) && Number.isFinite(entry.durationMs))
        .map((entry) => ({
          t: entry.completedAt, kind: 'lcm', level: LEVELS.includes(entry.difficulty) ? entry.difficulty : '',
          ms: entry.durationMs, score: 100
        }))
        .sort((a, b) => a.t - b.t);
    } catch (error) {
      return [];
    }
  }

  function loadActivity() {
    let raw = null;
    try { raw = localStorage.getItem(ACTIVITY_KEY); } catch (error) { raw = null; }
    if (raw !== null) {
      try {
        const saved = JSON.parse(raw);
        if (Array.isArray(saved)) return saved.filter(validActivity).slice(-ACTIVITY_LIMIT);
      } catch (error) {
        console.warn('Practice activity could not be read from this browser.');
      }
      return [];
    }
    const seeded = seedFromHistory().slice(-ACTIVITY_LIMIT);
    activity = seeded;
    persistActivity();
    return seeded;
  }

  function recordActivity(entry) {
    activity.push(Object.assign({ t: Date.now() }, entry));
    if (activity.length > ACTIVITY_LIMIT) activity.splice(0, activity.length - ACTIVITY_LIMIT);
    persistActivity();
    renderProgress();
  }

  function awardPoints(amount) {
    if (window.tpPractice && typeof window.tpPractice.addPoints === 'function') {
      window.tpPractice.addPoints(amount);
    }
  }

  /* -------------------------------------------------------------- progress */

  const dayKey = (time) => {
    const d = new Date(time);
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  };
  const shortDate = (time) => new Date(time).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

  function currentStreak() {
    const days = new Set(activity.map((entry) => dayKey(entry.t)));
    const cursor = new Date();
    cursor.setHours(0, 0, 0, 0);
    if (!days.has(dayKey(cursor.getTime()))) cursor.setDate(cursor.getDate() - 1);
    let streak = 0;
    while (days.has(dayKey(cursor.getTime()))) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    }
    return streak;
  }

  function renderStats() {
    const timed = activity.filter((entry) => entry.kind !== 'quiz' && entry.ms > 0);
    const scored = activity.filter((entry) => entry.kind !== 'lcm');
    const best = timed.length ? Math.min(...timed.map((entry) => entry.ms)) : null;
    const avgScore = scored.length
      ? Math.round(scored.reduce((sum, entry) => sum + entry.score, 0) / scored.length)
      : null;
    const tiles = [
      [t('statCompleted'), fmt(activity.length)],
      [t('statBest'), best === null ? t('statNone') : formatDuration(best)],
      [t('statScore'), avgScore === null ? t('statNone') : avgScore + '%'],
      [t('statStreak'), fmt(currentStreak())]
    ];
    $('#progressStats').innerHTML = tiles.map(([label, value]) =>
      '<div class="tp-stat"><div class="tp-stat-value">' + value + '</div><div class="tp-stat-label">' + label + '</div></div>'
    ).join('');
  }

  function niceCeil(value) {
    if (value <= 0) return 1;
    const magnitude = Math.pow(10, Math.floor(Math.log10(value)));
    const n = value / magnitude;
    const step = [1, 2, 2.5, 5, 10].find((candidate) => n <= candidate) || 10;
    return step * magnitude;
  }

  function buildSeries(metric, filter) {
    const items = activity.filter((entry) => filter === 'all' || entry.kind === filter);
    if (metric === 'daily') {
      const counts = new Map();
      items.forEach((entry) => counts.set(dayKey(entry.t), (counts.get(dayKey(entry.t)) || 0) + 1));
      const points = [];
      for (let back = 13; back >= 0; back--) {
        const date = new Date();
        date.setHours(0, 0, 0, 0);
        date.setDate(date.getDate() - back);
        const count = counts.get(dayKey(date.getTime())) || 0;
        points.push({ label: shortDate(date.getTime()), sub: '', y: count, text: fmt(count), kind: '' });
      }
      const max = Math.max(4, ...points.map((point) => point.y));
      return { points, avg: null, yMax: Math.ceil(max / 4) * 4, unit: t('unitCount'), hasData: items.length > 0, title: t('metricDaily') };
    }
    const source = metric === 'score' ? items.filter((entry) => entry.kind !== 'lcm') : items;
    const visible = source.slice(-CHART_POINT_LIMIT);
    const offset = source.length - visible.length;
    const points = visible.map((entry, index) => {
      const y = metric === 'time' ? entry.ms / 60000 : entry.score;
      return {
        label: '#' + (offset + index + 1),
        sub: shortDate(entry.t),
        y,
        text: metric === 'time' ? formatDuration(entry.ms) : Math.round(entry.score) + '%',
        kind: entry.kind
      };
    });
    const avg = points.map((_, index) => {
      const slice = points.slice(Math.max(0, index - 4), index + 1);
      return slice.reduce((sum, point) => sum + point.y, 0) / slice.length;
    });
    const yMax = metric === 'score' ? 100 : niceCeil(Math.max(1, ...points.map((point) => point.y)) * 1.15);
    return {
      points, avg, yMax, hasData: points.length > 0,
      unit: metric === 'time' ? t('unitMinutes') : t('unitScore'),
      title: metric === 'time' ? t('metricTime') : t('metricScore'),
      isTime: metric === 'time'
    };
  }

  function drawChart(series) {
    const svg = $('#progressChart');
    const W = 640, H = 270, L = 46, R = 18, T = 28, B = 36;
    const iw = W - L - R, ih = H - T - B;
    const n = series.points.length;
    const xAt = (i) => n <= 1 ? L + iw / 2 : L + iw * i / (n - 1);
    const yAt = (v) => T + ih - ih * Math.min(v, series.yMax) / series.yMax;
    const yText = (v) => series.isTime ? (v < 10 ? v.toFixed(1) : String(Math.round(v))) : String(Math.round(v * 10) / 10);
    let markup = '<text class="tp-axis-title" x="' + L + '" y="14">' + series.unit + '</text>';

    for (let k = 0; k <= 4; k++) {
      const value = series.yMax * k / 4;
      const y = yAt(value);
      markup += '<line class="tp-grid" x1="' + L + '" x2="' + (W - R) + '" y1="' + y + '" y2="' + y + '"></line>' +
        '<text class="tp-tick" x="' + (L - 8) + '" y="' + (y + 4) + '" text-anchor="end">' + yText(value) + '</text>';
    }
    const step = Math.max(1, Math.ceil(n / 7));
    series.points.forEach((point, i) => {
      const isLast = i === n - 1;
      const tooClose = isLast && (n - 1) % step !== 0 && (n - 1) % step < step / 2;
      if (i % step === 0 || (isLast && !tooClose)) {
        markup += '<text class="tp-tick" x="' + xAt(i) + '" y="' + (H - 12) + '" text-anchor="middle">' + point.label + '</text>';
      }
    });

    const path = (values) => values.map((v, i) => (i === 0 ? 'M' : 'L') + xAt(i).toFixed(1) + ' ' + yAt(v).toFixed(1)).join(' ');
    if (n > 1) markup += '<path class="tp-line tp-line-main" d="' + path(series.points.map((p) => p.y)) + '"></path>';
    if (series.avg && n > 1) {
      markup += '<path class="tp-line tp-line-avg" d="' + path(series.avg) + '"></path>';
      const lastY = yAt(series.avg[n - 1]);
      markup += '<text class="tp-direct-label" x="' + (W - R) + '" y="' + Math.max(T + 8, lastY - 10) + '" text-anchor="end">' + t('avgShort') + '</text>';
    }
    series.points.forEach((point, i) => {
      markup += '<circle class="tp-dot" cx="' + xAt(i).toFixed(1) + '" cy="' + yAt(point.y).toFixed(1) + '" r="4.5"></circle>';
    });
    markup += '<line class="tp-cross" id="progressCross" y1="' + T + '" y2="' + (T + ih) + '" style="display:none"></line>' +
      '<circle class="tp-dot-hover" id="progressHoverDot" r="8" style="display:none"></circle>';

    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    svg.innerHTML = markup;
    chartState = { W, H, xAt, yAt, series };
    const latest = n ? series.points[n - 1].text : '';
    svg.setAttribute('aria-label', fill(t('chartAria'), { title: series.title, count: n, latest }));
  }

  function showTip(index) {
    if (!chartState) return;
    const { W, H, xAt, yAt, series } = chartState;
    const point = series.points[index];
    if (!point) return;
    const svg = $('#progressChart');
    const rect = svg.getBoundingClientRect();
    const x = xAt(index), y = yAt(point.y);
    const cross = $('#progressCross'), dot = $('#progressHoverDot'), tip = $('#progressTip');
    cross.setAttribute('x1', x); cross.setAttribute('x2', x); cross.style.display = '';
    dot.setAttribute('cx', x); dot.setAttribute('cy', y); dot.style.display = '';
    const kindText = point.kind ? ' · ' + t('kind' + point.kind.charAt(0).toUpperCase() + point.kind.slice(1)) : '';
    tip.innerHTML = '<strong>' + point.text + '</strong><br><span>' + point.label +
      (point.sub ? ' · ' + point.sub : '') + kindText + '</span>';
    tip.hidden = false;
    const left = Math.min(Math.max(x / W * rect.width, 60), rect.width - 60);
    tip.style.left = left + 'px';
    tip.style.top = (y / H * rect.height) + 'px';
  }

  function hideTip() {
    ['#progressCross', '#progressHoverDot'].forEach((selector) => {
      const element = $(selector);
      if (element) element.style.display = 'none';
    });
    const tip = $('#progressTip');
    if (tip) tip.hidden = true;
  }

  function renderProgressTable(series) {
    const head = '<tr><th>' + t('tableNumber') + '</th><th>' + t('tableDate') + '</th><th>' + t('tableType') + '</th><th>' + t('tableValue') + '</th></tr>';
    const body = series.points.map((point, index) =>
      '<tr><td>' + (point.label.charAt(0) === '#' ? point.label.slice(1) : index + 1) + '</td><td>' +
      (point.sub || point.label) + '</td><td>' +
      (point.kind ? t('kind' + point.kind.charAt(0).toUpperCase() + point.kind.slice(1)) : '—') +
      '</td><td>' + point.text + '</td></tr>').join('');
    $('#progressTable').innerHTML = '<thead>' + head + '</thead><tbody>' + body + '</tbody>';
  }

  function renderProgress() {
    if (!$('#progressChart')) return;
    renderStats();
    const metric = $('#progressMetric').value;
    const filter = $('#progressFilter').value;
    const series = buildSeries(metric, filter);
    const showTable = $('#progressTableToggle').dataset.mode === 'table';
    const empty = $('#progressEmpty');
    const hasData = series.hasData;
    empty.hidden = hasData;
    empty.textContent = metric === 'score' ? t('emptyScore') : t('emptyProgress');
    $('#progressChartWrap').hidden = !hasData || showTable;
    $('#progressTableWrap').hidden = !hasData || !showTable;
    $('#progressLegend').hidden = !hasData || showTable || metric === 'daily';
    $('#progressLegend').innerHTML = '<span><i class="tp-swatch tp-swatch-main"></i>' + t('legendEach') +
      '</span><span><i class="tp-swatch tp-swatch-avg"></i>' + t('legendAvg') + '</span>';
    $('#progressTableToggle').textContent = showTable ? t('showChart') : t('showTable');
    hideTip();
    if (!hasData) return;
    drawChart(series);
    renderProgressTable(series);
  }

  function initProgress() {
    const svg = $('#progressChart');
    svg.addEventListener('pointermove', (event) => {
      if (!chartState || !chartState.series.points.length) return;
      const rect = svg.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width * chartState.W;
      let best = 0, distance = Infinity;
      chartState.series.points.forEach((_, i) => {
        const d = Math.abs(chartState.xAt(i) - x);
        if (d < distance) { distance = d; best = i; }
      });
      showTip(best);
    });
    svg.addEventListener('pointerleave', hideTip);
    $('#progressMetric').addEventListener('change', renderProgress);
    $('#progressFilter').addEventListener('change', renderProgress);
    $('#progressTableToggle').addEventListener('click', () => {
      const button = $('#progressTableToggle');
      button.dataset.mode = button.dataset.mode === 'table' ? 'chart' : 'table';
      renderProgress();
    });
    window.addEventListener('tp-practice-completed', (event) => {
      const detail = event.detail || {};
      recordActivity({ kind: 'lcm', level: detail.difficulty || '', ms: Number(detail.durationMs) || 0, score: 100 });
    });
  }

  /* ------------------------------------------------------- matrix drawing */

  const heatLevel = (costs, value) => {
    const all = costs.flat();
    const min = Math.min(...all), max = Math.max(...all);
    return min === max ? 1 : 1 + Math.round(((value - min) / (max - min)) * 4);
  };

  function matrixHtml(problem, options) {
    const opts = options || {};
    const rows = problem.supply.length, cols = problem.demand.length;
    let html = '<thead><tr><th></th>';
    problem.colLabels.forEach((label) => { html += '<th>' + label + '</th>'; });
    html += '<th>' + t('supply') + '</th></tr></thead><tbody>';
    for (let i = 0; i < rows; i++) {
      html += '<tr><th class="row-label">' + problem.rowLabels[i] + '</th>';
      for (let j = 0; j < cols; j++) {
        const heat = opts.heat ? ' practice-cost-cell practice-heat-' + heatLevel(problem.costs, problem.costs[i][j]) : '';
        html += '<td class="tp-cell' + heat + '"><span class="practice-cost">' + fmtMoney(problem.costs[i][j]) + '</span>';
        if (opts.alloc) {
          const key = i + ',' + j;
          if (opts.hidden && opts.hidden.has(key)) {
            const saved = opts.values && opts.values[key] !== undefined ? opts.values[key] : '';
            html += '<input type="number" min="0" step="1" inputmode="numeric" class="form-control form-control-sm practice-allocation tp-guided-input" data-i="' + i + '" data-j="' + j +
              '" aria-label="' + fill(t('blankLabel'), { source: problem.rowLabels[i], destination: problem.colLabels[j] }) + '" value="' + saved + '">';
          } else {
            const amount = opts.alloc[i][j];
            html += '<strong class="tp-given' + (amount === 0 ? ' tp-given-zero' : '') + '" title="' + t('given') + '">' + fmt(amount) + '</strong>';
          }
        }
        html += '</td>';
      }
      html += '<td class="supply-cell fw-semibold">' + fmt(problem.supply[i]) + '</td></tr>';
    }
    html += '<tr><th class="row-label">' + t('demand') + '</th>';
    problem.demand.forEach((value) => { html += '<td class="demand-cell fw-semibold">' + fmt(value) + '</td>'; });
    html += '<td class="lab grand-total-cell fw-semibold">' + (opts.noTotal ? '' : fmt(problem.totalSupplyBalanced)) + '</td></tr></tbody>';
    return html;
  }

  const withTotals = (balanced) => Object.assign({}, balanced, {
    totalSupplyBalanced: balanced.supply.reduce((sum, value) => sum + value, 0)
  });

  function randomPartsMin(total, count, min) {
    const remaining = total - min * count;
    const cuts = Array.from({ length: count - 1 }, () => randInt(0, remaining)).sort((a, b) => a - b);
    const edges = [0, ...cuts, remaining];
    return edges.slice(1).map((edge, index) => edge - edges[index] + min);
  }

  function makeLcmProblem(rows, cols, supplyTotal, demandTotal, minPart) {
    const supply = randomPartsMin(supplyTotal, rows, minPart);
    const demand = randomPartsMin(demandTotal, cols, minPart);
    const costValues = shuffle(Array.from({ length: rows * cols }, (_, index) => index + 1));
    const costs = Array.from({ length: rows }, (_, i) => costValues.slice(i * cols, (i + 1) * cols));
    const balanced = window.LCM.balanceProblem(costs, supply, demand);
    const solution = window.LCM.solveLCM(costs, supply, demand, 'first');
    return { costs, supply, demand, balanced, solution };
  }

  /* ---------------------------------------------------------------- guided */

  function makeGuidedProblem(kind, level) {
    let rows, cols, supplyTotal, demandTotal, minPart;
    if (level === 'easy') {
      rows = Math.random() < 0.5 ? 2 : 3; cols = 3;
      supplyTotal = demandTotal = randInt(45, 80); minPart = 6;
    } else if (level === 'medium') {
      rows = 3; cols = 4;
      supplyTotal = demandTotal = randInt(100, 180); minPart = 8;
    } else {
      rows = 4; cols = 5;
      supplyTotal = randInt(150, 230);
      demandTotal = supplyTotal + (Math.random() < 0.5 ? -1 : 1) * randInt(8, 24);
      minPart = 10;
    }
    const base = makeLcmProblem(rows, cols, supplyTotal, demandTotal, minPart);
    const terms = base.solution.terms;
    const hidden = new Set();
    if (kind === 'fill') {
      const wanted = { easy: 2, medium: 3, hard: 4 }[level];
      const count = Math.max(1, Math.min(wanted, terms.length - 1));
      // The cells LCM uses never form a loop, so every hidden cell can be worked out from the totals.
      shuffle(terms).slice(0, count).forEach((term) => hidden.add(term.row + ',' + term.col));
    }
    return {
      kind, level, startedAt: Date.now(), done: false,
      balanced: withTotals(base.balanced), solution: base.solution,
      hidden, values: {}, wrongChecks: 0, hintsUsed: 0, stepsShown: false, stepsUsed: false, hintCell: null
    };
  }

  function readGuidedValues() {
    const values = {};
    $$('.tp-guided-input', $('#guidedMatrix')).forEach((input) => {
      values[input.dataset.i + ',' + input.dataset.j] = input.value;
    });
    return values;
  }

  function renderGuidedMatrix() {
    if (!guided) return;
    const values = guided.done ? guided.values : Object.assign({}, guided.values, readGuidedValues());
    guided.values = values;
    $('#guidedMatrix').innerHTML = matrixHtml(guided.balanced, {
      heat: true, alloc: guided.solution.alloc, hidden: guided.hidden, values
    });
    if (guided.hintCell) {
      const input = $('.tp-guided-input[data-i="' + guided.hintCell[0] + '"][data-j="' + guided.hintCell[1] + '"]');
      if (input) input.closest('td').classList.add('practice-cost-hint');
    }
    if (guided.done) $$('.tp-guided-input', $('#guidedMatrix')).forEach((input) => { input.disabled = true; });
  }

  function renderGuided() {
    const area = $('#guidedArea');
    if (!guided) { area.hidden = true; return; }
    area.hidden = false;
    const isFill = guided.kind === 'fill';
    $('#guidedBadge').textContent = fill(t('guidedBadge'), {
      kind: t(isFill ? 'guidedKindFill' : 'guidedKindTotal'),
      level: levelName(guided.level),
      rows: guided.balanced.supply.length,
      columns: guided.balanced.demand.length
    });
    $('#guidedPointsInfo').textContent = fill(t('guidedPointsInfo'), { points: GUIDED_POINTS });
    $('#guidedTask').textContent = t(isFill ? 'guidedTaskFill' : 'guidedTaskTotal') +
      (guided.balanced.dummy ? ' ' + t('guidedDummyNote') : '');
    $('#guidedTotalRow').hidden = isFill;
    $('#guidedHint').hidden = !isFill;
    $('#guidedShowSteps').hidden = isFill;
    $('#guidedShowSteps').textContent = t(guided.stepsShown ? 'hideSteps' : 'showSteps');
    $('#guidedCostSign').textContent = currencySign();
    $('#guidedCheck').disabled = guided.done;
    $('#guidedHint').disabled = guided.done;
    $('#guidedShowSteps').disabled = guided.done;
    $('#guidedTotalInput').disabled = guided.done;
    renderGuidedMatrix();
    renderGuidedSteps();
    renderGuidedDone();
  }

  function renderGuidedSteps() {
    const box = $('#guidedSteps');
    if (!guided || guided.kind !== 'total' || !guided.stepsShown) { box.hidden = true; return; }
    const rows = guided.solution.terms.map((term) =>
      '<tr><th scope="row">' + cellName(guided.balanced.rowLabels[term.row], guided.balanced.colLabels[term.col]) + '</th><td>' +
      fmtMoney(term.cost) + '</td><td>' + fmt(term.quantity) + '</td><td>' + fmtMoney(term.product) + '</td></tr>').join('');
    box.innerHTML = '<p class="small text-muted mb-2">' + t('stepsHelp') + '</p><div class="table-responsive">' +
      '<table class="table table-sm table-bordered text-center align-middle mb-0"><thead><tr><th>' + t('stepsRoute') +
      '</th><th>' + t('stepsUnit') + '</th><th>' + t('stepsQty') + '</th><th>' + t('stepsProduct') + '</th></tr></thead><tbody>' +
      rows + '</tbody></table></div>';
    box.hidden = false;
  }

  function setGuidedFeedback(message, tone) {
    const box = $('#guidedFeedback');
    if (!message) { box.hidden = true; return; }
    box.textContent = message;
    box.className = 'alert alert-' + tone + ' mt-3 mb-0';
    box.hidden = false;
  }

  function newGuided() {
    guided = makeGuidedProblem($('#guidedKind').value, $('#guidedLevel').value);
    $('#guidedMatrix').innerHTML = '';
    $('#guidedTotalInput').value = '';
    setGuidedFeedback('', 'info');
    $('#guidedDone').hidden = true;
    renderGuided();
  }

  function giveGuidedHint() {
    if (!guided || guided.done || guided.kind !== 'fill') return;
    const { balanced, solution } = guided;
    const values = readGuidedValues();
    const isRight = (key) => {
      const [i, j] = key.split(',').map(Number);
      return values[key] !== undefined && values[key].trim() !== '' && Number(values[key]) === solution.alloc[i][j];
    };
    const open = Array.from(guided.hidden).filter((key) => !isRight(key));
    if (!open.length) { setGuidedFeedback(t('guidedHintNone'), 'success'); return; }
    const openSet = new Set(open);
    const unknownIn = (axis, index) => open.filter((key) => Number(key.split(',')[axis === 'row' ? 0 : 1]) === index).length;
    let chosen = null;
    for (const key of open) {
      const [i, j] = key.split(',').map(Number);
      if (unknownIn('row', i) === 1) { chosen = { i, j, axis: 'row' }; break; }
      if (unknownIn('col', j) === 1) { chosen = { i, j, axis: 'col' }; break; }
    }
    if (!chosen) {
      const [i, j] = open[0].split(',').map(Number);
      chosen = { i, j, axis: 'row' };
    }
    const { i, j, axis } = chosen;
    let known = 0;
    if (axis === 'row') {
      for (let c = 0; c < balanced.demand.length; c++) if (c !== j) known += solution.alloc[i][c];
    } else {
      for (let r = 0; r < balanced.supply.length; r++) if (r !== i) known += solution.alloc[r][j];
    }
    if (openSet.size > 1 && unknownIn(axis, axis === 'row' ? i : j) > 1) known = '?';
    guided.hintsUsed += 1;
    guided.hintCell = [i, j];
    renderGuidedMatrix();
    setGuidedFeedback(fill(t(axis === 'row' ? 'guidedHintRow' : 'guidedHintCol'), {
      line: axis === 'row' ? balanced.rowLabels[i] : balanced.colLabels[j],
      total: fmt(axis === 'row' ? balanced.supply[i] : balanced.demand[j]),
      known: known === '?' ? '…' : fmt(known)
    }), 'info');
  }

  function checkGuided() {
    if (!guided || guided.done) return;
    guided.hintCell = null;
    if (guided.kind === 'fill') {
      const inputs = $$('.tp-guided-input', $('#guidedMatrix'));
      let missing = false, wrong = 0;
      const marks = [];
      inputs.forEach((input) => {
        const raw = input.value.trim();
        const value = raw === '' ? NaN : Number(raw);
        const expected = guided.solution.alloc[Number(input.dataset.i)][Number(input.dataset.j)];
        if (raw === '') missing = true;
        const ok = Number.isInteger(value) && value === expected;
        if (!ok) wrong += 1;
        marks.push([input, ok]);
      });
      inputs.forEach((input) => {
        input.classList.remove('practice-allocation-correct', 'practice-allocation-incorrect');
        input.closest('td').classList.remove('practice-cell-correct', 'practice-cell-incorrect', 'practice-cost-hint');
      });
      if (missing) { setGuidedFeedback(t('guidedFillAll'), 'warning'); return; }
      marks.forEach(([input, ok]) => {
        input.classList.add(ok ? 'practice-allocation-correct' : 'practice-allocation-incorrect');
        input.closest('td').classList.add(ok ? 'practice-cell-correct' : 'practice-cell-incorrect');
      });
      if (wrong === 0) { finishGuided(); return; }
      guided.wrongChecks += 1;
      setGuidedFeedback(fill(t('guidedFillWrong'), { count: wrong }), 'warning');
      return;
    }
    const raw = $('#guidedTotalInput').value.trim();
    if (raw === '') { setGuidedFeedback(t('guidedEnterTotal'), 'warning'); return; }
    const value = Number(raw);
    if (Number.isFinite(value) && Math.abs(value - guided.solution.total) < 1e-9) { finishGuided(); return; }
    guided.wrongChecks += 1;
    let message = value > guided.solution.total ? t('guidedTooHigh') : t('guidedTooLow');
    if (guided.wrongChecks >= 2 && !guided.stepsShown) message += ' ' + t('guidedTrySteps');
    setGuidedFeedback(message, 'warning');
  }

  function finishGuided() {
    guided.values = readGuidedValues();
    guided.done = true;
    const ms = Date.now() - guided.startedAt;
    const score = Math.max(25, 100 - 20 * guided.wrongChecks - 10 * guided.hintsUsed);
    let points = GUIDED_POINTS;
    if (guided.kind === 'fill') points = Math.max(4, GUIDED_POINTS - 3 * guided.hintsUsed);
    else if (guided.stepsUsed) points = 5;
    guided.result = { ms, score, points };
    awardPoints(points);
    recordActivity({ kind: 'guided', level: guided.level, ms, score });
    setGuidedFeedback('', 'info');
    renderGuided();
  }

  function renderGuidedDone() {
    const box = $('#guidedDone');
    if (!guided || !guided.done) { box.hidden = true; return; }
    $('#guidedDoneTitle').textContent = t('guidedCorrectTitle');
    $('#guidedDoneMessage').textContent = fill(t('guidedCorrectMessage'), { time: formatDuration(guided.result.ms), score: guided.result.score });
    $('#guidedDonePoints').textContent = fill(t('pointsEarned'), { points: guided.result.points });
    box.hidden = false;
    if (guided.kind === 'fill') renderGuidedMatrixAllCorrect();
  }

  function renderGuidedMatrixAllCorrect() {
    $$('.tp-guided-input', $('#guidedMatrix')).forEach((input) => {
      input.classList.add('practice-allocation-correct');
      input.closest('td').classList.add('practice-cell-correct');
    });
  }

  function initGuided() {
    $('#guidedNew').addEventListener('click', newGuided);
    $('#guidedDoneNext').addEventListener('click', newGuided);
    $('#guidedCheck').addEventListener('click', checkGuided);
    $('#guidedHint').addEventListener('click', giveGuidedHint);
    $('#guidedShowSteps').addEventListener('click', () => {
      if (!guided || guided.done) return;
      guided.stepsShown = !guided.stepsShown;
      if (guided.stepsShown) guided.stepsUsed = true;
      renderGuided();
    });
    $('#guidedTotalInput').addEventListener('keydown', (event) => {
      if (event.key === 'Enter') { event.preventDefault(); checkGuided(); }
    });
    $('#guidedMatrix').addEventListener('input', (event) => {
      if (!event.target.matches('.tp-guided-input')) return;
      event.target.classList.remove('practice-allocation-correct', 'practice-allocation-incorrect');
      event.target.closest('td').classList.remove('practice-cell-correct', 'practice-cell-incorrect');
    });
    $('#guidedKind').addEventListener('change', newGuided);
    $('#guidedLevel').addEventListener('change', newGuided);
  }

  /* ------------------------------------------------------------------ quiz */

  function miniProblem(rows, cols, total) {
    return makeLcmProblem(rows, cols, total, total, 5);
  }

  function describeTable(base) {
    return { problem: withTotals(base.balanced) };
  }

  function firstMove(base) {
    const step = base.solution.steps[0];
    return {
      row: step.row, col: step.col, cell: step.cell, cost: step.cost,
      quantity: step.quantity, supply: step.supplyBefore, demand: step.demandBefore,
      rowGone: step.rowEliminated, colGone: step.colEliminated
    };
  }

  function uniqueNumbers(correct, candidates) {
    const set = new Set([correct]);
    candidates.forEach((value) => { if (Number.isFinite(value) && value > 0) set.add(value); });
    let guard = 0;
    while (set.size < 4 && guard++ < 50) set.add(Math.max(1, correct + randInt(-12, 12)));
    return Array.from(set).slice(0, 4);
  }

  const generatedQuestions = [
    function firstCell() {
      const base = miniProblem(3, 3, randInt(40, 80));
      const move = firstMove(base);
      const cells = [];
      for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) cells.push([i, j]);
      const others = shuffle(cells.filter(([i, j]) => !(i === move.row && j === move.col))).slice(0, 3);
      const name = ([i, j]) => cellName('Factory' + (i + 1), 'City' + (j + 1));
      return {
        type: 'mc', table: describeTable(base),
        prompt: ['Using the Least Cost Method, which cell gets the first allocation?', 'Gamit ang Least Cost Method, aling cell ang unang lalagyan ng allocation?'],
        options: shuffle([{ label: name([move.row, move.col]), correct: true }].concat(others.map((cell) => ({ label: name(cell), correct: false })))),
        explain: ['The lowest unit cost in the table is {cost}, found at {cell}. LCM always starts with the cheapest route.', 'Ang pinakamababang unit cost sa table ay {cost}, nasa {cell}. Laging nagsisimula ang LCM sa pinakamurang ruta.'],
        vars: { cost: fmtMoney(move.cost), cell: move.cell }
      };
    },
    function firstQuantity() {
      const base = miniProblem(3, 3, randInt(40, 80));
      const move = firstMove(base);
      const numbers = shuffle(uniqueNumbers(move.quantity, [Math.max(move.supply, move.demand), move.supply + move.demand, move.supply, move.demand]));
      return {
        type: 'mc', table: describeTable(base),
        prompt: ['The first allocation goes to {cell}. How many units are allocated there?', 'Ang unang allocation ay sa {cell}. Ilang units ang ilalagay doon?'],
        vars: { cell: move.cell },
        options: numbers.map((value) => ({ label: fmt(value), correct: value === move.quantity })),
        explain: ['Allocate the smaller of the supply ({supply}) and the demand ({demand}), so {answer} units.', 'Ilagay ang mas maliit sa supply ({supply}) at demand ({demand}), kaya {answer} units.'],
        explainVars: { supply: fmt(move.supply), demand: fmt(move.demand), answer: fmt(move.quantity) }
      };
    },
    function balanceCheck() {
      const mode = pick(['balanced', 'supply', 'demand']);
      const rows = 3, cols = 3;
      const supplyTotal = randInt(50, 90);
      const diff = randInt(6, 18);
      const demandTotal = mode === 'balanced' ? supplyTotal : mode === 'supply' ? supplyTotal - diff : supplyTotal + diff;
      const supply = randomPartsMin(supplyTotal, rows, 6);
      const demand = randomPartsMin(demandTotal, cols, 6);
      const costs = Array.from({ length: rows }, () => Array.from({ length: cols }, () => randInt(1, 12)));
      const correct = mode === 'balanced' ? 0 : mode === 'supply' ? 1 : 2;
      const labels = [
        ['Balanced — no dummy needed', 'Balanse — hindi kailangan ng dummy'],
        ['Add a dummy destination (supply is higher)', 'Magdagdag ng dummy destination (mas mataas ang supply)'],
        ['Add a dummy source (demand is higher)', 'Magdagdag ng dummy source (mas mataas ang demand)']
      ];
      return {
        type: 'mc', table: { problem: withTotals({ costs, supply, demand, rowLabels: ['Factory1', 'Factory2', 'Factory3'], colLabels: ['City1', 'City2', 'City3'] }) },
        prompt: ['Add up the supplies and the demands. What should you do before using LCM?', 'Idagdag ang mga supply at mga demand. Ano ang dapat gawin bago gamitin ang LCM?'],
        options: labels.map((label, index) => ({ label, correct: index === correct })),
        explain: ['Total supply is {supply} and total demand is {demand}. {verdict}', 'Ang kabuuang supply ay {supply} at ang kabuuang demand ay {demand}. {verdict}'],
        explainVars: { supply: fmt(supplyTotal), demand: fmt(demandTotal) },
        verdict: [
          ['They are equal, so the problem is balanced.', 'Magkapantay ang mga ito, kaya balanse ang problema.'],
          ['Supply is higher, so add a dummy destination for the extra {diff} units.', 'Mas mataas ang supply, kaya magdagdag ng dummy destination para sa sobrang {diff} units.'],
          ['Demand is higher, so add a dummy source for the missing {diff} units.', 'Mas mataas ang demand, kaya magdagdag ng dummy source para sa kulang na {diff} units.']
        ][correct],
        verdictVars: { diff: fmt(Math.abs(supplyTotal - demandTotal)) }
      };
    },
    function totalSupplyOrDemand() {
      const base = miniProblem(3, 3, randInt(40, 90));
      const askSupply = Math.random() < 0.5;
      const total = base.balanced.supply.reduce((sum, value) => sum + value, 0);
      return {
        type: 'num', table: describeTable(base), answer: total,
        prompt: askSupply
          ? ['What is the total supply of all factories?', 'Magkano ang kabuuang supply ng lahat ng factory?']
          : ['What is the total demand of all cities?', 'Magkano ang kabuuang demand ng lahat ng city?'],
        explain: ['Add the {what}: the total is {answer}.', 'Idagdag ang {what}: ang kabuuan ay {answer}.'],
        explainVars: { answer: fmt(total) },
        whatPair: askSupply ? ['supplies', 'mga supply'] : ['demands', 'mga demand']
      };
    },
    function shipmentCost() {
      const quantity = randInt(5, 40), cost = randInt(2, 15);
      const source = 'Factory' + randInt(1, 3), destination = 'City' + randInt(1, 3);
      return {
        type: 'num', table: null, answer: quantity * cost, answerIsMoney: true,
        prompt: ['{source} ships {quantity} units to {destination} at a unit cost of {cost}. What is the cost of this shipment?', 'Ang {source} ay nagpapadala ng {quantity} units sa {destination} sa unit cost na {cost}. Magkano ang gastos ng shipment na ito?'],
        vars: { source, destination, quantity, cost: fmtMoney(cost) },
        explain: ['Shipment cost = unit cost × quantity = {cost} × {quantity} = {answer}.', 'Gastos ng shipment = unit cost × dami = {cost} × {quantity} = {answer}.'],
        explainVars: { cost: fmtMoney(cost), quantity, answer: fmtMoney(quantity * cost) }
      };
    },
    function remainingSupply() {
      const base = miniProblem(3, 3, randInt(40, 80));
      const move = firstMove(base);
      const remaining = move.supply - move.quantity;
      return {
        type: 'num', table: describeTable(base), answer: remaining,
        prompt: ['After the first allocation at {cell}, how much supply is left at {source}?', 'Pagkatapos ng unang allocation sa {cell}, magkano pa ang natitirang supply sa {source}?'],
        vars: { cell: move.cell, source: 'Factory' + (move.row + 1) },
        explain: ['{supply} − {quantity} = {answer} units of supply remain.', '{supply} − {quantity} = {answer} units ng supply ang natitira.'],
        explainVars: { supply: fmt(move.supply), quantity: fmt(move.quantity), answer: fmt(remaining) }
      };
    },
    function smallTotalCost() {
      const total = randInt(20, 40);
      const small = makeLcmProblem(2, 2, total, total, 5);
      const answer = small.solution.total;
      return {
        type: 'num', table: describeTable(small), answer,
        prompt: ['Solve this small problem with the Least Cost Method. What is the total least cost?', 'Lutasin ang maliit na problemang ito gamit ang Least Cost Method. Magkano ang kabuuang least cost?'],
        explain: ['Allocate in order of lowest cost, then add unit cost × quantity for each used route. The total is {answer}.', 'Mag-allocate ayon sa pinakamababang cost, saka idagdag ang unit cost × dami ng bawat ginamit na ruta. Ang kabuuan ay {answer}.'],
        explainVars: { answer: fmtMoney(answer) }, answerIsMoney: true
      };
    },
    function eliminated() {
      const base = miniProblem(3, 3, randInt(40, 80));
      const move = firstMove(base);
      const correct = move.rowGone && move.colGone ? 2 : move.rowGone ? 0 : 1;
      const labels = [
        ['{source} is crossed out (its supply is used up)', '{source} ay tatanggalin (naubos na ang supply nito)'],
        ['{destination} is crossed out (its demand is met)', '{destination} ay tatanggalin (natugunan na ang demand nito)'],
        ['Both are crossed out', 'Parehong tatanggalin']
      ];
      const vars = { source: 'Factory' + (move.row + 1), destination: 'City' + (move.col + 1) };
      return {
        type: 'mc', table: describeTable(base), vars,
        prompt: ['After the first allocation at {source} → {destination}, what gets crossed out?', 'Pagkatapos ng unang allocation sa {source} → {destination}, ano ang tatanggalin?'],
        options: labels.map((label, index) => ({ label: [fill(label[0], vars), fill(label[1], vars)], correct: index === correct })),
        explain: ['The allocation was {quantity}: supply was {supply} and demand was {demand}, so the smaller one is used up first.', 'Ang allocation ay {quantity}: ang supply ay {supply} at ang demand ay {demand}, kaya ang mas maliit ang unang maubos.'],
        explainVars: { quantity: fmt(move.quantity), supply: fmt(move.supply), demand: fmt(move.demand) }
      };
    }
  ];

  const concepts = [
    { p: ['The Least Cost Method starts by choosing the cell with the…', 'Nagsisimula ang Least Cost Method sa cell na may…'], o: [['lowest unit cost', 'pinakamababang unit cost'], ['highest unit cost', 'pinakamataas na unit cost'], ['largest supply', 'pinakamalaking supply'], ['top-left corner', 'kaliwang itaas na sulok']], c: 0, e: ['LCM looks at the unit costs and always picks the cheapest available route first.', 'Tinitingnan ng LCM ang mga unit cost at laging pinipili muna ang pinakamurang available na ruta.'] },
    { p: ['How many units do you allocate to the chosen cell?', 'Ilang units ang ilalagay sa napiling cell?'], o: [['The smaller of the remaining supply and remaining demand', 'Ang mas maliit sa natitirang supply at natitirang demand'], ['The larger of the two', 'Ang mas malaki sa dalawa'], ['Supply plus demand', 'Supply at demand na pinagsama'], ['Always 1 unit', 'Laging 1 unit']], c: 0, e: ['Allocating the smaller amount uses up either the row or the column without going over.', 'Kapag ang mas maliit ang inilagay, mauubos ang row o column nang hindi lumalampas.'] },
    { p: ['Total supply is greater than total demand. What do you add?', 'Mas mataas ang kabuuang supply kaysa kabuuang demand. Ano ang idaragdag?'], o: [['A dummy destination that absorbs the difference', 'Isang dummy destination na tatanggap ng pagkakaiba'], ['A dummy source', 'Isang dummy source'], ['Nothing — solve as it is', 'Wala — lutasin nang ganoon'], ['Double every demand', 'I-double ang bawat demand']], c: 0, e: ['The extra supply needs somewhere to “go”, so a dummy destination is added with demand equal to the difference.', 'Kailangan ng mapupuntahan ng sobrang supply, kaya nagdaragdag ng dummy destination na ang demand ay katumbas ng pagkakaiba.'] },
    { p: ['What is the unit cost of a route to or from a dummy source or destination?', 'Magkano ang unit cost ng ruta papunta o mula sa dummy source o destination?'], o: [['0', '0'], ['The average cost', 'Ang average na cost'], ['The highest cost in the table', 'Ang pinakamataas na cost sa table'], ['1', '1']], c: 0, e: ['Dummy routes are not real shipments, so they cost nothing.', 'Hindi totoong shipment ang dummy routes, kaya walang gastos.'] },
    { p: ['In Practice Mode, which cell is chosen first when two cells tie for the lowest cost?', 'Sa Practice Mode, aling cell ang unang pipiliin kapag magkatabla ang dalawang cell sa pinakamababang cost?'], o: [['The first one found top-to-bottom, then left-to-right', 'Ang unang makita mula itaas-pababa, saka kaliwa-pakanan'], ['A random one', 'Isang random na cell'], ['The last one found', 'Ang huling makita'], ['The one with the larger supply only', 'Ang may mas malaking supply lang']], c: 0, e: ['Practice Mode uses a fixed tie rule so everyone gets the same answer: top-to-bottom, then left-to-right.', 'May nakatakdang tie rule ang Practice Mode para pareho ang sagot ng lahat: itaas-pababa, saka kaliwa-pakanan.'] },
    { p: ['When a source has no supply left, what happens to its row?', 'Kapag naubos na ang supply ng isang source, ano ang mangyayari sa row nito?'], o: [['It is crossed out — no more allocations there', 'Tatanggalin ito — wala nang allocation doon'], ['Its costs are doubled', 'Dodoblehin ang mga cost nito'], ['It stays active', 'Mananatili itong aktibo'], ['It turns into a dummy', 'Magiging dummy ito']], c: 0, e: ['A used-up row can ship nothing more, so LCM ignores it from then on.', 'Wala nang maipapadala ang naubos na row, kaya hindi na ito pinapansin ng LCM.'] },
    { p: ['A balanced problem with m sources and n destinations has at most how many allocated cells in a basic feasible solution?', 'Sa balanseng problema na may m na source at n na destination, ilan ang pinakamaraming allocated cell sa basic feasible solution?'], o: [['m + n − 1', 'm + n − 1'], ['m × n', 'm × n'], ['m + n', 'm + n'], ['m − n', 'm − n']], c: 0, e: ['Each allocation removes a row or a column, so a 3 × 4 problem uses at most 3 + 4 − 1 = 6 cells.', 'Bawat allocation ay nag-aalis ng row o column, kaya ang 3 × 4 na problema ay may pinakamaraming 3 + 4 − 1 = 6 na cell.'] },
    { p: ['Does the Least Cost Method always give the cheapest possible plan?', 'Lagi bang pinakamurang posibleng plano ang ibinibigay ng Least Cost Method?'], o: [['No — it gives a good starting plan that may still be improved', 'Hindi — magandang panimulang plano ito na maaari pang pagbutihin'], ['Yes, always', 'Oo, palagi'], ['Only for 2 × 2 problems', 'Sa 2 × 2 na problema lang'], ['Only when demand is higher', 'Kapag mas mataas lang ang demand']], c: 0, e: ['LCM finds an initial feasible solution. Methods such as MODI can test it and improve it.', 'Ang LCM ay naghahanap ng initial feasible solution. Ang mga paraan tulad ng MODI ay maaaring sumubok at magpabuti nito.'] },
    { p: ['How is the total transportation cost calculated?', 'Paano kinukuwenta ang kabuuang gastos sa transportasyon?'], o: [['Add unit cost × quantity for every used route', 'Idagdag ang unit cost × dami ng bawat ginamit na ruta'], ['Add every unit cost in the table', 'Idagdag ang bawat unit cost sa table'], ['Multiply total supply by the lowest cost', 'I-multiply ang kabuuang supply sa pinakamababang cost'], ['Add all supplies and demands', 'Idagdag ang lahat ng supply at demand']], c: 0, e: ['Only routes that carry units count, and each costs unit cost × units shipped.', 'Mga rutang may dalang units lang ang binibilang, at bawat isa ay unit cost × units na ipinadala.'] },
    { p: ['A transportation problem is balanced when…', 'Balanse ang isang transportation problem kapag…'], o: [['total supply equals total demand', 'magkapantay ang kabuuang supply at kabuuang demand'], ['every cost is the same', 'pareho ang lahat ng cost'], ['there are as many rows as columns', 'pareho ang dami ng rows at columns'], ['all supplies are equal', 'pantay ang lahat ng supply']], c: 0, e: ['Balanced means every unit supplied has a place to go and every demand can be met exactly.', 'Ang balanse ay nangangahulugang may mapupuntahan ang bawat suplay at matutugunan nang eksakto ang bawat demand.'] },
    { p: ['One allocation uses up a row’s supply and a column’s demand at the same time. This situation is called…', 'Kapag naubos ng isang allocation ang supply ng row at demand ng column nang sabay, tinatawag itong…'], o: [['degeneracy', 'degeneracy'], ['infeasibility', 'infeasibility'], ['balancing', 'balancing'], ['optimality', 'optimality']], c: 0, e: ['Both the row and the column are removed, so the solution has fewer than m + n − 1 allocated cells.', 'Parehong natatanggal ang row at column, kaya mas kaunti sa m + n − 1 ang allocated cell.'] },
    { p: ['Compared with the Northwest Corner Method, the Least Cost Method usually gives…', 'Kumpara sa Northwest Corner Method, ang Least Cost Method ay karaniwang nagbibigay ng…'], o: [['a cheaper starting plan, because it looks at costs', 'mas murang panimulang plano, dahil tinitingnan nito ang mga cost'], ['a more expensive plan', 'mas mahal na plano'], ['exactly the same plan', 'eksaktong parehong plano'], ['no plan at all', 'walang plano']], c: 0, e: ['The Northwest Corner Method ignores costs; LCM uses them, so it usually starts closer to the best answer.', 'Hindi tinitingnan ng Northwest Corner Method ang cost; ginagamit ito ng LCM kaya karaniwang mas malapit sa pinakamagandang sagot ang simula.'] },
    { p: ['In a transportation table, the rows usually represent…', 'Sa transportation table, ang rows ay karaniwang kumakatawan sa…'], o: [['sources (where goods start)', 'mga source (pinagmulan ng produkto)'], ['destinations', 'mga destination'], ['unit costs', 'mga unit cost'], ['totals only', 'mga total lamang']], c: 0, e: ['Rows are the sources or factories with a supply; columns are the destinations with a demand.', 'Ang rows ay mga source o factory na may supply; ang columns ay mga destination na may demand.'] },
    { p: ['In the practice heatmap, a green cost cell means…', 'Sa heatmap ng practice, ang berdeng cost cell ay nangangahulugang…'], o: [['a low unit cost', 'mababang unit cost'], ['a high unit cost', 'mataas na unit cost'], ['a dummy route', 'dummy na ruta'], ['an allocated cell', 'allocated na cell']], c: 0, e: ['The heatmap shades costs from green (cheap) to red (expensive) to help you spot the cheapest routes.', 'Kinukulayan ng heatmap ang mga cost mula berde (mura) hanggang pula (mahal) para madaling makita ang pinakamurang ruta.'] },
    { p: ['What does “demand” mean in a transportation problem?', 'Ano ang ibig sabihin ng “demand” sa transportation problem?'], o: [['The quantity a destination needs to receive', 'Ang dami na kailangang matanggap ng isang destination'], ['The cost of one unit', 'Ang gastos ng isang unit'], ['The quantity a source can ship', 'Ang dami na kayang ipadala ng isang source'], ['The number of routes', 'Ang bilang ng mga ruta']], c: 0, e: ['Supply belongs to sources; demand belongs to destinations.', 'Ang supply ay sa mga source; ang demand ay sa mga destination.'] },
    { p: ['Which method picks its first cell without looking at costs, always starting at the top-left?', 'Aling paraan ang pumipili ng unang cell nang hindi tinitingnan ang cost, at laging nagsisimula sa kaliwang itaas?'], o: [['Northwest Corner Method', 'Northwest Corner Method'], ['Least Cost Method', 'Least Cost Method'], ['MODI method', 'MODI method'], ['Stepping-stone method', 'Stepping-stone method']], c: 0, e: ['“Northwest corner” literally means the top-left cell of the table.', 'Ang “northwest corner” ay literal na ang kaliwang itaas na cell ng table.'] },
    { p: ['When is the Least Cost Method finished?', 'Kailan tapos ang Least Cost Method?'], o: [['When all supply and all demand have been allocated', 'Kapag nailaan na ang lahat ng supply at demand'], ['After exactly one allocation', 'Pagkatapos ng eksaktong isang allocation'], ['When the lowest cost is 1', 'Kapag 1 ang pinakamababang cost'], ['When every cell has a number', 'Kapag may numero ang bawat cell']], c: 0, e: ['Keep choosing the cheapest remaining cell until nothing is left to ship or receive.', 'Magpatuloy sa pinakamurang natitirang cell hanggang wala nang ipapadala o tatanggapin.'] },
    { p: ['Why do we balance a problem before using LCM?', 'Bakit binabalanse ang problema bago gamitin ang LCM?'], o: [['So every unit of supply can be matched with demand', 'Para mapares ang bawat unit ng supply sa demand'], ['To make all costs equal', 'Para pantayin ang lahat ng cost'], ['To remove the lowest cost', 'Para alisin ang pinakamababang cost'], ['It is only for decoration', 'Pang-ayos lang ito']], c: 0, e: ['Without balance, some supply or demand would be left over, so the table would never finish cleanly.', 'Kapag hindi balanse, may matitirang supply o demand kaya hindi malinis na matatapos ang table.'] }
  ];

  function conceptQuestion(entry) {
    const options = entry.o.map((label, index) => ({ label, correct: index === entry.c }));
    return { type: 'mc', table: null, prompt: entry.p, options: shuffle(options), explain: entry.e };
  }

  function buildQuiz(mode) {
    const calcs = shuffle(generatedQuestions.map((_, index) => index));
    const notions = shuffle(concepts.map((_, index) => index));
    let questions = [];
    if (mode === 'calc') {
      questions = calcs.slice(0, QUIZ_LENGTH).map((index) => generatedQuestions[index]());
    } else if (mode === 'concept') {
      questions = notions.slice(0, QUIZ_LENGTH).map((index) => conceptQuestion(concepts[index]));
    } else {
      questions = calcs.slice(0, 3).map((index) => generatedQuestions[index]())
        .concat(notions.slice(0, 2).map((index) => conceptQuestion(concepts[index])));
      questions = shuffle(questions);
    }
    return { mode, questions, index: 0, correct: 0, startedAt: Date.now(), finished: false };
  }

  const optionText = (label) => typeof label === 'string' ? label : tx(label);

  function renderQuiz() {
    const area = $('#quizArea');
    if (!quiz) { area.hidden = true; return; }
    area.hidden = false;
    $('#quizResult').hidden = !quiz.finished;
    $('#quizQuestionBox').hidden = quiz.finished;
    if (quiz.finished) { renderQuizResult(); return; }

    const q = quiz.questions[quiz.index];
    $('#quizProgressText').textContent = fill(t('quizQuestionOf'), { n: quiz.index + 1, total: quiz.questions.length });
    $('#quizScoreText').textContent = fill(t('quizScoreSoFar'), { score: quiz.correct + ' / ' + quiz.questions.length });
    $('#quizProgressBar').style.width = (quiz.index / quiz.questions.length * 100) + '%';
    $('#quizPrompt').textContent = fill(tx(q.prompt), q.vars);

    const tableWrap = $('#quizTableWrap');
    tableWrap.hidden = !q.table;
    if (q.table) $('#quizTable').innerHTML = matrixHtml(q.table.problem, { heat: false, noTotal: true });

    const options = $('#quizOptions');
    const numeric = $('#quizNumeric');
    options.hidden = q.type !== 'mc';
    numeric.hidden = q.type !== 'num';
    options.replaceChildren();
    if (q.type === 'mc') {
      q.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'btn btn-outline-primary text-start tp-option';
        button.dataset.index = String(index);
        button.textContent = optionText(option.label);
        if (q.answered) {
          button.disabled = true;
          if (option.correct) button.classList.add('tp-option-correct');
          else if (q.chosen === index) button.classList.add('tp-option-wrong');
        }
        options.appendChild(button);
      });
    } else {
      $('#quizNumberSign').hidden = !q.answerIsMoney;
      $('#quizNumberSign').textContent = currencySign();
      $('#quizNumberInput').disabled = Boolean(q.answered);
      $('#quizSubmit').disabled = Boolean(q.answered);
      if (!q.answered) $('#quizNumberInput').value = '';
    }
    renderQuizFeedback(q);
  }

  function explanationText(q) {
    let message = fill(tx(q.explain), Object.assign({}, q.vars, q.explainVars));
    if (q.whatPair) message = message.replace('{what}', tx(q.whatPair));
    if (q.verdict) {
      message = message.replace('{verdict}', fill(tx(q.verdict), q.verdictVars));
    }
    return message;
  }

  function renderQuizFeedback(q) {
    const box = $('#quizFeedback');
    const next = $('#quizNext');
    if (!q.answered) { box.hidden = true; next.hidden = true; return; }
    const right = q.wasRight;
    let answerText = '';
    if (!right) {
      if (q.type === 'mc') answerText = fill(t('quizAnswerWas'), { answer: optionText(q.options.find((o) => o.correct).label) }) + ' ';
      else answerText = fill(t('quizAnswerWas'), { answer: q.answerIsMoney ? fmtMoney(q.answer) : fmt(q.answer) }) + ' ';
    }
    box.textContent = (right ? t('quizRight') : t('quizWrong')) + ' ' + answerText + explanationText(q);
    box.className = 'alert alert-' + (right ? 'success' : 'warning') + ' mt-3 mb-0';
    box.hidden = false;
    next.hidden = false;
    next.textContent = t(quiz.index === quiz.questions.length - 1 ? 'quizFinish' : 'quizNext');
  }

  function answerQuestion(wasRight, chosen) {
    const q = quiz.questions[quiz.index];
    if (q.answered) return;
    q.answered = true;
    q.wasRight = wasRight;
    q.chosen = chosen;
    if (wasRight) quiz.correct += 1;
    renderQuiz();
  }

  function submitNumeric() {
    const q = quiz && quiz.questions[quiz.index];
    if (!q || q.answered || q.type !== 'num') return;
    const raw = $('#quizNumberInput').value.trim();
    if (raw === '') {
      const box = $('#quizFeedback');
      box.textContent = t('quizEnterNumber');
      box.className = 'alert alert-warning mt-3 mb-0';
      box.hidden = false;
      return;
    }
    answerQuestion(Math.abs(Number(raw) - q.answer) < 1e-9, null);
  }

  function nextQuestion() {
    if (!quiz) return;
    if (quiz.index >= quiz.questions.length - 1) { finishQuiz(); return; }
    quiz.index += 1;
    renderQuiz();
  }

  function finishQuiz() {
    quiz.finished = true;
    const total = quiz.questions.length;
    const percent = Math.round(quiz.correct / total * 100);
    const perfect = quiz.correct === total;
    const points = quiz.correct * QUIZ_POINTS_EACH + (perfect ? QUIZ_PERFECT_BONUS : 0);
    quiz.result = { percent, points, perfect };
    if (points > 0) awardPoints(points);
    recordActivity({ kind: 'quiz', level: '', ms: Date.now() - quiz.startedAt, score: percent });
    renderQuiz();
  }

  function renderQuizResult() {
    const total = quiz.questions.length;
    const { percent, points, perfect } = quiz.result;
    $('#quizResultTitle').textContent = t('quizResultTitle');
    $('#quizResultScore').textContent = fill(t('quizResultScore'), { correct: quiz.correct, total, percent });
    $('#quizResultNote').textContent = t(perfect ? 'quizResultPerfect' : percent >= 60 ? 'quizResultGood' : 'quizResultKeep');
    $('#quizResultPoints').textContent = fill(t('pointsEarned'), { points });
    $('#quizProgressBar').style.width = '100%';
  }

  function startQuiz() {
    quiz = buildQuiz($('#quizMode').value);
    renderQuiz();
  }

  function initQuiz() {
    $('#quizStart').addEventListener('click', startQuiz);
    $('#quizAgain').addEventListener('click', startQuiz);
    $('#quizOptions').addEventListener('click', (event) => {
      const button = event.target.closest('.tp-option');
      if (!button || !quiz) return;
      const q = quiz.questions[quiz.index];
      const index = Number(button.dataset.index);
      answerQuestion(Boolean(q.options[index].correct), index);
    });
    $('#quizSubmit').addEventListener('click', submitNumeric);
    $('#quizNumberInput').addEventListener('keydown', (event) => {
      if (event.key === 'Enter') { event.preventDefault(); submitNumeric(); }
    });
    $('#quizNext').addEventListener('click', nextQuestion);
  }

  /* ------------------------------------------------------------- tabs, i18n */

  function showTab(name) {
    $$('[data-extra-tab]').forEach((button) => {
      const active = button.dataset.extraTab === name;
      button.classList.toggle('active', active);
      button.setAttribute('aria-selected', String(active));
    });
    $('#guidedTab').hidden = name !== 'guided';
    $('#quizTab').hidden = name !== 'quiz';
  }

  function renderStatic() {
    $$('[data-extra-text]').forEach((element) => { element.textContent = t(element.dataset.extraText); });
    $$('[data-extra-option]').forEach((option) => { option.textContent = t(option.dataset.extraOption); });
  }

  function renderAll() {
    renderStatic();
    renderProgress();
    renderGuided();
    if (quiz) renderQuiz();
  }

  function init() {
    if (!$('#progressChart') || !window.LCM) return;
    const select = $('#languageSelect');
    language = (select && select.value) || 'en';
    activity = loadActivity();
    initProgress();
    initGuided();
    initQuiz();
    $$('[data-extra-tab]').forEach((button) => {
      button.addEventListener('click', () => showTab(button.dataset.extraTab));
    });
    const currency = $('#practiceCurrency');
    if (currency) {
      currency.addEventListener('change', () => {
        renderGuided();
        if (quiz && !quiz.finished) renderQuiz();
      });
    }
    window.addEventListener('transportation-language-changed', (event) => {
      language = event.detail.language;
      renderAll();
    });
    showTab('guided');
    renderAll();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
