document.addEventListener("DOMContentLoaded", function() {
    const params = new URLSearchParams(window.location.search);
    const categoryParam = params.get('category');
  
    fetch('dictionary.json')
      .then(response => response.json())
      .then(dictionary => {
        const listContainer = document.getElementById('hanzi-list');
        let hanziKeys = Object.keys(dictionary);
  
        if (categoryParam) {
          hanziKeys = hanziKeys.filter(hanzi => dictionary[hanzi].category === categoryParam);
        }
        if (hanziKeys.length === 0) {
          listContainer.innerHTML = "<li class='list-group-item'>No hanzi found for this category.</li>";
          return;
        }
  
        hanziKeys.forEach(hanzi => {
          const li = document.createElement('li');
          li.className = "list-group-item d-flex align-items-center";
  
          li.innerHTML = `
            <div class="mr-3 hanzi-inline hanzi-display">${hanzi}</div>
            <div class="mr-3 pinyin-inline pinyin">${dictionary[hanzi].pinyin || ''}</div>
            <div class="mr-3 translation-inline translation">${dictionary[hanzi].translation || ''}</div>
            <a href="character.html?char=${encodeURIComponent(hanzi)}" class="btn btn-primary ml-auto btn-learn">Learn More</a>
          `;
          
          listContainer.appendChild(li);
        });
      })
      .catch(error => {
        console.error('Error loading dictionary:', error);
        document.getElementById('hanzi-list').innerHTML = "<li class='list-group-item'>Error loading hanzi list.</li>";
      });
  });
  