var xhr = new XMLHttpRequest();
xhr.open('GET', 'https://api.coincap.io/v2/assets');
xhr.responseType = 'json';
xhr.addEventListener('load', function () {
  if (localStorage.getItem('cryptocurrency')) {
    for (var t = 0; t < data.coins.length; t++) {
      $tBody.appendChild(renderCrypto(data.coins[t]));
    }
  } else {
    for (var i = 0; i < 50; i++) {
      data.coins.push(xhr.response.data[i]);
    }
    for (var k = 0; k < data.coins.length; k++) {
      $tBody.appendChild(renderCrypto(data.coins[k]));
    }
  }
});
xhr.send();

document.addEventListener('DOMContentLoaded', event => {
  viewSwap(data.view);
});

var $tBody = document.querySelector('tbody');

function renderCrypto(crypto) {
  var $tr = document.createElement('tr');

  var $tdOne = document.createElement('td');
  $tdOne.textContent = crypto.rank;
  $tr.appendChild($tdOne);

  var $tdTwo = document.createElement('td');
  $tdTwo.textContent = crypto.name + '(' + crypto.symbol + ')';
  $tr.appendChild($tdTwo);

  var $tdThree = document.createElement('td');
  $tdThree.textContent = '$' + parseFloat(crypto.priceUsd).toFixed(2);
  $tr.appendChild($tdThree);

  var $tdFour = document.createElement('td');
  $tdFour.textContent = parseFloat(crypto.changePercent24Hr).toFixed(2) + '%';
  $tr.appendChild($tdFour);

  var $tdFive = document.createElement('td');
  $tdFive.textContent = parseInt(parseFloat(crypto.marketCapUsd).toFixed(0)).toLocaleString();
  $tr.appendChild($tdFive);

  var $tdSix = document.createElement('td');
  $tdSix.textContent = parseInt(parseFloat(crypto.volumeUsd24Hr).toFixed(0)).toLocaleString();
  $tr.appendChild($tdSix);

  var $tdSeven = document.createElement('td');
  $tdSeven.textContent = parseInt(parseFloat(crypto.supply).toFixed(0)).toLocaleString();
  $tr.appendChild($tdSeven);

  var $tdEight = document.createElement('td');
  $tr.appendChild($tdEight);

  var $iTag = document.createElement('i');
  if (data.myWallet.length > 0) {
    if (data.myWallet.find(item => item.id === crypto.id) === undefined) {
      $iTag.setAttribute('class', 'fa-solid fa-plus');
      $tdEight.appendChild($iTag);
    } else {
      $iTag.setAttribute('class', 'hidden');
      $tdEight.appendChild($iTag);
    }
  } else {
    $iTag.setAttribute('class', 'fa-solid fa-plus');
    $tdEight.appendChild($iTag);
  }
  return $tr;
}

var $homePage = document.querySelector('div[data-view=home-page]');
var $converterPage = document.querySelector('div[data-view=converter-page]');
var $walletPage = document.querySelector('div[data-view=wallet-page]');
function viewSwap(view) {
  if (view === 'home-page') {
    $homePage.setAttribute('class', '');
    data.view = view;
    $converterPage.setAttribute('class', 'hidden');
    $walletPage.setAttribute('class', 'hidden');
  } else if (view === 'converter-page') {
    $converterPage.setAttribute('class', '');
    data.view = view;
    $homePage.setAttribute('class', 'hidden');
    $walletPage.setAttribute('class', 'hidden');
  } else if (view === 'wallet-page') {
    $walletPage.setAttribute('class', '');
    data.view = view;
    $homePage.setAttribute('class', 'hidden');
    $converterPage.setAttribute('class', 'hidden');
  }
}

var $coinsTab = document.querySelector('#coin-tab');
var $converterTab = document.querySelector('#converter-tab');
var $walletTab = document.querySelector('#wallet-tab');
$coinsTab.addEventListener('click', function () { viewSwap('home-page'); });
$converterTab.addEventListener('click', function () { viewSwap('converter-page'); });
$walletTab.addEventListener('click', function () { viewSwap('wallet-page'); });
var $form = document.querySelector('form');

