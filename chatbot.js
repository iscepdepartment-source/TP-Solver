(function () {
  'use strict';

  const toggle = document.querySelector('#studentChatToggle');
  const panel = document.querySelector('#studentChatPanel');
  const close = document.querySelector('#studentChatClose');
  const messages = document.querySelector('#studentChatMessages');
  const welcome = document.querySelector('#studentChatWelcome');
  const questions = document.querySelector('#studentChatQuestions');
  const currencySigns = { USD: '$', PHP: '₱', EUR: '€', GBP: '£' };
  let language = document.querySelector('#languageSelect').value || 'en';

  const text = (english, tagalog) => language === 'tl'
    ? tagalog
    : language === 'tl-en'
      ? window.transportationToTaglish(tagalog)
      : english;
  const fmt = (value) => Number(value).toLocaleString('en-US', { maximumFractionDigits: 4 });
  const fmtMoney = (value, currency) => (currencySigns[currency] || '$') + fmt(value);

  function addMessage(content, role) {
    const message = document.createElement('div');
    message.className = 'chat-message ' + role;
    message.textContent = content;
    messages.insertBefore(message, questions);
    messages.scrollTop = messages.scrollHeight;
  }

  function getContext() {
    return typeof window.getTransportationChatContext === 'function'
      ? window.getTransportationChatContext()
      : null;
  }

  function getMarginMismatches(problem) {
    const rowTotals = problem.rowTotals || problem.shipments.map((row) =>
      row.reduce((sum, value) => sum + value, 0));
    const columnTotals = problem.columnTotals || problem.demand.map((_, column) =>
      problem.shipments.reduce((sum, row) => sum + row[column], 0));
    const mismatches = [];

    rowTotals.forEach((total, index) => {
      if (Math.abs(total - problem.supply[index]) > 1e-9) {
        mismatches.push({
          label: 'S' + (index + 1),
          actual: total,
          required: problem.supply[index]
        });
      }
    });
    columnTotals.forEach((total, index) => {
      if (Math.abs(total - problem.demand[index]) > 1e-9) {
        mismatches.push({
          label: 'D' + (index + 1),
          actual: total,
          required: problem.demand[index]
        });
      }
    });
    return mismatches;
  }

  function getLowestCostRoutes(problem) {
    const lowest = Math.min(...problem.costs.flat());
    const routes = [];
    problem.costs.forEach((row, i) => row.forEach((cost, j) => {
      if (Math.abs(cost - lowest) <= 1e-9) {
        routes.push({ cell: 'S' + (i + 1) + ' → D' + (j + 1), cost: cost });
      }
    }));
    return routes;
  }

  function getQuestions(problem) {
    const supplyTotal = problem.supply.reduce((sum, value) => sum + value, 0);
    const demandTotal = problem.demand.reduce((sum, value) => sum + value, 0);
    const terms = problem.terms || [];
    const mismatches = getMarginMismatches(problem);
    const largestShipments = terms.length
      ? terms.filter((term) => Math.abs(term.quantity - Math.max(...terms.map((item) => item.quantity))) <= 1e-9)
      : [];
    const largestCostTerms = terms.length
      ? terms.filter((term) => Math.abs(term.product - Math.max(...terms.map((item) => item.product))) <= 1e-9)
      : [];
    const lowestCostRoutes = getLowestCostRoutes(problem);
    const routes = (items) => items.map((item) => item.cell).join(', ');

    const choices = [
      {
        id: 'balance',
        label: problem.balanced
          ? text('Why is this problem balanced? ', 'Bakit balanse ang problemang ito? ') +
            fmt(supplyTotal) + ' = ' + fmt(demandTotal)
          : text('Why is this problem unbalanced? ', 'Bakit hindi balanse ang problemang ito? ') +
            fmt(supplyTotal) + ' ≠ ' + fmt(demandTotal)
      },
      {
        id: 'totals',
        label: text(
          'How were total supply ' + fmt(supplyTotal) + ' and total demand ' + fmt(demandTotal) + ' calculated?',
          'Paano kinuwenta ang kabuuang supply na ' + fmt(supplyTotal) + ' at demand na ' + fmt(demandTotal) + '?'
        )
      },
      {
        id: mismatches.length ? 'mismatches' : 'fulfillment',
        data: mismatches,
        label: mismatches.length
          ? text('Which shipment totals do not match the requirements?', 'Aling kabuuang padala ang hindi tugma sa kailangan?')
          : text('Does the shipment plan meet every requirement?', 'Tugma ba ang plano sa lahat ng kailangang supply at demand?')
      },
      {
        id: 'lowestCost',
        data: lowestCostRoutes,
        label: text('Which route has the lowest unit cost? ', 'Aling ruta ang may pinakamababang gastos bawat yunit? ') +
          fmtMoney(lowestCostRoutes[0].cost, problem.currency)
      }
    ];

    if (largestShipments.length) {
      choices.push({
        id: 'largestShipment',
        data: largestShipments,
        label: text('Why is the largest shipment ', 'Bakit pinakamalaki ang padala na ') +
          routes(largestShipments) + ' (' + fmt(largestShipments[0].quantity) + ')?'
      });
    }

    if (largestCostTerms.length) {
      choices.push({
        id: 'largestCost',
        data: largestCostTerms,
        label: text('Which shipment adds most to the cost? ', 'Aling padala ang may pinakamalaking dagdag sa gastos? ') +
          routes(largestCostTerms) + ' (' + fmtMoney(largestCostTerms[0].product, problem.currency) + ')'
      });
    }

    choices.push({
      id: 'totalCost',
      label: text('How did the total cost ', 'Paano nakuha ang kabuuang gastos na ') +
        fmtMoney(problem.totalCost, problem.currency) + text(' add up?', '?')
    });

    return choices;
  }

  function getAnswer(questionId, problem, data) {
    const supplyTotal = problem.supply.reduce((sum, value) => sum + value, 0);
    const demandTotal = problem.demand.reduce((sum, value) => sum + value, 0);

    if (questionId === 'balance') {
      if (problem.balanced) {
        return text(
          'The problem is BALANCED because total supply equals total demand: ' +
            fmt(supplyTotal) + ' = ' + fmt(demandTotal) + '. No dummy source or destination is needed.',
          'BALANSE ang problema dahil magkapantay ang kabuuang supply at demand: ' +
            fmt(supplyTotal) + ' = ' + fmt(demandTotal) + '. Walang kailangang idagdag na dummy source o destination.'
        );
      }

      const supplyIsHigher = supplyTotal > demandTotal;
      const difference = Math.abs(supplyTotal - demandTotal);
      const dummyType = supplyIsHigher ? text('destination', 'destinasyon') : text('source', 'pinagmulan');
      return text(
        'The problem is UNBALANCED because total supply (' + fmt(supplyTotal) +
          ') and total demand (' + fmt(demandTotal) + ') differ by ' +
          fmt(difference) + '. A dummy ' + dummyType + ' with ' + fmt(difference) +
          ' units can represent the difference.',
        'HINDI BALANSE ang problema dahil magkaiba ang kabuuang supply (' + fmt(supplyTotal) +
          ') at demand (' + fmt(demandTotal) + '). Magkaiba ang mga ito nang ' +
          fmt(difference) + '. Maaaring gumamit ng dummy ' + dummyType + ' na may ' +
          fmt(difference) + ' yunit para katawanin ang diperensya.'
      );
    }

    if (questionId === 'totals') {
      return text(
        'Add the supply values for all sources: ' + problem.supply.map(fmt).join(' + ') +
          ' = ' + fmt(supplyTotal) + '. Add the demand values for all destinations: ' +
          problem.demand.map(fmt).join(' + ') + ' = ' + fmt(demandTotal) + '.',
        'Pagsamahin ang supply ng lahat ng source: ' + problem.supply.map(fmt).join(' + ') +
          ' = ' + fmt(supplyTotal) + '. Pagsamahin ang demand ng lahat ng destination: ' +
          problem.demand.map(fmt).join(' + ') + ' = ' + fmt(demandTotal) + '.'
      );
    }

    if (questionId === 'fulfillment' || questionId === 'mismatches') {
      if (!data || !data.length) {
        return text(
          'Yes. Every source shipment total matches its supply, and every destination shipment total matches its demand.',
          'Oo. Tugma ang kabuuang padala ng bawat source sa supply nito, at ang kabuuang natanggap ng bawat destination sa demand nito.'
        );
      }
      const difference = (item) => Math.abs(item.actual - item.required);
      const status = (item) => item.actual < item.required
        ? text('short by ', 'kulang ng ') + fmt(difference(item))
        : text('over by ', 'sobra ng ') + fmt(difference(item));
      const details = data.map((item) =>
        item.label + ': ' + fmt(item.actual) + ' / ' + fmt(item.required) +
        ' (' + status(item) + ')').join('\n');
      return text(
        'These shipment totals do not equal their requirements. Actual / required:\n' + details +
          '\nThe quantities are the plan entered; adjust them in the matrix if needed.',
        'Hindi tugma ang mga kabuuang padalang ito sa mga kinakailangan. Aktuwal / kailangan:\n' +
          details + '\nIkaw ang naglagay ng mga quantity; maaari mong baguhin ang mga ito sa matrix kung kinakailangan.'
      );
    }

    if (questionId === 'lowestCost') {
      const routes = data.map((route) => route.cell + ' (' + fmtMoney(route.cost, problem.currency) + ')').join(', ');
      return text(
        'The lowest unit transportation cost is ' + fmtMoney(data[0].cost, problem.currency) +
          ' at ' + routes + '. This identifies the cheapest unit-cost cell; it does not mean the solver selected or optimized the shipment plan.',
        'Ang pinakamababang gastos bawat yunit ay ' + fmtMoney(data[0].cost, problem.currency) +
          ' sa ' + routes + '. Ipinapakita nito ang pinakamurang gastos sa cell; hindi ibig sabihin na pinili o in-optimize ng solver ang plano ng padala.'
      );
    }

    if (questionId === 'largestShipment') {
      const details = data.map((term) =>
        term.cell + ': ' + fmt(term.quantity) + ' × ' + fmtMoney(term.cost, problem.currency) +
        ' = ' + fmtMoney(term.product, problem.currency)).join('\n');
      return text(
        'This is the largest positive shipment quantity in the plan you entered:\n' + details +
          '\nIts amount was entered by you; the solver calculates its cost but does not choose the shipment quantity.',
        'Ito ang pinakamalaking positibong dami ng padala sa planong inilagay mo:\n' + details +
          '\nIkaw ang naglagay ng dami nito; kinukuwenta lamang ng solver ang gastos at hindi nito pinipili ang quantity ng padala.'
      );
    }

    if (questionId === 'largestCost') {
      const details = data.map((term) =>
        term.cell + ': ' + fmt(term.quantity) + ' × ' + fmtMoney(term.cost, problem.currency) +
        ' = ' + fmtMoney(term.product, problem.currency)).join('\n');
      return text(
        'These shipment(s) contribute the most to the total cost:\n' + details +
          '\nA larger contribution can come from a high unit cost, a large quantity, or both.',
        'Pinakamalaki ang ambag ng mga padalang ito sa kabuuang gastos:\n' + details +
          '\nMaaaring malaki ang ambag dahil mataas ang gastos bawat yunit, marami ang quantity, o pareho.'
      );
    }

    const terms = problem.terms || [];
    if (!terms.length) {
      return text(
        'There are no positive shipment quantities, so the total transportation cost is ' +
          fmtMoney(problem.totalCost || 0, problem.currency) + '.',
        'Walang positibong dami ng padala, kaya ' +
          fmtMoney(problem.totalCost || 0, problem.currency) + ' ang kabuuang gastos sa transportasyon.'
      );
    }
    const calculations = terms.map((term) =>
      term.cell + ': ' + fmt(term.quantity) + ' × ' + fmtMoney(term.cost, problem.currency) +
      ' = ' + fmtMoney(term.product, problem.currency));
    const sum = terms.map((term) => fmtMoney(term.product, problem.currency)).join(' + ');
    return text(
      'Multiply each shipment quantity by its unit cost, then add the results:\n' +
        calculations.join('\n') + '\n' + sum + ' = ' + fmtMoney(problem.totalCost, problem.currency) + '.',
      'I-multiply ang bawat dami ng padala sa gastos bawat yunit, pagkatapos ay pagsamahin ang mga resulta:\n' +
        calculations.join('\n') + '\n' + sum + ' = ' + fmtMoney(problem.totalCost, problem.currency) + '.'
    );
  }

  function renderQuestions() {
    const context = getContext();
    const problem = context && context.problem;
    document.querySelector('#studentChatPanel').setAttribute(
      'aria-label',
      text('Problem guide', 'Gabay sa problema')
    );
    questions.setAttribute('aria-label', text('Questions about this problem', 'Mga tanong tungkol sa problemang ito'));
    welcome.textContent = text(
      'Choose a question to see an explanation using the numbers in your result.',
      'Pumili ng tanong upang makita ang paliwanag gamit ang mga numero sa iyong resulta.'
    );
    messages.querySelectorAll('.chat-message:not(#studentChatWelcome)').forEach((message) => message.remove());
    questions.replaceChildren();

    if (!problem) return;

    getQuestions(problem).forEach((choice) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'btn btn-sm btn-outline-primary student-chat-question';
      button.textContent = choice.label;
      button.addEventListener('click', () => {
        const latestContext = getContext();
        if (!latestContext || !latestContext.problem) {
          renderQuestions();
          return;
        }
        addMessage(choice.label, 'user');
        addMessage(getAnswer(choice.id, latestContext.problem, choice.data), 'assistant');
      });
      questions.appendChild(button);
    });
  }

  function setOpen(open) {
    panel.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    if (!open) toggle.focus();
  }

  toggle.addEventListener('click', () => setOpen(panel.hidden));
  close.addEventListener('click', () => setOpen(false));
  window.addEventListener('transportation-language-changed', (event) => {
    language = event.detail.language;
    renderQuestions();
  });
  window.addEventListener('transportation-problem-updated', renderQuestions);
  renderQuestions();
})();
