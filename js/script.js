document.addEventListener("DOMContentLoaded", function () {
  const params = new URLSearchParams(window.location.search);
  const hanziString = params.get('char') || '你'; // fallback to default character

  // Update main hanzi display
  document.getElementById('hanziDisplay').innerText = hanziString;

// Prepare stroke animation area
const animationContainer = document.getElementById('stroke-animation');
animationContainer.innerHTML = ''; // clear previous

const charArray = hanziString.split('');
const writerWidth = 300; // keep full size for each, let them wrap or scroll

charArray.forEach((char, index) => {
  // Outer box with red border
  const strokeBox = document.createElement('div');
  strokeBox.className = 'stroke-box'; // use CSS for red border etc.
  strokeBox.style.display = 'inline-block';
  strokeBox.style.margin = '10px';

  // Inner div for actual writer canvas
  const charDiv = document.createElement('div');
  charDiv.id = `stroke-char-${index}`;
  charDiv.style.width = '300px';
  charDiv.style.height = '300px';

  strokeBox.appendChild(charDiv);
  animationContainer.appendChild(strokeBox);

  const writer = HanziWriter.create(charDiv.id, char, {
    width: 300,
    height: 300,
    padding: 20,
    strokeAnimationSpeed: 2,
    delayBetweenStrokes: 500,
    strokeColor: '#000'
  });
  writer.animateCharacter();
});


  // Load pinyin and translation
  fetch('dictionary.json')
    .then(response => response.json())
    .then(dictionary => {
      if (dictionary[hanziString]) {
        document.getElementById('pinyinDisplay').innerText = dictionary[hanziString].pinyin;
        document.getElementById('translationDisplay').innerText = dictionary[hanziString].translation;
      } else {
        document.getElementById('pinyinDisplay').innerText = 'Character not recognized';
        document.getElementById('translationDisplay').innerText = 'No pinyin or translation available';
      }
    })
    .catch(error => {
      console.error('Error loading dictionary:', error);
      document.getElementById('pinyinDisplay').innerText = 'Error loading data';
      document.getElementById('translationDisplay').innerText = 'Please try again later';
    });
});
