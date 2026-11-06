(function () {
  'use strict';

  const $ = (selector, root) => (root || document).querySelector(selector);
  const $$ = (selector, root) => Array.from((root || document).querySelectorAll(selector));
  const currencySigns = { USD: '$', PHP: '₱', EUR: '€', GBP: '£' };
  const LEVELS = ['easy', 'medium', 'hard'];
  const LEVEL_TARGET = 20;
  const PROGRESS_KEY = 'tp_lcm_practice_progress_v1';
  const METRICS_KEY = 'tp_lcm_practice_metrics_v1';
  const POINTS_KEY = 'tp_lcm_practice_points_v1';
  const REVIEW_HISTORY_KEY = 'tp_lcm_practice_review_history_v1';
  const REVIEW_HISTORY_LIMIT = 250;
  const POINTS_PER_CORRECT = 10;
  const HINT_COST = 5;
  const REVEAL_CELL_COST = 10;
  const SOLUTION_UNLOCK_MINUTES = { easy: 15, medium: 20, hard: 30 };
  const CURRENCY_KEY = 'tp_lcm_practice_currency_v1';
  const METRIC_HISTORY_LIMIT = 100;
  const TREND_SAMPLE_SIZE = 5;
  const hardScenarios = [
    {
      title: ['Emergency food delivery', 'Paghahatid ng pagkain para sa emergency'],
      text: [
        'A relief agency must ship food boxes from {sourcePlaces} to {destinationPlaces}. Rows S1–S4 represent the warehouses, and columns D1–D5 represent the evacuation centers. The matrix shows each warehouse’s available boxes and each center’s required boxes. The cost in each route is the cost to ship one box. Use the Least Cost Method to plan the shipments, check whether total supply and demand balance, and decide how to handle any difference.',
        'Kailangang maghatid ang isang relief agency ng mga kahon ng pagkain mula sa {sourcePlaces} papunta sa {destinationPlaces}. Ang rows S1–S4 ay ang mga warehouse, at ang columns D1–D5 ay ang mga evacuation center. Makikita sa matrix ang dami ng kahon sa bawat warehouse at ang kailangan ng bawat center. Ang cost sa bawat ruta ay bayad sa pagpapadala ng isang kahon. Gamitin ang Least Cost Method para magplano ng shipments, suriin kung balance ang total supply at demand, at pag-isipan kung paano haharapin ang anumang diperensya.'
      ],
      sourcePlaces: ['four regional warehouses', 'apat na regional warehouses'],
      destinationPlaces: ['five evacuation centers', 'limang evacuation centers']
    },
    {
      title: ['Fresh produce distribution', 'Pamamahagi ng sariwang ani'],
      text: [
        'A growers’ cooperative needs to send crates of fresh produce from {sourcePlaces} to {destinationPlaces}. Rows S1–S4 represent farms, and columns D1–D5 represent markets. The matrix lists each farm’s available crates and each market’s requested crates. Each route cost is the expense of sending one crate. Find a shipment plan with the Least Cost Method, compare total supply and demand, and account for any surplus or shortage.',
        'Kailangang magpadala ang isang samahan ng mga magsasaka ng crates ng sariwang ani mula sa {sourcePlaces} papunta sa {destinationPlaces}. Ang rows S1–S4 ay ang mga farm, at ang columns D1–D5 ay ang mga market. Nasa matrix ang available na crates ng bawat farm at ang hinihingi ng bawat market. Ang route cost ay gastos sa pagpapadala ng isang crate. Bumuo ng shipment plan gamit ang Least Cost Method, ikumpara ang total supply at demand, at isaalang-alang ang anumang sobra o kakulangan.'
      ],
      sourcePlaces: ['four nearby farms', 'apat na kalapit na farm'],
      destinationPlaces: ['five local markets', 'limang lokal na market']
    },
    {
      title: ['Medical supply delivery', 'Paghahatid ng medical supplies'],
      text: [
        'A health network must distribute medical supply kits from {sourcePlaces} to {destinationPlaces}. Rows S1–S4 represent distribution hubs, and columns D1–D5 represent community clinics. The matrix lists the available kits at each hub and the requested kits at each clinic. Each route cost is the cost to deliver one kit. Use the Least Cost Method to determine the allocations, then assess whether the total supply matches total demand.',
        'Kailangang ipamahagi ng isang health network ang medical supply kits mula sa {sourcePlaces} papunta sa {destinationPlaces}. Ang rows S1–S4 ay ang distribution hubs, at ang columns D1–D5 ay ang community clinics. Nasa matrix ang available na kits sa bawat hub at ang hinihinging kits ng bawat clinic. Ang route cost ay gastos sa paghahatid ng isang kit. Gamitin ang Least Cost Method para tukuyin ang mga allocation, at suriin kung magkapantay ang total supply at demand.'
      ],
      sourcePlaces: ['four distribution hubs', 'apat na distribution hubs'],
      destinationPlaces: ['five community clinics', 'limang community clinics']
    },
    {
      title: ['School supply shipments', 'Mga shipment ng school supplies'],
      text: [
        'A school program is sending learning kits from {sourcePlaces} to {destinationPlaces}. Rows S1–S4 represent supply depots, and columns D1–D5 represent public schools. The matrix shows the kits available at each depot and the number requested at each school. Each route cost is the cost of shipping one kit. Apply the Least Cost Method to plan the shipments and decide how to treat any imbalance between supply and demand.',
        'Nagpapadala ang isang school program ng learning kits mula sa {sourcePlaces} papunta sa {destinationPlaces}. Ang rows S1–S4 ay ang supply depots, at ang columns D1–D5 ay ang public schools. Ipinapakita ng matrix ang available na kits sa bawat depot at ang daming hinihingi ng bawat school. Ang route cost ay gastos sa pagpapadala ng isang kit. Gamitin ang Least Cost Method para planuhin ang shipments at magpasya kung paano haharapin ang anumang hindi pagtutugma ng supply at demand.'
      ],
      sourcePlaces: ['four supply depots', 'apat na supply depots'],
      destinationPlaces: ['five public schools', 'limang public schools']
    }
  ];
  const uiText = {
    title: ['Random Practice Problems', 'Mga Random na Problema sa Pagsasanay'],
    intro: ['Choose a difficulty and generate a new transportation problem. Enter allocations using the Least Cost Method, then check your work.', 'Pumili ng antas at bumuo ng bagong problema sa transportasyon. Ilagay ang mga alokasyon gamit ang Least Cost Method, pagkatapos ay suriin ang sagot.'],
    currencyLabel: ['Currency sign', 'Simbolo ng pera'],
    levelProgress: ['Difficulty progression', 'Pag-usad sa mga antas'],
    unlockHelp: ['Complete 20 problems in each level to unlock the next level. Progress is saved on this device.', 'Sagutan nang tama ang 20 problema sa bawat antas upang mabuksan ang susunod. Naka-save ang progreso sa device na ito.'],
    progressAria: ['Progress for the current difficulty level', 'Pag-usad sa kasalukuyang antas ng kahirapan'],
    progressText: ['{level}: {count} of 20 completed · {total} total', '{level}: {count} sa 20 ang natapos · {total} lahat'],
    analyticsTitle: ['Practice Performance', 'Performance sa Pagsasanay'],
    analyticsHelp: ['Review your completion time and see whether your recent practice is getting faster.', 'Tingnan ang oras ng pagsagot at alamin kung bumibilis ka sa mga kamakailang pagsasanay.'],
    analyticsLevel: ['Difficulty', 'Antas'],
    analyticsCompleted: ['Completed', 'Natapos'],
    analyticsAverage: ['Average time', 'Average na oras'],
    analyticsTrend: ['Recent trend', 'Kamakailang trend'],
    pointsLabel: ['Points', 'Points'],
    pointsRewardHelp: ['Earn 10 points for each correctly completed problem.', 'Makakuha ng 10 points sa bawat problemang masagot nang tama.'],
    pointsNeedHint: ['You need {cost} points to get a hint. Earn points by correctly solving practice problems.', 'Kailangan mo ng {cost} points para makakuha ng clue. Kumita ng points sa pagsagot nang tama ng mga problema.'],
    pointsNeedReveal: ['You need {cost} points to reveal a cell. Earn points by correctly solving practice problems.', 'Kailangan mo ng {cost} points para ipakita ang isang cell. Kumita ng points sa pagsagot nang tama ng mga problema.'],
    pointsEarned: ['You earned {points} points! Your balance is {balance}.', 'Nadagdagan ka ng {points} points! {balance} na ang points mo.'],
    hintCost: ['This hint costs {cost} points. Your balance will be {balance}.', 'Gumamit ng {cost} points para sa clue na ito. Magiging {balance} ang matitira.'],
    revealCellLabel: ['Choose a cell to reveal', 'Pumili ng cell na ipapakita'],
    revealCellAction: ['Reveal this cell', 'Ipakita ang sagot sa cell na ito'],
    revealCellHelp: ['Spend 10 points to fill in the correct allocation for one selected cell.', 'Gumamit ng 10 points para awtomatikong mailagay ang tamang allocation sa isang napiling cell.'],
    revealCellPlaceholder: ['Select a cell', 'Pumili ng cell'],
    revealCellDone: ['Already revealed', 'Naipakita na'],
    revealCellAlreadyCorrect: ['That cell is already correct. No points were spent.', 'Tama na ang cell na iyon. Walang nagamit na points.'],
    revealCellSuccess: ['Revealed {cell}: the correct allocation is {answer}. {cost} points spent; {balance} remaining.', 'Ipinakita ang {cell}: ang tamang allocation ay {answer}. Nagamit ang {cost} points; {balance} ang natitira.'],
    pointsHintTitle: ['Get a Hint ({cost} points)', 'Humingi ng Clue ({cost} points)'],
    pointsRevealTitle: ['Reveal one cell ({cost} points)', 'Ipakita ang isang cell ({cost} points)'],
    trendNoData: ['No completed problems yet', 'Wala pang natatapos na problema'],
    trendNeedData: ['Solve 10 problems to see a timing trend', 'Sumagot ng 10 problema para makita ang trend ng oras'],
    trendImproving: ['Getting faster', 'Bumabilis'],
    trendSlower: ['May need more practice', 'Maaaring kailangan pa ng pagsasanay'],
    trendSteady: ['Steady pace', 'Pare-pareho ang bilis'],
    timerLabel: ['Time', 'Oras'],
    solutionUnlockHelp: ['The full LCM solution unlocks after 15 minutes for Easy, 20 minutes for Medium, and 30 minutes for Hard.', 'Maa-unlock ang buong LCM solution pagkalipas ng 15 minuto sa Madali, 20 minuto sa Katamtaman, at 30 minuto sa Mahirap.'],
    reviewHistoryTitle: ['Completed Problems', 'Mga Natapos na Problema'],
    reviewHistoryHelp: ['Reopen a completed problem to review its scenario, your correct allocations, and the LCM solution.', 'Buksan muli ang natapos na problema para balikan ang scenario, tamang allocations, at LCM solution.'],
    reviewHistoryEmpty: ['Completed problems will appear here after you solve them correctly.', 'Lalabas dito ang mga natapos na problema kapag nasagot mo na ang mga ito nang tama.'],
    reviewDate: ['Completed', 'Natapos'],
    reviewDifficulty: ['Difficulty', 'Antas'],
    reviewProblem: ['Problem', 'Problema'],
    reviewTime: ['Time', 'Oras'],
    reviewAction: ['Review', 'Balikan'],
    reviewingCompleted: ['Reviewing a completed problem. Your progress and points will not change.', 'Binabalikan mo ang natapos na problema. Hindi magbabago ang progress at points mo.'],
    reviewNewProblem: ['Generate a new problem', 'Bumuo ng bagong problema'],
    reviewDimensions: ['{rows} × {columns} transportation problem', '{rows} × {columns} na transportation problem'],
    durationHour: ['hr', 'oras'],
    durationMinute: ['min', 'min'],
    durationSecond: ['sec', 'seg'],
    scenarioPrompt: ['Your task', 'Gawain mo'],
    completionTime: ['Time to solve: {time}', 'Oras para masagot: {time}'],
    easyName: ['Easy', 'Madali'],
    mediumName: ['Medium', 'Katamtaman'],
    hardName: ['Hard', 'Mahirap'],
    lockedLevel: ['Complete 20 {level} problems to unlock this level.', 'Sagutan nang tama ang 20 problemang {level} upang mabuksan ang antas na ito.'],
    difficultyLabel: ['Difficulty level', 'Antas ng kahirapan'],
    easy: ['Easy — small balanced', 'Madali — maliit at balanse'],
    medium: ['Medium — larger balanced', 'Katamtaman — mas malaki at balanse'],
    hard: ['Hard — large and unbalanced', 'Mahirap — malaki at hindi balanse'],
    generate: ['Generate Problem', 'Bumuo ng Problema'],
    clear: ['Clear Allocations', 'Burahin ang mga Alokasyon'],
    easyHelp: ['Easy generates a balanced 2×3 or 3×3 problem.', 'Bumubuo ang Madali ng balanseng 2×3 o 3×3 na problema.'],
    mediumHelp: ['Medium generates a balanced 3×4 problem.', 'Bumubuo ang Katamtaman ng balanseng 3×4 na problema.'],
    hardHelp: ['Hard includes a real-world story and an unbalanced 4×5 transportation problem. Solve it yourself; ask for a hint if needed.', 'May real-world na kuwento at hindi balanseng 4×5 transportation problem ang Mahirap. Ikaw ang sumagot; humingi ng clue kung kailangan.'],
    problem: ['Practice Problem', 'Problema sa Pagsasanay'],
    matrixHelp: ['Costs are shaded from low (green) to high (red). Enter a shipment quantity in each cell.', 'May kulay ang gastos: berde ang mababa at pula ang mataas. Maglagay ng dami ng padala sa bawat cell.'],
    heatmapLegend: ['Unit cost heatmap:', 'Heatmap ng gastos bawat yunit:'],
    correctAllocationLegend: ['Green cells show allocations that match the LCM answer.', 'Ipinapakita ng berdeng cell ang alokasyong tugma sa sagot ng LCM.'],
    lowest: ['Lowest', 'Pinakamababa'],
    mediumCost: ['Medium', 'Katamtaman'],
    highest: ['Highest', 'Pinakamataas'],
    getHint: ['Get a Hint', 'Humingi ng Clue'],
    check: ['Check My Allocations', 'Suriin ang mga Alokasyon'],
    showSolution: ['Show LCM Solution', 'Ipakita ang Solusyon ng LCM'],
    hideSolution: ['Hide LCM Solution', 'Itago ang Solusyon ng LCM'],
    flowTitle: ['Your Shipment Flows', 'Daloy ng mga Padala'],
    flowHelp: ['Animated arrows show the source-to-destination routes for the quantities you entered.', 'Ipinapakita ng mga gumagalaw na arrow ang mga rutang pinadalhan batay sa mga daming inilagay mo.'],
    flowAria: ['Animated shipment flows from sources to destinations.', 'Animated na daloy ng padala mula sa mga pinagmulan papunta sa mga destinasyon.'],
    generateFirst: ['Generate a problem to start practicing.', 'Bumuo muna ng problema upang makapagsimula.'],
    hintDone: ['All supply and demand are accounted for. Check your allocations.', 'Nailaan na ang lahat ng supply at demand. Suriin ang mga alokasyon mo.'],
    hintOver: ['Some entered quantities exceed the remaining supply or demand. Correct them before requesting a hint.', 'May mga inilagay na dami na lumalampas sa natitirang supply o demand. Ayusin muna bago humingi ng clue.'],
    invalidAmounts: ['Allocations must be non-negative whole numbers. Correct the entries before checking.', 'Dapat ay hindi negatibong buong bilang ang mga alokasyon. Ayusin muna ang mga inilagay bago suriin.'],
    hintTie: ['Several active cells tie for the lowest cost. Using the top-to-bottom, left-to-right tie rule, choose {cell} at {cost}. Remaining supply is {supply} and remaining demand is {demand}; choose the smaller amount.', 'Tabla ang pinakamababang gastos sa ilang aktibong cell. Ayon sa panuntunang itaas-pababa at kaliwa-pakanan, piliin ang {cell} sa halagang {cost}. Natitirang supply ay {supply} at natitirang demand ay {demand}; piliin ang mas maliit na halaga.'],
    remaining: ['Remaining supply: {supply}. Remaining demand: {demand}.', 'Natitirang supply: {supply}. Natitirang demand: {demand}.'],
    remainingSource: ['S{index}: {amount}', 'S{index}: {amount}'],
    remainingDestination: ['D{index}: {amount}', 'D{index}: {amount}'],
    correct: ['Excellent! Every allocation matches the Least Cost Method solution.', 'Magaling! Tugma ang lahat ng alokasyon sa solusyon ng Least Cost Method.'],
    congratsTitle: ['Great job!', 'Magaling!'],
    congratsMessage: ['Problem complete! You have solved {count} of 20 {level} problems.', 'Tapos na ang problema! Nakumpleto mo na ang {count} sa 20 problemang {level}.'],
    levelCompleteTitle: ['Level complete!', 'Tapos na ang antas!'],
    levelCompleteMessage: ['You completed all 20 {level} problems. {next} is now unlocked!', 'Natapos mo ang lahat ng 20 problemang {level}. Bukas na ang {next}!'],
    allLevelsCompleteMessage: ['You completed all 20 problems in every difficulty. Keep practicing with new Hard problems!', 'Natapos mo ang 20 problema sa bawat antas. Magpatuloy sa pagsasanay gamit ang mga bagong problemang Mahirap!'],
    nextProblem: ['Next Problem', 'Susunod na Problema'],
    startNextLevel: ['Start {level}', 'Simulan ang {level}'],
    hardNextProblem: ['Next Hard Problem', 'Susunod na Mahirap na Problema'],
    hintCell: ['Look at {cell}, which has the lowest available unit cost: {cost}. Remaining supply is {supply} and remaining demand is {demand}; choose the smaller amount.', 'Tingnan ang {cell}, na may pinakamababang natitirang gastos bawat yunit: {cost}. Natitirang supply ay {supply} at natitirang demand ay {demand}; piliin ang mas maliit na halaga.'],
    incorrect: ['Not quite yet. {count} cell(s) need another look. Review the hints or reveal the solution when ready.', 'Hindi pa eksakto. Kailangang suriin muli ang {count} cell. Tingnan ang mga clue o ipakita ang solusyon kapag handa ka na.'],
    incorrectHard: ['Not quite yet. Review the highlighted cells and use Get a Hint to work through the next allocation.', 'Hindi pa eksakto. Suriin ang mga naka-highlight na cell at gamitin ang Humingi ng Clue para magabayan sa susunod na allocation.'],
    showAnswer: ['Show LCM Solution', 'Ipakita ang Solusyon ng LCM'],
    noRoutes: ['Enter an allocation to see its route in the flow diagram.', 'Maglagay ng alokasyon upang makita ang ruta nito sa flow diagram.'],
    allocationLabel: ['Allocation from {source} to {destination}', 'Alokasyon mula {source} papuntang {destination}'],
    solutionTitle: ['Reference solution — Least Cost Method', 'Sagot na sanggunian — Least Cost Method'],
    activeProblem: ['{difficulty} practice · {rows} × {columns}', 'Pagsasanay ({difficulty}) · {rows} × {columns}'],
    balancedTotals: ['Balanced: total supply {supply} equals total demand {demand}.', 'Balanse: magkapantay ang kabuuang supply na {supply} at demand na {demand}.'],
    dummyDestination: ['Unbalanced: supply {supply} exceeds demand {demand} by {difference}. A dummy destination is included.', 'Hindi balanse: mas mataas ang supply na {supply} kaysa demand na {demand} nang {difference}. May idinagdag na dummy destination.'],
    dummySource: ['Unbalanced: demand {demand} exceeds supply {supply} by {difference}. A dummy source is included.', 'Hindi balanse: mas mataas ang demand na {demand} kaysa supply na {supply} nang {difference}. May idinagdag na dummy source.'],
    source: ['Source', 'Pinagmulan'],
    destination: ['Destination', 'Destinasyon'],
    supply: ['Supply', 'Suplay'],
    demand: ['Demand', 'Demand']
  };

  let language = document.querySelector('#languageSelect').value || 'en';
  let practice = null;
  let hintedCell = null;
  let solutionVisible = false;
  let completedCurrent = false;
  let progress = loadProgress();
  let metrics = loadMetrics();
  let points = loadPoints();
  let revealedCells = new Set();
  let reviewHistory = loadReviewHistory();
  let reviewMode = false;
  let timerStartedAt = null;
  let timerInterval = null;

  const toTaglish = (value) => window.transportationToTaglish(value);
  const taglishOverrides = {
    title: 'Random Practice Problems',
    problem: 'Practice Problem',
    difficultyLabel: 'Difficulty level',
    generate: 'Generate Problem',
    check: 'Check My Allocations',
    analyticsTitle: 'Performance Analytics',
    analyticsLevel: 'Difficulty',
    analyticsCompleted: 'Completed',
    analyticsAverage: 'Average time',
    analyticsTrend: 'Recent trend',
    reviewHistoryTitle: 'Completed Problems',
    reviewDate: 'Completed',
    reviewDifficulty: 'Difficulty',
    reviewProblem: 'Problem',
    reviewTime: 'Time',
    reviewAction: 'Review',
    reviewingCompleted: 'Reviewing a completed problem. Your progress and points will not change.',
    reviewNewProblem: 'Generate a new problem',
    timerLabel: 'Timer',
    currencyLabel: 'Currency sign',
    solutionUnlockHelp: 'LCM solution unlocks after 15 min (Easy), 20 min (Medium), or 30 min (Hard).',
    pointsLabel: 'Points',
    pointsRewardHelp: 'Earn 10 points for each correct answer.',
    revealCellLabel: 'Choose a cell to reveal',
    revealCellAction: 'Reveal this cell',
    revealCellHelp: 'Spend 10 points to reveal the correct allocation for one selected cell.',
    pointsEarned: 'You earned {points} points! Your balance is {balance}.',
    heatmapLegend: 'Unit cost heatmap',
    correctAllocationLegend: 'Green cells show allocations that match the LCM answer.',
    lowest: 'Lowest',
    highest: 'Highest',
    showSolution: 'Show LCM Solution',
    hideSolution: 'Hide LCM Solution',
    levelProgress: 'Difficulty progression',
    nextProblem: 'Next Problem'
  };
  const text = (english, tagalog) => language === 'tl' ? tagalog : language === 'tl-en' ? toTaglish(tagalog) : english;
  const tr = (key) => {
    const values = uiText[key] || ['', ''];
    if (language === 'tl-en') return taglishOverrides[key] || toTaglish(values[1]);
    return values[language === 'tl' ? 1 : 0];
  };
  const fmt = (value) => Number(value).toLocaleString('en-US', { maximumFractionDigits: 4 });
  const fmtMoney = (value) => (currencySigns[$('#practiceCurrency').value] || '$') + fmt(value);
  const interpolate = (message, values) => message.replace(/\{(\w+)\}/g, (_, key) => values[key]);
  const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  function loadProgress() {
    try {
      const saved = JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}');
      return Object.fromEntries(LEVELS.map((level) => [
        level,
        Number.isInteger(saved[level]) ? Math.max(0, Math.min(LEVEL_TARGET, saved[level])) : 0
      ]));
    } catch (error) {
      console.warn('Practice progress could not be loaded from this browser.');
      return { easy: 0, medium: 0, hard: 0 };
    }
  }

  function saveProgress() {
    try {
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
    } catch (error) {
      console.warn('Practice progress could not be saved in this browser.');
    }
  }

  function loadPoints() {
    try {
      const saved = Number(localStorage.getItem(POINTS_KEY));
      return Number.isSafeInteger(saved) && saved >= 0 ? saved : 0;
    } catch (error) {
      console.warn('Practice points could not be loaded from this browser.');
      return 0;
    }
  }

  function loadCurrency() {
    try {
      const saved = localStorage.getItem(CURRENCY_KEY);
      return Object.prototype.hasOwnProperty.call(currencySigns, saved) ? saved : 'USD';
    } catch (error) {
      console.warn('Practice currency preference could not be loaded from this browser.');
      return 'USD';
    }
  }

  function saveCurrency() {
    try {
      localStorage.setItem(CURRENCY_KEY, $('#practiceCurrency').value);
    } catch (error) {
      console.warn('Practice currency preference could not be saved in this browser.');
    }
  }

  function savePoints() {
    try {
      localStorage.setItem(POINTS_KEY, String(points));
    } catch (error) {
      console.warn('Practice points could not be saved in this browser.');
    }
  }

  function loadReviewHistory() {
    try {
      const saved = JSON.parse(localStorage.getItem(REVIEW_HISTORY_KEY) || '[]');
      if (!Array.isArray(saved)) return [];
      return saved.filter((entry) =>
        entry && LEVELS.includes(entry.difficulty) &&
        Array.isArray(entry.costs) && Array.isArray(entry.supply) && Array.isArray(entry.demand) &&
        Array.isArray(entry.allocations) && Number.isFinite(entry.completedAt)
      ).slice(0, REVIEW_HISTORY_LIMIT);
    } catch (error) {
      console.warn('Completed practice problems could not be loaded from this browser.');
      return [];
    }
  }

  function saveReviewHistory() {
    try {
      localStorage.setItem(REVIEW_HISTORY_KEY, JSON.stringify(reviewHistory));
    } catch (error) {
      console.warn('Completed practice problems could not be saved in this browser.');
    }
  }

  function renderReviewHistory() {
    const body = $('#practiceReviewBody');
    const hasEntries = reviewHistory.length > 0;
    $('#practiceReviewCount').textContent = fmt(reviewHistory.length);
    $('#practiceReviewEmpty').hidden = hasEntries;
    $('#practiceReviewTableWrap').hidden = !hasEntries;
    body.replaceChildren();

    reviewHistory.forEach((entry, index) => {
      const row = document.createElement('tr');
      const date = document.createElement('td');
      date.textContent = new Date(entry.completedAt).toLocaleString();
      row.appendChild(date);

      const difficulty = document.createElement('td');
      difficulty.textContent = levelName(entry.difficulty);
      row.appendChild(difficulty);

      const problem = document.createElement('td');
      if (entry.scenarioTitle) {
        problem.textContent = Array.isArray(entry.scenarioTitle)
          ? text(entry.scenarioTitle[0], entry.scenarioTitle[1])
          : entry.scenarioTitle;
      } else {
        problem.textContent = interpolate(tr('reviewDimensions'), {
          rows: entry.supply.length,
          columns: entry.demand.length
        });
      }
      row.appendChild(problem);

      const duration = document.createElement('td');
      duration.textContent = formatDuration(entry.durationMs);
      row.appendChild(duration);

      const action = document.createElement('td');
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'btn btn-sm btn-outline-primary';
      button.dataset.reviewIndex = String(index);
      button.textContent = tr('reviewAction');
      action.appendChild(button);
      row.appendChild(action);
      body.appendChild(row);
    });
  }

  function saveCompletedProblem(duration) {
    const entry = {
      difficulty: practice.difficulty,
      costs: practice.costs,
      supply: practice.supply,
      demand: practice.demand,
      allocations: practice.solution.alloc,
      scenarioTitle: practice.scenario ? practice.scenario.title : '',
      scenarioText: practice.scenario ? practice.scenario.text : '',
      sourcePlaces: practice.scenario ? practice.scenario.sourcePlaces : [],
      destinationPlaces: practice.scenario ? practice.scenario.destinationPlaces : [],
      currency: $('#practiceCurrency').value,
      durationMs: duration,
      completedAt: Date.now()
    };
    reviewHistory.unshift(entry);
    if (reviewHistory.length > REVIEW_HISTORY_LIMIT) reviewHistory.length = REVIEW_HISTORY_LIMIT;
    saveReviewHistory();
    renderReviewHistory();
  }

  function restoreReview(index) {
    const entry = reviewHistory[index];
    if (!entry) return;

    practice = {
      difficulty: entry.difficulty,
      costs: entry.costs,
      supply: entry.supply,
      demand: entry.demand,
      balanced: LCM.balanceProblem(entry.costs, entry.supply, entry.demand),
      solution: { alloc: entry.allocations },
      scenario: entry.scenarioTitle
        ? {
          title: Array.isArray(entry.scenarioTitle)
            ? entry.scenarioTitle
            : [entry.scenarioTitle, entry.scenarioTitle],
          text: Array.isArray(entry.scenarioText)
            ? entry.scenarioText
            : [entry.scenarioText, entry.scenarioText],
          sourcePlaces: entry.sourcePlaces || ['', ''],
          destinationPlaces: entry.destinationPlaces || ['', '']
        }
        : null
    };
    reviewMode = true;
    completedCurrent = true;
    solutionVisible = true;
    hintedCell = null;
    revealedCells = new Set();
    stopTimer();
    timerStartedAt = null;
    $('#practiceCurrency').value = Object.prototype.hasOwnProperty.call(currencySigns, entry.currency)
      ? entry.currency
      : 'USD';
    $('#practiceReviewBanner').hidden = false;
    $('#practiceWorkspace').classList.remove('d-none');
    $('#practiceFlowPanel').classList.remove('d-none');
    $('#practiceScenario').hidden = !practice.scenario;
    $('#practiceTimerValue').textContent = formatDuration(entry.durationMs);
    $('#practiceHintMessage').hidden = true;
    $('#practiceFeedback').hidden = true;
    $('#practiceCelebration').hidden = true;
    $('#practiceShowSolution').hidden = true;
    $('#practiceSolution').hidden = false;
    $('#practiceReset').disabled = true;
    $('#practiceHint').disabled = true;
    $('#practiceCheck').disabled = true;
    $('#practiceRevealAnswer').disabled = true;
    $('#practiceDifficulty').disabled = true;
    $('#practiceProblemBadge').textContent = interpolate(tr('activeProblem'), {
      difficulty: tr(practice.difficulty).split(' — ')[0],
      rows: practice.supply.length,
      columns: practice.demand.length
    });
    renderScenario();
    renderBalanceStatus();
    renderRevealOptions();
    renderMatrix($('#practiceMatrix'), practice.solution.alloc, false);
    renderSolution();
    renderRemainingStatus(practice.solution.alloc);
    renderFlow(practice.solution.alloc);
    renderPoints();
    $('#practiceWorkspace').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function renderPoints() {
    $('#practicePointsBalance').textContent = fmt(points);
    $('#practiceHint').disabled = reviewMode || completedCurrent || !practice || points < HINT_COST;
    $('#practiceHint').title = interpolate(tr('pointsHintTitle'), { cost: HINT_COST });
    $('#practiceRevealAnswer').disabled = reviewMode || completedCurrent || !practice ||
      points < REVEAL_CELL_COST || !$('#practiceRevealCell').value;
    $('#practiceRevealAnswer').title = interpolate(tr('pointsRevealTitle'), { cost: REVEAL_CELL_COST });
  }

  function renderRevealOptions() {
    const select = $('#practiceRevealCell');
    const selected = select.value;
    select.replaceChildren();
    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = tr('revealCellPlaceholder');
    select.appendChild(placeholder);

    if (practice) {
      practice.balanced.rowLabels.forEach((source, i) => {
        practice.balanced.colLabels.forEach((destination, j) => {
          const option = document.createElement('option');
          option.value = i + ',' + j;
          option.textContent = source + ' → ' + destination;
          option.disabled = revealedCells.has(option.value);
          if (option.disabled) option.textContent += ' (' + tr('revealCellDone') + ')';
          select.appendChild(option);
        });
      });
    }
    const selectedOption = selected ? select.querySelector('option[value="' + selected + '"]') : null;
    if (selectedOption && !selectedOption.disabled) {
      select.value = selected;
    }
    renderPoints();
  }

  function loadMetrics() {
    try {
      const saved = JSON.parse(localStorage.getItem(METRICS_KEY) || '{}');
      return Object.fromEntries(LEVELS.map((level) => {
        const levelData = saved[level] || {};
        const times = Array.isArray(levelData.times)
          ? levelData.times.filter((duration) => Number.isFinite(duration) && duration >= 0).slice(-METRIC_HISTORY_LIMIT)
          : [];
        return [level, {
          completed: Number.isInteger(levelData.completed) && levelData.completed > 0 ? levelData.completed : 0,
          times
        }];
      }));
    } catch (error) {
      console.warn('Practice performance data could not be loaded from this browser.');
      return Object.fromEntries(LEVELS.map((level) => [level, { completed: 0, times: [] }]));
    }
  }

  function saveMetrics() {
    try {
      localStorage.setItem(METRICS_KEY, JSON.stringify(metrics));
    } catch (error) {
      console.warn('Practice performance data could not be saved in this browser.');
    }
  }

  function formatDuration(durationMs) {
    const totalSeconds = Math.max(0, Math.floor(durationMs / 1000));
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    if (hours > 0) {
      return hours + ' ' + tr('durationHour') + ' ' + minutes + ' ' + tr('durationMinute');
    }
    return minutes + ' ' + tr('durationMinute') + ' ' +
      String(seconds).padStart(2, '0') + ' ' + tr('durationSecond');
  }

  function updateTimer() {
    if (timerStartedAt === null) return;
    const elapsed = Date.now() - timerStartedAt;
    $('#practiceTimerValue').textContent = formatDuration(elapsed);
    updateSolutionAccess(elapsed);
  }

  function updateSolutionAccess(elapsed) {
    const button = $('#practiceShowSolution');
    const unlockMinutes = practice ? SOLUTION_UNLOCK_MINUTES[practice.difficulty] : Infinity;
    const unlocked = Boolean(practice && !completedCurrent && elapsed >= unlockMinutes * 60 * 1000);
    button.hidden = !unlocked;
    if (!unlocked) {
      solutionVisible = false;
      $('#practiceSolution').hidden = true;
    }
  }

  function stopTimer() {
    if (timerStartedAt === null) return 0;
    const duration = Math.max(0, Date.now() - timerStartedAt);
    timerStartedAt = null;
    window.clearInterval(timerInterval);
    timerInterval = null;
    $('#practiceTimerValue').textContent = formatDuration(duration);
    return duration;
  }

  function startTimer() {
    stopTimer();
    timerStartedAt = Date.now();
    updateTimer();
    timerInterval = window.setInterval(updateTimer, 1000);
  }

  function renderAnalytics() {
    const body = $('#practiceAnalyticsBody');
    body.replaceChildren();
    LEVELS.forEach((level) => {
      const record = metrics[level];
      const row = document.createElement('tr');
      const levelCell = document.createElement('th');
      levelCell.scope = 'row';
      levelCell.textContent = levelName(level);
      row.appendChild(levelCell);

      const completedCell = document.createElement('td');
      completedCell.textContent = fmt(record.completed);
      row.appendChild(completedCell);

      const averageCell = document.createElement('td');
      const average = record.times.length
        ? record.times.reduce((sum, duration) => sum + duration, 0) / record.times.length
        : null;
      averageCell.textContent = average === null ? tr('trendNoData') : formatDuration(average);
      row.appendChild(averageCell);

      const trendCell = document.createElement('td');
      trendCell.textContent = getTrend(record.times);
      row.appendChild(trendCell);
      body.appendChild(row);
    });
  }

  function getTrend(times) {
    if (times.length === 0) return tr('trendNoData');
    if (times.length < TREND_SAMPLE_SIZE * 2) return tr('trendNeedData');
    const prior = times.slice(-TREND_SAMPLE_SIZE * 2, -TREND_SAMPLE_SIZE);
    const recent = times.slice(-TREND_SAMPLE_SIZE);
    const average = (values) => values.reduce((sum, value) => sum + value, 0) / values.length;
    const priorAverage = average(prior);
    const recentAverage = average(recent);
    if (recentAverage <= priorAverage * 0.9) return tr('trendImproving');
    if (recentAverage >= priorAverage * 1.1) return tr('trendSlower');
    return tr('trendSteady');
  }

  function recordPerformance(level, duration) {
    const record = metrics[level];
    record.completed += 1;
    record.times.push(duration);
    if (record.times.length > METRIC_HISTORY_LIMIT) {
      record.times.splice(0, record.times.length - METRIC_HISTORY_LIMIT);
    }
    saveMetrics();
    renderAnalytics();
  }

  function getNextLevel(level) {
    const index = LEVELS.indexOf(level);
    return index >= 0 && index < LEVELS.length - 1 ? LEVELS[index + 1] : null;
  }

  function getUnlockedThrough() {
    if (progress.easy < LEVEL_TARGET) return 0;
    if (progress.medium < LEVEL_TARGET) return 1;
    return 2;
  }

  function levelName(level) {
    return tr(level + 'Name');
  }

  function updateProgressUi() {
    const select = $('#practiceDifficulty');
    const selectedLevel = select.value;
    const unlockedThrough = getUnlockedThrough();
    LEVELS.forEach((level, index) => {
      const option = select.querySelector('option[value="' + level + '"]');
      option.disabled = index > unlockedThrough;
    });
    if (LEVELS.indexOf(selectedLevel) > unlockedThrough) select.value = LEVELS[unlockedThrough];

    const level = select.value;
    const count = progress[level];
    const total = LEVELS.reduce((sum, item) => sum + progress[item], 0);
    $('#practiceLevelProgressText').textContent = interpolate(tr('progressText'), {
      level: levelName(level),
      count,
      total
    });
    $('#practiceLevelProgressBar').style.width = (count / LEVEL_TARGET * 100) + '%';
    $('#practiceLevelProgress').setAttribute('aria-valuenow', String(count));
    $('#practiceLevelProgress').setAttribute('aria-label', tr('progressAria'));
  }

  function randomParts(total, count) {
    const cuts = new Set();
    while (cuts.size < count - 1) cuts.add(randInt(1, total - 1));
    const points = [0, ...Array.from(cuts).sort((a, b) => a - b), total];
    return points.slice(1).map((point, index) => point - points[index]);
  }

  function makeProblem(difficulty) {
    let rows, columns, supplyTotal, demandTotal;
    if (difficulty === 'easy') {
      rows = Math.random() < 0.5 ? 2 : 3;
      columns = 3;
      supplyTotal = randInt(45, 80);
      demandTotal = supplyTotal;
    } else if (difficulty === 'medium') {
      rows = 3;
      columns = 4;
      supplyTotal = randInt(100, 180);
      demandTotal = supplyTotal;
    } else {
      rows = 4;
      columns = 5;
      supplyTotal = randInt(150, 230);
      demandTotal = supplyTotal + (Math.random() < 0.5 ? -1 : 1) * randInt(8, 24);
    }

    const supply = randomParts(supplyTotal, rows);
    const demand = randomParts(demandTotal, columns);
    const shuffledCosts = Array.from({ length: rows * columns }, (_, index) => index + 1);
    for (let i = shuffledCosts.length - 1; i > 0; i--) {
      const j = randInt(0, i);
      [shuffledCosts[i], shuffledCosts[j]] = [shuffledCosts[j], shuffledCosts[i]];
    }
    const costs = Array.from({ length: rows }, (_, i) =>
      shuffledCosts.slice(i * columns, (i + 1) * columns));
    const balanced = LCM.balanceProblem(costs, supply, demand);
    const solution = LCM.solveLCM(costs, supply, demand, 'first');
    const scenario = difficulty === 'hard'
      ? hardScenarios[randInt(0, hardScenarios.length - 1)]
      : null;

    return { difficulty, costs, supply, demand, balanced, solution, scenario };
  }

  function renderScenario() {
    const panel = $('#practiceScenario');
    if (!practice || !practice.scenario) {
      panel.hidden = true;
      return;
    }
    panel.hidden = false;
    $('#practiceScenarioTitle').textContent = tr('scenarioPrompt') + ': ' +
      text(practice.scenario.title[0], practice.scenario.title[1]);
    $('#practiceScenarioText').textContent = interpolate(
      text(practice.scenario.text[0], practice.scenario.text[1]),
      {
        sourcePlaces: text(practice.scenario.sourcePlaces[0], practice.scenario.sourcePlaces[1]),
        destinationPlaces: text(practice.scenario.destinationPlaces[0], practice.scenario.destinationPlaces[1])
      }
    );
  }

  function heatLevel(costs, value) {
    const allCosts = costs.flat();
    const min = Math.min(...allCosts);
    const max = Math.max(...allCosts);
    if (min === max) return 1;
    return 1 + Math.round(((value - min) / (max - min)) * 4);
  }

  function renderMatrix(table, quantities, editable) {
    const problem = practice.balanced;
    const rows = problem.supply.length;
    const columns = problem.demand.length;
    const rowLabels = problem.rowLabels;
    const colLabels = problem.colLabels;
    let html = '<thead><tr><th></th>';

    colLabels.forEach((label) => { html += '<th>' + label + '</th>'; });
    html += '<th>' + tr('Supply') + '</th></tr></thead><tbody>';
    for (let i = 0; i < rows; i++) {
      html += '<tr><th class="row-label">' + rowLabels[i] + '</th>';
      for (let j = 0; j < columns; j++) {
        const level = heatLevel(problem.costs, problem.costs[i][j]);
        const hintClass = hintedCell && hintedCell[0] === i && hintedCell[1] === j ? ' practice-cost-hint' : '';
        html += '<td class="practice-cost-cell practice-heat-' + level + hintClass + '">' +
          '<span class="practice-cost">' + fmtMoney(problem.costs[i][j]) + '</span>';
        if (editable) {
          html += '<input type="number" min="0" step="1" inputmode="numeric" class="form-control form-control-sm practice-allocation" data-i="' + i +
            '" data-j="' + j + '" aria-label="' + interpolate(tr('allocationLabel'), {
              source: rowLabels[i], destination: colLabels[j]
            }) + '" value="' + (quantities[i][j] || '') + '">';
        } else {
          html += '<strong class="practice-solution-quantity">' + fmt(quantities[i][j]) + '</strong>';
        }
        html += '</td>';
      }
      html += '<td class="supply-cell fw-semibold">' + fmt(problem.supply[i]) + '</td></tr>';
    }
    html += '<tr><th class="row-label">' + tr('Demand') + '</th>';
    problem.demand.forEach((value) => { html += '<td class="demand-cell fw-semibold">' + fmt(value) + '</td>'; });
    const total = problem.supply.reduce((sum, value) => sum + value, 0);
    html += '<td class="lab grand-total-cell fw-semibold">' + fmt(total) + '</td></tr></tbody>';
    table.innerHTML = html;
    if (editable && table.id === 'practiceMatrix') {
      revealedCells.forEach((key) => {
        const [i, j] = key.split(',');
        const input = $('.practice-allocation[data-i="' + i + '"][data-j="' + j + '"]', table);
        if (input) input.closest('td').classList.add('practice-cell-revealed');
      });
    }
  }

  function readAllocations() {
    const problem = practice.balanced;
    const allocations = Array.from({ length: problem.supply.length }, () => new Array(problem.demand.length).fill(0));
    let invalid = false;
    $$('.practice-allocation').forEach((input) => {
      const value = input.value.trim() === '' ? 0 : Number(input.value);
      if (!Number.isInteger(value) || value < 0) invalid = true;
      allocations[Number(input.dataset.i)][Number(input.dataset.j)] = Number.isFinite(value) ? value : 0;
    });
    return { allocations, invalid };
  }

  function remainingMargins(allocations) {
    const problem = practice.balanced;
    const rowTotals = problem.supply.map((_, i) =>
      allocations[i].reduce((sum, value) => sum + value, 0));
    const columnTotals = problem.demand.map((_, j) =>
      allocations.reduce((sum, row) => sum + row[j], 0));
    return {
      rowTotals,
      columnTotals,
      supply: problem.supply.map((value, i) => value - rowTotals[i]),
      demand: problem.demand.map((value, j) => value - columnTotals[j])
    };
  }

  function getCurrentLowestCell(allocations) {
    const remaining = remainingMargins(allocations);
    if (remaining.supply.some((value) => value < 0) || remaining.demand.some((value) => value < 0)) {
      return { invalid: true };
    }
    let chosen = null;
    const ties = [];
    for (let i = 0; i < remaining.supply.length; i++) {
      if (remaining.supply[i] <= 0) continue;
      for (let j = 0; j < remaining.demand.length; j++) {
        if (remaining.demand[j] <= 0) continue;
        const cost = practice.balanced.costs[i][j];
        if (!chosen || cost < chosen.cost) {
          chosen = { row: i, column: j, cost };
          ties.length = 0;
          ties.push(chosen);
        } else if (cost === chosen.cost) {
          ties.push({ row: i, column: j, cost });
        }
      }
    }
    return { chosen, ties, remaining };
  }

  function renderFlow(allocations) {
    const svg = $('#practiceFlow');
    const problem = practice.balanced;
    const rows = problem.supply.length;
    const columns = problem.demand.length;
    const height = Math.max(rows, columns) * 86 + 56;
    const rowY = (index) => 34 + (index + 0.5) * (height - 68) / rows;
    const columnY = (index) => 34 + (index + 0.5) * (height - 68) / columns;
    let markup = '<defs><marker id="practiceArrow" markerWidth="10" markerHeight="8" refX="8" refY="4" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L0,8 L9,4 z" fill="#f5b800"></path></marker></defs>';
    let hasFlows = false;

    allocations.forEach((row, i) => row.forEach((amount, j) => {
      if (amount <= 0) return;
      hasFlows = true;
      const y1 = rowY(i);
      const y2 = columnY(j);
      const strokeWidth = Math.min(9, 2 + Math.sqrt(amount) / 2);
      markup += '<path class="practice-flow-line" d="M 142 ' + y1 + ' C 340 ' + y1 + ', 460 ' + y2 + ', 658 ' + y2 +
        '" stroke-width="' + strokeWidth + '" marker-end="url(#practiceArrow)"></path>' +
        '<text class="practice-flow-amount" x="400" y="' + ((y1 + y2) / 2 - 7) + '">' + fmt(amount) + '</text>';
    }));

    for (let i = 0; i < rows; i++) {
      markup += '<circle class="practice-flow-node" cx="105" cy="' + rowY(i) + '" r="32"></circle>' +
        '<text class="practice-flow-label" x="105" y="' + rowY(i) + '">' + problem.rowLabels[i] + '</text>';
    }
    for (let j = 0; j < columns; j++) {
      markup += '<circle class="practice-flow-node destination" cx="695" cy="' + columnY(j) + '" r="32"></circle>' +
        '<text class="practice-flow-label" x="695" y="' + columnY(j) + '">' + problem.colLabels[j] + '</text>';
    }
    if (!hasFlows) {
      markup += '<text class="practice-flow-empty" x="400" y="' + (height - 10) + '">' + tr('noRoutes') + '</text>';
    }
    svg.setAttribute('viewBox', '0 0 800 ' + height);
    svg.setAttribute('aria-label', tr('flowAria'));
    svg.innerHTML = markup;
  }

  function renderBalanceStatus() {
    if (!practice) return;
    const totalSupply = practice.balanced.totalSupply;
    const totalDemand = practice.balanced.totalDemand;
    const balanceStatus = $('#practiceBalanceStatus');
    if (practice.balanced.balanced) {
      balanceStatus.textContent = interpolate(tr('balancedTotals'), {
        supply: fmt(totalSupply), demand: fmt(totalDemand)
      });
      balanceStatus.className = 'alert alert-success py-2 small';
    } else {
      const supplyIsHigher = totalSupply > totalDemand;
      balanceStatus.textContent = interpolate(tr(supplyIsHigher ? 'dummyDestination' : 'dummySource'), {
        supply: fmt(totalSupply),
        demand: fmt(totalDemand),
        difference: fmt(practice.balanced.dummy.quantity)
      });
      balanceStatus.className = 'alert alert-warning py-2 small';
    }
  }

  function renderRemainingStatus(allocations) {
    if (!practice) return;
    const remaining = remainingMargins(allocations);
    const supply = remaining.supply.map((amount, index) =>
      interpolate(tr('remainingSource'), { index: index + 1, amount: fmt(amount) })).join(' · ');
    const demand = remaining.demand.map((amount, index) =>
      interpolate(tr('remainingDestination'), { index: index + 1, amount: fmt(amount) })).join(' · ');
    $('#practiceRemainingStatus').textContent = interpolate(tr('remaining'), { supply, demand });
  }

  function updateCorrectAllocationCells() {
    if (!practice || reviewMode) return;
    $$('.practice-allocation', $('#practiceMatrix')).forEach((input) => {
      const value = input.value.trim();
      const hasValue = value !== '';
      const allocation = hasValue ? Number(value) : 0;
      const isCorrect = Number.isInteger(allocation) && allocation >= 0 &&
        allocation === practice.solution.alloc[Number(input.dataset.i)][Number(input.dataset.j)];
      const highlight = isCorrect && hasValue;
      input.classList.toggle('practice-allocation-correct', highlight);
      input.classList.remove('practice-allocation-incorrect');
      input.closest('.practice-cost-cell').classList.toggle('practice-cell-correct', highlight);
    });
  }

  function renderLanguage() {
    $$('[data-practice-text]').forEach((element) => {
      element.textContent = tr(element.dataset.practiceText);
    });
    $$('[data-practice-option]').forEach((option) => {
      option.textContent = tr(option.dataset.practiceOption);
    });
    $('#practiceDifficultyHelp').textContent = tr($('#practiceDifficulty').value + 'Help');
    $('#practiceCurrency').setAttribute('aria-label', tr('currencyLabel'));
    updateProgressUi();
    renderAnalytics();
    renderReviewHistory();
    updateTimer();
    renderRevealOptions();
    if (practice) {
      renderScenario();
      renderBalanceStatus();
      if (!reviewMode) {
        updateSolutionAccess(timerStartedAt === null ? 0 : Date.now() - timerStartedAt);
      }
      $('#practiceProblemBadge').textContent = interpolate(tr('activeProblem'), {
        difficulty: tr(practice.difficulty).split(' — ')[0],
        rows: practice.supply.length,
        columns: practice.demand.length
      });
      $('#practiceShowSolution').textContent = solutionVisible ? tr('hideSolution') : tr('showSolution');
      if (solutionVisible || reviewMode) renderSolution();
      const flow = reviewMode
        ? { allocations: practice.solution.alloc }
        : readAllocations();
      if (reviewMode) renderMatrix($('#practiceMatrix'), practice.solution.alloc, false);
      renderRemainingStatus(flow.allocations);
      renderFlow(flow.allocations);
      if (completedCurrent && !reviewMode) renderCelebrationText();
    }
  }

  function renderSolution() {
    const solution = $('#practiceSolution');
    solution.innerHTML = '<h3 class="h6">' + tr('solutionTitle') + '</h3><div class="table-responsive">' +
      '<table class="table table-bordered matrix-input text-center align-middle practice-matrix practice-solution-matrix"></table></div>';
    renderMatrix($('.practice-solution-matrix', solution), practice.solution.alloc, false);
  }

  function generate() {
    reviewMode = false;
    $('#practiceReviewBanner').hidden = true;
    let difficulty = $('#practiceDifficulty').value;
    if (LEVELS.indexOf(difficulty) > getUnlockedThrough()) {
      difficulty = LEVELS[getUnlockedThrough()];
      $('#practiceDifficulty').value = difficulty;
      $('#practiceDifficultyHelp').textContent = interpolate(tr('lockedLevel'), {
        level: levelName(difficulty)
      });
    } else {
      $('#practiceDifficultyHelp').textContent = tr(difficulty + 'Help');
    }
    practice = makeProblem(difficulty);
    hintedCell = null;
    revealedCells = new Set();
    solutionVisible = false;
    completedCurrent = false;
    $('#practiceWorkspace').classList.remove('d-none');
    $('#practiceFlowPanel').classList.remove('d-none');
    $('#practiceHintMessage').hidden = true;
    $('#practiceFeedback').hidden = true;
    $('#practiceCelebration').hidden = true;
    $('#practiceShowSolution').hidden = true;
    $('#practiceShowSolution').textContent = tr('showSolution');
    $('#practiceSolution').hidden = true;
    $('#practiceReset').disabled = false;
    $('#practiceHint').disabled = false;
    $('#practiceCheck').disabled = false;
    $('#practiceDifficulty').disabled = false;
    $('#practiceTimerValue').textContent = formatDuration(0);
    renderScenario();
    startTimer();
    renderRevealOptions();
    $('#practiceProblemBadge').textContent = interpolate(tr('activeProblem'), {
      difficulty: tr(practice.difficulty).split(' — ')[0],
      rows: practice.supply.length,
      columns: practice.demand.length
    });
    renderBalanceStatus();
    renderMatrix($('#practiceMatrix'), Array.from({ length: practice.balanced.supply.length }, () =>
      new Array(practice.balanced.demand.length).fill(0)), true);
    const updatedAllocations = readAllocations().allocations;
    renderRemainingStatus(updatedAllocations);
    renderFlow(updatedAllocations);
  }

  function renderCelebrationText() {
    const level = practice.difficulty;
    const nextLevel = getNextLevel(level);
    const celebration = $('#practiceCelebration');
    const title = $('#practiceCelebrationTitle');
    const message = $('#practiceCelebrationMessage');
    const nextButtonLabel = $('#practiceNextProblemLabel');
    if (progress[level] === LEVEL_TARGET && nextLevel) {
      title.textContent = tr('levelCompleteTitle');
      message.textContent = interpolate(tr('levelCompleteMessage'), {
        level: levelName(level),
        next: levelName(nextLevel)
      });
      nextButtonLabel.textContent = interpolate(tr('startNextLevel'), {
        level: levelName(nextLevel)
      });
    } else if (progress[level] === LEVEL_TARGET && !nextLevel) {
      title.textContent = tr('levelCompleteTitle');
      message.textContent = tr('allLevelsCompleteMessage');
      nextButtonLabel.textContent = tr('hardNextProblem');
    } else {
      title.textContent = tr('congratsTitle');
      message.textContent = interpolate(tr('congratsMessage'), {
        count: progress[level],
        level: levelName(level)
      });
      nextButtonLabel.textContent = tr('nextProblem');
    }
    $('#practiceCompletionTime').textContent = interpolate(tr('completionTime'), {
      time: formatDuration(practice.solveDurationMs)
    });
    $('#practicePointsEarned').textContent = interpolate(tr('pointsEarned'), {
      points: POINTS_PER_CORRECT,
      balance: fmt(points)
    });
    celebration.hidden = false;
  }

  function celebrateCompletion() {
    const level = practice.difficulty;
    practice.solveDurationMs = stopTimer();
    recordPerformance(level, practice.solveDurationMs);
    points += POINTS_PER_CORRECT;
    savePoints();
    if (progress[level] < LEVEL_TARGET) {
      progress[level] += 1;
      saveProgress();
    }
    saveCompletedProblem(practice.solveDurationMs);
    completedCurrent = true;
    updateProgressUi();
    renderPoints();
    $$('.practice-allocation').forEach((input) => { input.disabled = true; });
    $('#practiceHint').disabled = true;
    $('#practiceCheck').disabled = true;
    $('#practiceReset').disabled = true;
    renderCelebrationText();
    const celebration = $('#practiceCelebration');
    celebration.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function startNextProblem() {
    if (!practice || !completedCurrent) return;
    const nextLevel = getNextLevel(practice.difficulty);
    if (progress[practice.difficulty] >= LEVEL_TARGET && nextLevel) {
      $('#practiceDifficulty').value = nextLevel;
    } else {
      $('#practiceDifficulty').value = practice.difficulty;
    }
    $('#practiceDifficultyHelp').textContent = tr($('#practiceDifficulty').value + 'Help');
    updateProgressUi();
    generate();
  }

  function showHint() {
    if (reviewMode) return;
    if (!practice) {
      $('#practiceHintMessage').textContent = tr('generateFirst');
      $('#practiceHintMessage').hidden = false;
      return;
    }
    const entered = readAllocations();
    const current = getCurrentLowestCell(entered.allocations);
    const hint = $('#practiceHintMessage');
    if (entered.invalid || current.invalid) {
      hint.textContent = entered.invalid ? tr('invalidAmounts') : tr('hintOver');
      hint.className = 'alert alert-warning py-2 mt-3 mb-0';
    } else if (!current.chosen) {
      hint.textContent = tr('hintDone');
      hint.className = 'alert alert-success py-2 mt-3 mb-0';
    } else if (points < HINT_COST) {
      hint.textContent = interpolate(tr('pointsNeedHint'), { cost: HINT_COST });
      hint.className = 'alert alert-warning py-2 mt-3 mb-0';
    } else {
      points -= HINT_COST;
      savePoints();
      renderPoints();
      hintedCell = [current.chosen.row, current.chosen.column];
      renderMatrix($('#practiceMatrix'), readAllocations().allocations, true);
      updateCorrectAllocationCells();
      const cell = practice.balanced.rowLabels[current.chosen.row] + ' → ' + practice.balanced.colLabels[current.chosen.column];
      const message = current.ties.length > 1 ? tr('hintTie') : tr('hintCell');
      hint.innerHTML = '<strong>' + interpolate(message, {
        cell,
        cost: fmtMoney(current.chosen.cost),
        supply: fmt(current.remaining.supply[current.chosen.row]),
        demand: fmt(current.remaining.demand[current.chosen.column])
      }) + '</strong><br><small>' + interpolate(tr('hintCost'), {
        cost: HINT_COST,
        balance: fmt(points)
      }) + '</small>';
      hint.className = 'alert alert-info py-2 mt-3 mb-0';
    }
    hint.hidden = false;
  }

  function revealSelectedCell() {
    if (!practice || reviewMode || completedCurrent) return;
    const selection = $('#practiceRevealCell').value;
    if (!selection) return;
    const [row, column] = selection.split(',').map(Number);
    const input = $('.practice-allocation[data-i="' + row + '"][data-j="' + column + '"]');
    const answer = practice.solution.alloc[row][column];
    const message = $('#practiceHintMessage');
    if (Number(input.value || 0) === answer) {
      message.textContent = tr('revealCellAlreadyCorrect');
      message.className = 'alert alert-info py-2 mt-3 mb-0';
      message.hidden = false;
      return;
    }
    if (points < REVEAL_CELL_COST) {
      message.textContent = interpolate(tr('pointsNeedReveal'), { cost: REVEAL_CELL_COST });
      message.className = 'alert alert-warning py-2 mt-3 mb-0';
      message.hidden = false;
      return;
    }

    points -= REVEAL_CELL_COST;
    revealedCells.add(selection);
    savePoints();
    input.value = String(answer);
    input.closest('td').classList.add('practice-cell-revealed');
    input.dispatchEvent(new Event('input', { bubbles: true }));
    renderRevealOptions();
    message.textContent = interpolate(tr('revealCellSuccess'), {
      cell: practice.balanced.rowLabels[row] + ' → ' + practice.balanced.colLabels[column],
      answer: fmt(answer),
      cost: REVEAL_CELL_COST,
      balance: fmt(points)
    });
    message.className = 'alert alert-success py-2 mt-3 mb-0';
    message.hidden = false;
  }

  function checkAllocations() {
    if (reviewMode) return;
    if (!practice) {
      $('#practiceHintMessage').textContent = tr('generateFirst');
      $('#practiceHintMessage').hidden = false;
      return;
    }
    const { allocations, invalid } = readAllocations();
    const feedback = $('#practiceFeedback');
    const remaining = remainingMargins(allocations);
    if (invalid || remaining.supply.some((value) => value < 0) || remaining.demand.some((value) => value < 0)) {
      feedback.textContent = invalid ? tr('invalidAmounts') : tr('hintOver');
      feedback.className = 'alert alert-warning mt-3 mb-0';
      feedback.hidden = false;
      return;
    }

    const differences = [];
    allocations.forEach((row, i) => row.forEach((value, j) => {
      if (value !== practice.solution.alloc[i][j]) {
        differences.push([i, j]);
      }
    }));
    $$('.practice-allocation').forEach((input) => {
      const i = Number(input.dataset.i);
      const j = Number(input.dataset.j);
      input.classList.toggle('practice-allocation-correct', allocations[i][j] === practice.solution.alloc[i][j]);
      input.classList.toggle('practice-allocation-incorrect', allocations[i][j] !== practice.solution.alloc[i][j]);
      input.closest('.practice-cost-cell').classList.toggle(
        'practice-cell-correct',
        allocations[i][j] === practice.solution.alloc[i][j]
      );
    });

    if (!differences.length) {
      feedback.textContent = tr('correct');
      feedback.className = 'alert alert-success mt-3 mb-0';
      $('#practiceShowSolution').hidden = true;
      $('#practiceShowSolution').textContent = tr('showSolution');
      $('#practiceSolution').hidden = true;
      if (!completedCurrent) celebrateCompletion();
    } else {
      feedback.textContent = practice.difficulty === 'hard'
        ? tr('incorrectHard')
        : interpolate(tr('incorrect'), { count: differences.length });
      feedback.className = 'alert alert-warning mt-3 mb-0';
      updateSolutionAccess(timerStartedAt === null ? 0 : Date.now() - timerStartedAt);
    }
    feedback.hidden = false;
  }

  function clearAllocations() {
    if (!practice || reviewMode || completedCurrent) return;
    hintedCell = null;
    solutionVisible = false;
    const allocations = Array.from({ length: practice.balanced.supply.length }, () =>
      new Array(practice.balanced.demand.length).fill(0));
    revealedCells.forEach((key) => {
      const [i, j] = key.split(',').map(Number);
      allocations[i][j] = practice.solution.alloc[i][j];
    });
    renderMatrix($('#practiceMatrix'), allocations, true);
    updateCorrectAllocationCells();
    $('#practiceHintMessage').hidden = true;
    $('#practiceFeedback').hidden = true;
    $('#practiceShowSolution').hidden = true;
    $('#practiceShowSolution').textContent = tr('showSolution');
    $('#practiceSolution').hidden = true;
    const updatedAllocations = readAllocations().allocations;
    renderRemainingStatus(updatedAllocations);
    renderFlow(updatedAllocations);
  }

  function init() {
    language = $('#languageSelect').value || 'en';
    $('#practiceGenerate').addEventListener('click', generate);
    $('#practiceCurrency').value = loadCurrency();
    $('#practiceCurrency').addEventListener('change', () => {
      saveCurrency();
      if (practice) {
        if (reviewMode) {
          renderMatrix($('#practiceMatrix'), practice.solution.alloc, false);
          renderSolution();
        } else {
          const allocations = readAllocations().allocations;
          renderMatrix($('#practiceMatrix'), allocations, true);
          updateCorrectAllocationCells();
          if (solutionVisible) renderSolution();
        }
      }
    });
    $('#practiceReset').addEventListener('click', clearAllocations);
    $('#practiceHint').addEventListener('click', showHint);
    $('#practiceCheck').addEventListener('click', checkAllocations);
    $('#practiceRevealAnswer').addEventListener('click', revealSelectedCell);
    $('#practiceRevealCell').addEventListener('change', renderPoints);
    $('#practiceDifficulty').addEventListener('change', () => {
      $('#practiceDifficultyHelp').textContent = tr($('#practiceDifficulty').value + 'Help');
      updateProgressUi();
      if (practice) {
        $('#practiceProblemBadge').textContent = interpolate(tr('activeProblem'), {
          difficulty: tr(practice.difficulty).split(' — ')[0],
          rows: practice.supply.length,
          columns: practice.demand.length
        });
      }
    });
    $('#practiceNextProblem').addEventListener('click', startNextProblem);
    $('#practiceReviewNewProblem').addEventListener('click', generate);
    $('#practiceReviewBody').addEventListener('click', (event) => {
      const button = event.target.closest('[data-review-index]');
      if (!button) return;
      restoreReview(Number(button.dataset.reviewIndex));
    });
    $('#practiceShowSolution').addEventListener('click', () => {
      if (!practice || completedCurrent ||
          (timerStartedAt !== null &&
            Date.now() - timerStartedAt < SOLUTION_UNLOCK_MINUTES[practice.difficulty] * 60 * 1000)) return;
      solutionVisible = !solutionVisible;
      $('#practiceSolution').hidden = !solutionVisible;
      $('#practiceShowSolution').textContent = solutionVisible ? tr('hideSolution') : tr('showSolution');
      if (solutionVisible) renderSolution();
    });
    $('#practiceMatrix').addEventListener('input', (event) => {
      if (reviewMode || !event.target.matches('.practice-allocation')) return;
      hintedCell = null;
      $$('.practice-cost-hint').forEach((cell) => cell.classList.remove('practice-cost-hint'));
      $('#practiceHintMessage').hidden = true;
      $('#practiceFeedback').hidden = true;
      $('#practiceCelebration').hidden = true;
      $('#practiceShowSolution').hidden = true;
      $('#practiceShowSolution').textContent = tr('showSolution');
      $('#practiceSolution').hidden = true;
      solutionVisible = false;
      updateCorrectAllocationCells();
      const allocations = readAllocations().allocations;
      renderRemainingStatus(allocations);
      renderFlow(allocations);
    });
    window.addEventListener('transportation-language-changed', (event) => {
      language = event.detail.language;
      renderLanguage();
    });
    updateProgressUi();
    renderReviewHistory();
    renderPoints();
    renderLanguage();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
