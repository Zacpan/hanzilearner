document.addEventListener("DOMContentLoaded", function() {
  const params = new URLSearchParams(window.location.search);
  const hskParam = params.get('hsk');

  const listContainer = document.getElementById('hanzi-list');
  const searchInput = document.getElementById('search-input');
  const filterToggleBtn = document.getElementById('filter-toggle-btn');
  const categoryContainer = document.getElementById('category-container');
  const applyFilterBtn = document.getElementById('apply-filter-btn');
  const categoryButtons = document.querySelectorAll('.category-btn');


  if (filterToggleBtn && categoryContainer) {
    filterToggleBtn.addEventListener('click', function() {
      if (categoryContainer.style.display === "none") {
        categoryContainer.style.display = "block";
      } else {
        categoryContainer.style.display = "none";
      }
    });
  }


  categoryButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      btn.classList.toggle('active');
    });
  });


  fetch('dictionary.json')
    .then(response => response.json())
    .then(dictionary => {

      function renderList(filterValue, selectedCategories) {
        let hanziKeys = Object.keys(dictionary);


        if (hskParam) {
          hanziKeys = hanziKeys.filter(hanzi => {
            const entry = dictionary[hanzi];
            const hskLevel = entry?.tags?.linguistic?.HSKLevel || '';
            return hskLevel.toLowerCase().replace('hsk', '') ===
                   hskParam.toLowerCase().replace('hsk', '');
          });
        }


        if (filterValue) {
          const lowerFilter = filterValue.toLowerCase();
          hanziKeys = hanziKeys.filter(hanzi => {
            const entry = dictionary[hanzi] || {};
            return (
              hanzi.toLowerCase().includes(lowerFilter) ||
              (entry.pinyin && entry.pinyin.toLowerCase().includes(lowerFilter)) ||
              (entry.translation && entry.translation.toLowerCase().includes(lowerFilter))
            );
          });
        }


        if (selectedCategories.length > 0) {
          hanziKeys = hanziKeys.filter(hanzi => {
            const entry = dictionary[hanzi] || {};
            if (!entry.tags || !entry.tags.partsOfSpeech) return false;

            return selectedCategories.some(cat => entry.tags.partsOfSpeech.includes(cat));
          });
        }

        listContainer.innerHTML = "";
        if (hanziKeys.length === 0) {
          listContainer.innerHTML = "<li>No matching hanzi found.</li>";
          return;
        }
      
        hanziKeys.forEach(hanzi => {
          const entry = dictionary[hanzi] || {};
          const pinyin = entry.pinyin || '';
          const translation = entry.translation || '';

          let badgeHTML = '';
          if (entry.tags) {
            if (entry.tags.partsOfSpeech) {
              entry.tags.partsOfSpeech.forEach(pos => {
                badgeHTML += `<span class="tag-badge pos-badge">${pos}</span>`;
              });
            }
            if (entry.tags.usage) {
              entry.tags.usage.forEach(u => {
                badgeHTML += `<span class="tag-badge usage-badge">${u}</span>`;
              });
            }
            const hskLevel = entry.tags.linguistic?.HSKLevel;
            if (hskLevel) {
              badgeHTML += `<span class="tag-badge hsk-badge">${hskLevel}</span>`;
            }
            const freq = entry.tags.linguistic?.frequency;
            if (freq !== null && freq !== undefined) {
              badgeHTML += `<span class="tag-badge freq-badge">Freq: ${freq}</span>`;
            }
          }

          const li = document.createElement('li');
          li.className = "hanzi-item";
          li.innerHTML = `
            <a href="character.html?char=${encodeURIComponent(hanzi)}" class="hanzi-link">${hanzi}</a>
            <div class="hanzi-pinyin">${pinyin}</div>
            <div class="hanzi-translation">${translation}</div>
            <div class="badges-container">${badgeHTML}</div>
          `;
          listContainer.appendChild(li);
        });
      }

      function getSelectedCategories() {
        const selected = [];
        categoryButtons.forEach(btn => {
          if (btn.classList.contains('active')) {
            selected.push(btn.getAttribute('data-category'));
          }
        });
        return selected;
      }

      renderList("", []);

      if (searchInput) {
        searchInput.addEventListener("input", function(e) {
          const selectedCats = getSelectedCategories();
          renderList(e.target.value, selectedCats);
        });
      }

      if (applyFilterBtn) {
        applyFilterBtn.addEventListener("click", function() {
          const searchVal = searchInput ? searchInput.value : "";
          const selectedCats = getSelectedCategories();
          renderList(searchVal, selectedCats);
        });
      }
    })
    .catch(error => {
      console.error('Error loading dictionary:', error);
      listContainer.innerHTML = "<li>Error loading hanzi list.</li>";
    });
});
