module.exports.actions = [
    {
        id: -1,
        name: "out_temp",
        type: "info",
        response: {
            "default": "Temperature outside is",
            "en-us": "Temperature outside is",
            "ru": "Температура снаружи"
        },
        suffix: {
            "default": "degrees",
            "en-us": "degrees",
            "ru": "градусов"
        }
    },
    {
        id: -2,
        name: "fuel",
        type: "info",
        response: {
            "default": "Fuel level is",
            "en-us": "Fuel level is",
            "ru": "Остаток топлива"
        },
        suffix: {
            "default": "liters",
            "en-us": "liters",
            "ru": "литров"
        }
    },
    {
        id: 4,
        name: "start",
        type: "command",
        response: {
            "default": "Engine has been started",
            "en-us": "Engine has been started",
            "ru": "Машина заведена"
        },
        suffix: {
            "default": "RPM",
            "en-us": "RPM",
            "ru": "оборотов"
        }
    },
    {
        id: 8,
        name: "stop",
        type: "command",
        response: {
            "default": "Engine has been stopped",
            "en-us": "Engine has been stopped",
            "ru": "Двигатель остановлен"
        },
        suffix: {
            "default": ""
        }
    },
    {
        id: 2,
        name: "open",
        type: "command",
        response: {
            "default": "Car has been opened",
            "en-us": "Car has been opened",
            "ru": "Машина открыта"
        },
        suffix: {
            "default": ""
        }
    },
    {
        id: 1,
        name: "close",
        type: "command",
        response: {
            "default": "Car has been closed",
            "en-us": "Car has been closed",
            "ru": "Машина закрыта"
        },
        suffix: {
            "default": ""
        }
    },
    {
        id: 15,
        name: "webasta start",
        type: "command",
        response: {
            "default": "Webasta has been started",
            "en-us": "Webasta has been started",
            "ru": "Подогреватель включен"
        },
        suffix: {
            "default": ""
        }
    },
    {
        id: 16,
        name: "webasta stop",
        type: "command",
        response: {
            "default": "Webasta has been stopped",
            "en-us": "Webasta has been stopped",
            "ru": "Подогреватель выключен"
        },
        suffix: {
            "default": ""
        }
    },
    {
        id: 23,
        name: "backdoor",
        type: "command",
        response: {
            "default": "Tailgate has been opened",
            "en-us": "Tailgate has been opened",
            "ru": "Дверь багажника открыта"
        },
        suffix: {
            "default": ""
        }
    },
    {
        id: 18,
        name: "light",
        type: "command",
        response: {
            "default": "Lights is on",
            "en-us": "Lights is on",
            "ru": "Подстветка включена"
        },
        suffix: {
            "default": ""
        }
    },
    {
        id: 0xFF,
        name: "check",
        type: "command",
        response: {
            "default": "Command CHECK",
            "en-us": "Command CHECK",
            "ru": "Проверка систем"
        },
        suffix: {
            "default": ""
        }
    }
];