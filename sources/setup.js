import { log, Constants } from './utils.js'
import { NewSessionWindow } from './screens/new-session.js'
import { SessionSpotlightWindow } from './screens/session-spotlight.js'
import { Session } from './models/session.js'

export class Setup {
    // --- Public methods --- //
    static onInit() {
        log('on init')
//        Session.onInit()
        Setup.#registerKeyboardShortcuts()
    }

    static onReady() {
        log('on ready')
        if (!game.user.isGM) { return }
        Session.onInit()
        Session.onReady()
    }

    static onGetSceneControlButtons(controls) {
        if (!game.user.isGM) { return }

        log('on get scene control buttons')

        let tokenControl = controls.find(c => c.name === "token")
        if (tokenControl) {
            tokenControl.tools.push({
                name: "spotlight-timer",
                title: "Spotlight timer",
                icon: "fas fa-alarm-clock",
                onClick: Setup.#openSpotlightWindow,
                button: true,
            })
        }
    }

    static onChangeSetting(scope, key, newValue, oldValue) {
        if (!game.user.isGM) { return }

        log(`Setting ${key} changed from ${oldValue} to ${newValue}`);
    }


    // --- Private methods --- //
    static #openSpotlightWindow() {
        if (!game.user.isGM) { return }

        if (Session.isRunning) {
            SessionSpotlightWindow.open()
        } else {
            NewSessionWindow.open()
        }
    }

    static #registerKeyboardShortcuts() {
        game.keybindings.register(
            Constants.moduleName,
            'open-spotlight-window-shortcut',
            {
                name: "Open Spotlight Window",
                hint: "Open Spotlight Window",
                editable: [
                    { key: "KeyS", modifiers: ['Shift'] }
                ],
                onDown: Setup.#openSpotlightWindow,
                restricted: true
            }
        )
    }
}
