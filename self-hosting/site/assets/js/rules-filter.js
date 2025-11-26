async function loadData() {
  const response = await fetch(RULES_JSON_URL);
  return await response.json();
}

function render(rules, searchText = '', typeFilter = '') {
  const results = document.getElementById('results');
  results.innerHTML = '';

  const filtered = [];
  const lowerSearch = searchText.toLowerCase();

  for (const group of rules) {
    const matches = group.entries.filter(entry => {
      const matchesSearch =
        entry.rule.toLowerCase().includes(lowerSearch) ||
        (entry.sourceLabel &&
          entry.sourceLabel.toLowerCase().includes(lowerSearch));
      const matchesType = !typeFilter || (entry.sourceType && entry.sourceType === typeFilter);
      return matchesSearch && matchesType;
    });
    if (matches.length > 0) filtered.push({ number: group.number, entries: matches });
  }

  if (filtered.length === 0) {
    results.innerHTML = `
      <div class="no-matches">
        No matches found. Here's a suggestion:
      </div>
    `;
    
    const container = document.createElement('div');
    container.classList.add('rule-group');

    // Custom card content
    container.innerHTML = `
      <h3>Invoking the unwritten rule</h3>
      <div class="rule-entry">
        <p>When no appropriate rule applies... make one up.</p>
        <p class="rule-source">
          <strong>Source:</strong>
          <a href="https://memory-beta.fandom.com/wiki/False_Profits" target="_blank">False Profits</a>
          (VOY episode)
        </p>
      </div>
    `;

    results.appendChild(container);
    return;
  }

  for (const group of filtered) {
    const container = document.createElement('div');
    container.classList.add('rule-group');

    const entriesHTML = group.entries.map(entry => `
    <div class="rule-entry">
      <p>${entry.rule}</p>
      <p class="rule-source">
        <strong>Source:</strong>
        ${
          entry.sourceURL
            ? `<a href="${entry.sourceURL}" target="_blank">${entry.sourceLabel}</a>`
            : entry.sourceLabel
        }
        ${entry.sourceType ? `(${entry.sourceType})` : ''}
      </p>
    </div>
    `).join('<hr class="rule-divider">');

    container.innerHTML = `<h3>Rule ${group.number}</h3>${entriesHTML}`;
    results.appendChild(container);
  }
}

async function main() {
  const rules = await loadData();

  // Populate sourceType dropdown
  const allTypes = new Set();
  for (const group of rules) {
    for (const entry of group.entries) {
      if (entry.sourceType) allTypes.add(entry.sourceType);
    }
  }
  const select = document.getElementById('typeFilter');
  [...allTypes].sort().forEach(type => {
    const opt = document.createElement('option');
    opt.value = type;
    opt.textContent = type;
    select.appendChild(opt);
  });

  const input = document.getElementById('search');
  const typeSelect = document.getElementById('typeFilter');
  const update = () => render(rules, input.value, typeSelect.value);

  input.addEventListener('input', update);
  typeSelect.addEventListener('change', update);

  // Initial render: filter based on any pre-filled values
  update();
}

main();