function convert(event) {
  event.preventDefault();
  var $totalCalculated = document.querySelector('#total-calculated');
  var currencyOne = $form.elements.currencyone.value;
  var currencyTwo = $form.elements.currencytwo.value;
  var amount = $form.elements.amount.value;
  var yourTotal;
  var totalSymbol;
  var totalWorth;
  for (var i = 0; i < data.coins.length; i++) {
    var lowerCaseOne = currencyOne.toLowerCase();
    var firstWordCapOne = lowerCaseOne[0].toUpperCase();
    if (lowerCaseOne.replace(lowerCaseOne[0], firstWordCapOne) === data.coins[i].name) {
      yourTotal = parseFloat(parseInt(parseFloat(amount).toFixed(2)) * parseInt(parseFloat(data.coins[i].priceUsd).toFixed(2))).toFixed(2);
      break;
    }
  }

  for (var k = 0; k < data.coins.length; k++) {
    var lowerCaseTwo = currencyTwo.toLowerCase();
    var firstWordCapTwo = lowerCaseTwo[0].toUpperCase();
    if (lowerCaseTwo.replace(lowerCaseTwo[0], firstWordCapTwo) === data.coins[k].name) {
      totalSymbol = data.coins[k].symbol;
      totalWorth = yourTotal / parseInt(parseFloat(data.coins[k].priceUsd).toFixed(2));
      break;
    }
  }
  var finalTotal = $totalCalculated.textContent = parseFloat(totalWorth).toFixed(5) + ' ' + totalSymbol;
  return finalTotal;
}
$form.addEventListener('submit', convert);

var $table = document.querySelector('table');
$table.addEventListener('click', handleClick);
function handleClick(event) {
  if (event.target.nodeName === 'I') {
    var $closest = event.target.closest('.fa-plus');
    $closest.setAttribute('class', 'hidden');
    var $closestCrypto = event.target.closest('tr');
    var $tr = document.querySelectorAll('tr');
    for (var i = 1; i < data.coins.length + 1; i++) {
      if ($closestCrypto === $tr[i]) {
        data.myWallet.push(data.coins[i - 1]);
      }
    }
  }
}

function renderMyWallet(coin) {
  var $div = document.createElement('div');
  $div.setAttribute('class', 'card-wrapper');

  var $h3 = document.createElement('h3');
  $h3.textContent = coin.name + '(' + coin.symbol + ')';
  $div.appendChild($h3);

  var $divChild = document.createElement('div');
  $divChild.setAttribute('class', 'card-container');
  $div.appendChild($divChild);

  var $pOne = document.createElement('p');
  var $brOne = document.createElement('br');
  $pOne.textContent = 'Rank:';
  $pOne.appendChild($brOne);
  $pOne.textContent += coin.rank;
  $divChild.appendChild($pOne);

  var $pTwo = document.createElement('p');
  var $brTwo = document.createElement('br');
  $pTwo.textContent = 'Price:';
  $pTwo.appendChild($brTwo);
  $pTwo.textContent += '$' + parseFloat(coin.priceUsd).toFixed(2);
  $divChild.appendChild($pTwo);

  var $pThree = document.createElement('p');
  var $brThree = document.createElement('br');
  $pThree.textContent = '24%:';
  $pThree.appendChild($brThree);
  $pThree.textContent += parseFloat(coin.changePercent24Hr).toFixed(2) + '%';
  $divChild.appendChild($pThree);

  var $pFour = document.createElement('p');
  var $brFour = document.createElement('br');
  $pFour.textContent = 'Market Cap:';
  $pFour.appendChild($brFour);
  $pFour.textContent += parseInt(parseFloat(coin.marketCapUsd).toFixed(0)).toLocaleString();
  $divChild.appendChild($pFour);

  var $pFive = document.createElement('p');
  var $brFive = document.createElement('br');
  $pFive.textContent = 'Volume(24h):';
  $pFive.appendChild($brFive);
  $pFive.textContent += parseInt(parseFloat(coin.volumeUsd24Hr).toFixed(0)).toLocaleString();
  $divChild.appendChild($pFive);

  var $pSix = document.createElement('p');
  var $brSix = document.createElement('br');
  $pSix.textContent = 'Circulating Supply:';
  $pSix.appendChild($brSix);
  $pSix.textContent += parseInt(parseFloat(coin.supply).toFixed(0)).toLocaleString();
  $divChild.appendChild($pSix);

  var $pSeven = document.createElement('p');
  var $brSeven = document.createElement('br');
  $pSeven.textContent = 'Total:';
  $pSeven.appendChild($brSeven);
  $pSeven.textContent += '1';
  $div.appendChild($pOne);

  var $iTag = document.querySelector('i');
  $iTag.setAttribute('class', 'fa-solid fa-minus fa-xl');
  $div.appendChild($iTag);

  return $div;
}

renderMyWallet();
