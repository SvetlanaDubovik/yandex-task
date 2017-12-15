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
    
  var myMap = new ymaps.Map('map', {
    center: destinations[0],
    zoom: 4
  });
    
  myMap.geoObjects       
    .add(new ymaps.Placemark(destinations[0], {
      iconCaption: 'Точка отправления и возврата'
    }, {
      iconColor: 'green'
    }));    
   
  // Пользовательские модули не дописываются в неймспейс ymaps.
  // Поэтому доступ к ним мы можем получить асинхронно через метод ymaps.modules.require.        
  ymaps.modules.require(['geoObject.Arrow'], function (Arrow) {
      
    let start = null;
    let end = null;
    for(let i = 0; i < destinations.length; i++) { 
        
      start = destinations[i];
      if(destinations[i+1] !== undefined) {
        end = destinations[i+1];
      } else {
        end = destinations[0];
      }      
        
      var arrow = new Arrow([start, end], null, {
        geodesic: true,
        strokeWidth: 5,
        opacity: 0.5,
        strokeStyle: 'shortdash'
      });
      myMap.geoObjects.add(arrow);
        
    }
  }); 
}


/*
 * Класс, позволяющий создавать стрелку на карте.
 * Является хелпером к созданию полилинии, у которой задан специальный оверлей.
 * При использовании модулей в реальном проекте рекомендуем размещать их в отдельных файлах.
 */
ymaps.modules.define("geoObject.Arrow", [
    'Polyline',
    'overlay.Arrow',
    'util.extend'
], function (provide, Polyline, ArrowOverlay, extend) {
    /**
     * @param {Number[][] | Object | ILineStringGeometry} geometry Геометрия ломаной.
     * @param {Object} properties Данные ломаной.
     * @param {Object} options Опции ломаной.
     * Поддерживается тот же набор опций, что и в классе ymaps.Polyline.
     * @param {Number} [options.arrowAngle=20] Угол в градусах между основной линией и линиями стрелки.
     * @param {Number} [options.arrowMinLength=3] Минимальная длина стрелки. Если длина стрелки меньше минимального значения, стрелка не рисуется.
     * @param {Number} [options.arrowMaxLength=20] Максимальная длина стрелки.
     */
    var Arrow = function (geometry, properties, options) {
        return new Polyline(geometry, properties, extend({}, options, {
            lineStringOverlay: ArrowOverlay
        }));
    };
    provide(Arrow);
});

/*
 * Класс, реализующий интерфейс IOverlay.
 * Получает на вход пиксельную геометрию линии и добавляет стрелку на конце линии.
 */
