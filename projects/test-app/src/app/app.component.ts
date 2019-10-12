import {Component} from '@angular/core';
import {FuiPanelChangeEvent} from '../../../ngx-fomantic-ui/src/accordion/accordion';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'test-app';

    public callback(event: FuiPanelChangeEvent) {
        console.log('Fired panel change event:', event.panelId, event.nextState);
    }
}
