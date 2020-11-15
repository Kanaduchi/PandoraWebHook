module.exports.actions = [
    {
        name: 'greeting',
        response: {
            'default': 'Welcome to the car application',
            'en-us': 'Welcome to the car application',
            'ru-RU': 'Добро пожаловать в меню управления машиной'
        }
    },
    {
        id: -1,
        name: 'out_temp',
        type: 'info',
        response: {
            'default': 'Temperature outside is',
            'en-us': 'Temperature outside is',
            'ru-RU': 'Температура снаружи'
        },
        suffix: {
            'default': 'degrees',
            'en-us': 'degrees',
            'ru-RU': 'градусов'
        }
    },
    {
        id: -2,
        name: 'fuel',
        type: 'info',
        response: {
            'default': 'Fuel level is',
            'en-us': 'Fuel level is',
            'ru-RU': 'Остаток топлива'
        },
        suffix: {
            'default': 'liters',
            'en-us': 'liters',
            'ru-RU': 'литров'
        }
    },
    {
        id: 4,
        name: 'start',
        type: 'command',
        response: {
            'default': 'Engine has been started',
            'en-us': 'Engine has been started',
            'ru-RU': 'Машина заведена'
        },
        suffix: {
            'default': 'RPM',
            'en-us': 'RPM',
            'ru-RU': 'оборотов'
        }
    },
    {
        id: 8,
        name: 'stop',
        type: 'command',
        response: {
            'default': 'Engine has been stopped',
            'en-us': 'Engine has been stopped',
            'ru-RU': 'Двигатель остановлен'
        },
        suffix: {
            'default': ''
        }
    },
    {
        id: 2,
        name: 'open',
        type: 'command',
        response: {
            'default': 'Car has been opened',
            'en-us': 'Car has been opened',
            'ru-RU': 'Машина открыта'
        },
        suffix: {
            'default': ''
        }
    },
    {
        id: 1,
        name: 'close',
        type: 'command',
        response: {
            'default': 'Car has been closed',
            'en-us': 'Car has been closed',
            'ru-RU': 'Машина закрыта'
        },
        suffix: {
            'default': ''
        }
    },
    {
        id: 15,
        name: 'webasta start',
        type: 'command',
        response: {
            'default': 'Webasta has been started',
            'en-us': 'Webasta has been started',
            'ru-RU': 'Подогреватель включен'
        },
        suffix: {
            'default': ''
        }
    },
    {
        id: 16,
        name: 'webasta stop',
        type: 'command',
        response: {
            'default': 'Webasta has been stopped',
            'en-us': 'Webasta has been stopped',
            'ru-RU': 'Подогреватель выключен'
        },
        suffix: {
            'default': ''
        }
    },
    {
        id: 23,
        name: 'backdoor',
        type: 'command',
        response: {
            'default': 'Tailgate has been opened',
            'en-us': 'Tailgate has been opened',
            'ru-RU': 'Дверь багажника открыта'
        },
        suffix: {
            'default': ''
        }
    },
    {
        id: 18,
        name: 'light',
        type: 'command',
        response: {
            'default': 'Lights is on',
            'en-us': 'Lights is on',
            'ru-RU': 'Подстветка включена'
        },
        suffix: {
            'default': ''
        }
    },
    {
        id: 0xFF,
        name: 'check',
        type: 'command',
        response: {
            'default': 'Command CHECK',
            'en-us': 'Command CHECK',
            'ru-RU': 'Проверка систем'
        },
        suffix: {
            'default': ''
        }
    }
];
