import { log, Constants } from '../utils.js'
import { Session } from '../models/session.js'

export class SessionSpotlightWindow extends Application {
    static open() {
        const window = new SessionSpotlightWindow()
        window.render(true)
    }
    
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            id: "session-spotlight-window",
            title: game.i18n.localize('alexs-spotlight-manager.session-spotlight'),
            template: `modules/${Constants.moduleName}/templates/windows/session-spotlight.html`,
            width: 'auto',
            height: 'auto',
            resizable: true
        });
    }

    getData() {
        const players = game.users
            .filter(user => user.flags[Constants.moduleName].isEnabled)
            .map(user => {
                return {
                    id: user.id,
                    name: user.name,
                    portrait: user.avatar,
                    statusColor: user.active ? "green" : "#666666",
                    spotlight: user.spotlight ?? 0,
                    active: user.isActive ? 'active' : '',
                };
            });

        // TOOD: Implement new way to count time (for statistic feature)
        return {
//            statistic: {
//                average: "00:15",
//                maxinum: "00:48"
//            },
            players: players
        };
    }

    activateListeners(html) {
        super.activateListeners(html);
        html.find(".player-toggle").click(this.#onTapPlayer.bind(this))
        html.find('#finish-session-button').click(this.#onFinishSession.bind(this))
        
        Hooks.on(Constants.updateTriggerHookName, () => {
            this.render(false)
        })
    }
    
    #onFinishSession(event) {
        Session.stopSession()
        this.close()
    }
    
    #onTapPlayer(event) {
        let id = event.target.getAttribute('data-player-id')
        Session.togglePlayer(id)
    }
}
