/**
 * ЕВРОТУР
 *
 * У вас намечается отпуск и вы хотите посетить ряд знаменитых городов Европы.
 * Для этого вы заранее купили все билеты (TICKETS).
 * Теперь необходимо разложить их по порядку следования маршруту от Москвы и далее
 */

/**
 * ЗАДАЧА
 *
 * 1. Написать программу, которая возвращает билеты в порядке следования по маршруту.
 * 2. Нарисовать маршрут на карте при помощи ломаной
 */


// TODO: Первая часть
const TICKETS = [
  {from: 'Москва', to: 'Хельсинки', ticketId: 'DdasnDCqj7', destination: [55.755537, 37.615244]},
  {from: 'Стокгольм', to: 'Капенгаген', ticketId: 'yQEshnCEWw', destination: [59.320525, 18.036706]},
  {from: 'Берлин', to: 'Париж', ticketId: 'Rb3DArShX9', destination: [52.532355, 13.400476]},
  {from: 'Хельсинки', to: 'Стокгольм', ticketId: 'fRqXDQK9LY', destination: [60.171684, 24.990303]},
  {from: 'Париж', to: 'Мадрид', ticketId: 'dn3sFA2Ls3', destination: [48.891820, 2.337958]},
  {from: 'Прага', to: 'Москва', ticketId: 'bgptJCqdCZ', destination: [50.062719, 14.404070]},
  {from: 'Капенгаген', to: 'Амстердам', ticketId: 'zwdRhXAEVt', destination: [55.705771, 12.499597]},
  {from: 'Амстердам', to: 'Берлин', ticketId: '85xZSg4kRR', destination: [52.317435, 4.897058]},
  {from: 'Рим', to: 'Прага', ticketId: '5p4dYzCc5D', destination: [41.865320, 12.467352]},
  {from: 'Мадрид', to: 'Рим', ticketId: '5JwscWBpk5', destination: [40.437118, -3.704523]}
];

let startCity = 'Москва';

let getTicket = function(arr, search) {
  for (let i = 0; i < arr.length; i++) {
    if(arr[i].from === search) {
      return arr[i];
    }
  } 
};

let sortTickets = function(arr, start) {
  let prevCity = start;
  let newTickets = [];  
  let nextTicket = null;
  let destination = [];
  
  for (let i = 0; i < arr.length; i++) { 
    nextTicket = getTicket(arr, prevCity);
    newTickets.push(nextTicket);
    prevCity = nextTicket.to;
    destination.push(nextTicket.destination);    
  }    
  
  destination.push(newTickets[0].destination);

  return destination;
};

let destinations = sortTickets(TICKETS, startCity);



// TODO: Вторая часть
/**
 * Для выполнения второго пункта вам может пригодиться Polyline
 * https://tech.yandex.ru/maps/doc/jsapi/2.1/quick-start/tasks/quick-start-docpage/
 */
ymaps.ready(init);

function init() {
  
  myMap = new ymaps.Map("map", {
    center: destinations[0],
    zoom: 4
  });
  
  var myPolyline = new ymaps.Polyline(destinations, {
    hintContent: "Мой маршрут"
  }, {
    draggable: false,
    strokeColor: '#FF4500',
    strokeWidth: 6,
    strokeOpacity: 0.5
  });

  myMap.geoObjects
    .add(myPolyline)
    .add(new ymaps.Placemark(destinations[0], {
      iconCaption: 'Точка отправления и возврата'
    }, {
      iconColor: 'green'
    }));
}