ymaps.modules.define("overlay.Arrow", [
    'overlay.Polygon',
    'util.extend',
    'event.Manager',
    'option.Manager',
    'Event',
    'geometry.pixel.Polygon'
], function (provide, PolygonOverlay, extend, EventManager, OptionManager, Event, PolygonGeometry) {
    var domEvents = [
            'click',
            'contextmenu',
            'dblclick',
            'mousedown',
            'mouseenter',
            'mouseleave',
            'mousemove',
            'mouseup',
            'multitouchend',
            'multitouchmove',
            'multitouchstart',
            'wheel'
        ],

        /**
         * @param {geometry.pixel.Polyline} pixelGeometry Пиксельная геометрия линии.
         * @param {Object} data Данные оверлея.
         * @param {Object} options Опции оверлея.
         */
        ArrowOverlay = function (pixelGeometry, data, options) {
            // Поля .events и .options обязательные для IOverlay.
            this.events = new EventManager();
            this.options = new OptionManager(options);
            this._map = null;
            this._data = data;
            this._geometry = pixelGeometry;
            this._overlay = null;
        };

    ArrowOverlay.prototype = extend(ArrowOverlay.prototype, {
        // Реализовываем все методы и события, которые требует интерфейс IOverlay.
        getData: function () {
            return this._data;
        },

        setData: function (data) {
            if (this._data != data) {
                var oldData = this._data;
                this._data = data;
                this.events.fire('datachange', {
                    oldData: oldData,
                    newData: data
                });
            }
        },

        getMap: function () {
            return this._map;
        },

        setMap: function (map) {
            if (this._map != map) {
                var oldMap = this._map;
                if (!map) {
                    this._onRemoveFromMap();
                }
                this._map = map;
                if (map) {
                    this._onAddToMap();
                }
                this.events.fire('mapchange', {
                    oldMap: oldMap,
                    newMap: map
                });
            }
        },

        setGeometry: function (geometry) {
            if (this._geometry != geometry) {
                var oldGeometry = geometry;
                this._geometry = geometry;
                if (this.getMap() && geometry) {
                    this._rebuild();
                }
                this.events.fire('geometrychange', {
                    oldGeometry: oldGeometry,
                    newGeometry: geometry
                });
            }
        },

        getGeometry: function () {
            return this._geometry;
        },

        getShape: function () {
            return null;
        },

        isEmpty: function () {
            return false;
        },

        _rebuild: function () {
            this._onRemoveFromMap();
            this._onAddToMap();
        },

        _onAddToMap: function () {
            // Военная хитрость - чтобы в прозрачной ломаной хорошо отрисовывались самопересечения,
            // мы рисуем вместо линии многоугольник.
            // Каждый контур многоугольника будет отвечать за часть линии.
            this._overlay = new PolygonOverlay(new PolygonGeometry(this._createArrowContours()));
            this._startOverlayListening();
            // Эта строчка свяжет два менеджера опций.
            // Опции, заданные в родительском менеджере,
            // будут распространяться и на дочерний.
            this._overlay.options.setParent(this.options);
            this._overlay.setMap(this.getMap());
        },

        _onRemoveFromMap: function () {
            this._overlay.setMap(null);
            this._overlay.options.setParent(null);
            this._stopOverlayListening();
        },

        _startOverlayListening: function () {
            this._overlay.events.add(domEvents, this._onDomEvent, this);
        },

        _stopOverlayListening: function () {
            this._overlay.events.remove(domEvents, this._onDomEvent, this);
        },

        _onDomEvent: function (e) {
            // Мы слушаем события от дочернего служебного оверлея
            // и прокидываем их на внешнем классе.
            // Это делается для того, чтобы в событии было корректно определено
            // поле target.
            this.events.fire(e.get('type'), new Event({
                target: this
            // Свяжем исходное событие с текущим, чтобы все поля данных дочернего события
            // были доступны в производном событии.
            }, e));
        },

        _createArrowContours: function () {
            var contours = [],
                mainLineCoordinates = this.getGeometry().getCoordinates(),
                arrowLength = calculateArrowLength(
                    mainLineCoordinates,
                    this.options.get('arrowMinLength', 3),
                    this.options.get('arrowMaxLength', 20)
                );
            contours.push(getContourFromLineCoordinates(mainLineCoordinates));
            // Будем рисовать стрелку только если длина линии не меньше длины стрелки.
            if (arrowLength > 0) {
                // Создадим еще 2 контура для стрелочек.
                var lastTwoCoordinates = [
                        mainLineCoordinates[mainLineCoordinates.length - 2],
                        mainLineCoordinates[mainLineCoordinates.length - 1]
                    ],
                // Для удобства расчетов повернем стрелку так, чтобы она была направлена вдоль оси y,
                // а потом развернем результаты обратно.
                    rotationAngle = getRotationAngle(lastTwoCoordinates[0], lastTwoCoordinates[1]),
                    rotatedCoordinates = rotate(lastTwoCoordinates, rotationAngle),

                    arrowAngle = this.options.get('arrowAngle', 20) / 180 * Math.PI,
                    arrowBeginningCoordinates = getArrowsBeginningCoordinates(
                        rotatedCoordinates,
                        arrowLength,
                        arrowAngle
                    ),
                    firstArrowCoordinates = rotate([
                        arrowBeginningCoordinates[0],
                        rotatedCoordinates[1]
                    ], -rotationAngle),
                    secondArrowCoordinates = rotate([
                        arrowBeginningCoordinates[1],
                        rotatedCoordinates[1]
                    ], -rotationAngle);

                contours.push(getContourFromLineCoordinates(firstArrowCoordinates));
                contours.push(getContourFromLineCoordinates(secondArrowCoordinates));
            }
            return contours;
        }
    });

    function getArrowsBeginningCoordinates (coordinates, arrowLength, arrowAngle) {
        var p1 = coordinates[0],
            p2 = coordinates[1],
            dx = arrowLength * Math.sin(arrowAngle),
            y = p2[1] - arrowLength * Math.cos(arrowAngle);
        return [[p1[0] - dx, y], [p1[0] + dx, y]];
    }

    function rotate (coordinates, angle) {
        var rotatedCoordinates = [];
        for (var i = 0, l = coordinates.length, x, y; i < l; i++) {
            x = coordinates[i][0];
            y = coordinates[i][1];
            rotatedCoordinates.push([
                x * Math.cos(angle) - y * Math.sin(angle),
                x * Math.sin(angle) + y * Math.cos(angle)
            ]);
        }
        return rotatedCoordinates;
    }

    function getRotationAngle (p1, p2) {
        return Math.PI / 2 - Math.atan2(p2[1] - p1[1], p2[0] - p1[0]);
    }

    function getContourFromLineCoordinates (coords) {
        var contour = coords.slice();
        for (var i = coords.length - 2; i > -1; i--) {
            contour.push(coords[i]);
        }
        return contour;
    }

    function calculateArrowLength (coords, minLength, maxLength) {
        var linePixelLength = 0;
        for (var i = 1, l = coords.length; i < l; i++) {
            linePixelLength += getVectorLength(
                coords[i][0] - coords[i - 1][0],
                coords[i][1] - coords[i - 1][1]
            );
            if (linePixelLength / 3 > maxLength) {
                return maxLength;
            }
        }
        var finalArrowLength = linePixelLength / 3;
        return finalArrowLength < minLength ? 0 : finalArrowLength;
    }

    function getVectorLength (x, y) {
        return Math.sqrt(x * x + y * y);
    }

    provide(ArrowOverlay);
});  
  

