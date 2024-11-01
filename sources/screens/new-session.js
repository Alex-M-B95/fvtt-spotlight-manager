import { log, Constants } from '../utils.js'
import { Session } from '../models/session.js'
import { SessionSpotlightWindow } from './session-spotlight.js'

export class NewSessionWindow extends Application {
    static open() {
        const window = new NewSessionWindow()
        window.render(true)
    }
    
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            id: "new-session-window",
            title: game.i18n.localize('alexs-spotlight-manager.new-session'),
            template: `modules/${Constants.moduleName}/templates/windows/new-session.html`,
            width: 'auto',
            height: 'auto',
            popOut: true,
        });
    }

    getData() {
        return {
            players: game.users
                .filter(user => !user.isGM)
                .map(user => ({
                    id: user.id,
                    name: this._getDisplayName(user),
                    color: user.color.css
                }))
        };
    }

    _getDisplayName(user) {
        const displayNamePart = [user.name];
        if ( user.pronouns ) displayNamePart.push(`(${user.pronouns})`);
        if ( user.charname ) displayNamePart.push(`[${user.charname}]`);
        return displayNamePart.join(" ");
    }

    activateListeners(html) {
        super.activateListeners(html);
        html.find('#start-session-button').click(this._onStartSession.bind(this));
    }

    _onStartSession(event) {
        const form = this.element.find("#players-form");
        const selectedPlayers = form
            .find('input[type="checkbox"]:checked')
            .map((_, checkbox) => checkbox.dataset.playerId)
            .get();
        
        log("Select player for session:", selectedPlayers);

        for (var user of game.users) {
            if (user.ifGM) { continue }
            user.setFlag(Constants.moduleName, 'isEnabled', selectedPlayers.includes(user.id))
        }

        Session.startSession(selectedPlayers)
        this.close()
        setTimeout(SessionSpotlightWindow.open, 1000)
    }
}
