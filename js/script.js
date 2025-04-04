document.addEventListener("DOMContentLoaded", function() {
  const params = new URLSearchParams(window.location.search);
  const hanziChar = params.get('char') || '你';

  document.getElementById('hanziDisplay').innerText = hanziChar;

  const writer = HanziWriter.create('stroke-animation', hanziChar, {
    width: 300,
    height: 300,
    padding: 20,
    strokeAnimationSpeed: 2,
    delayBetweenStrokes: 500,
    strokeColor: '#000'
  });
  writer.animateCharacter();

  fetch('dictionary.json')
    .then(response => response.json())
    .then(dictionary => {
      if (dictionary[hanziChar]) {
        document.getElementById('pinyinDisplay').innerText = dictionary[hanziChar].pinyin;
        document.getElementById('translationDisplay').innerText = dictionary[hanziChar].translation;
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
