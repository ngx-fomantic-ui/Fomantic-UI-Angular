import {
    AfterContentChecked,
    Component,
    ContentChildren,
    Directive,
    EventEmitter,
    Input,
    Output,
    QueryList,
    TemplateRef
} from '@angular/core';

import {FuiAccordionConfig} from './accordion-config';
import {isString} from 'util';

let nextId = 0;

export interface FuiPanelHeaderContext {
    opened: boolean;
}

@Directive({selector: 'ng-template[fuiAccordionTitle]'})
export class FuiAccordionTitle {
    constructor(public templateRef: TemplateRef<any>) {
    }
}

@Directive({selector: 'ng-template[fuiAccordionContent]'})
export class FuiAccordionContent {
    constructor(public templateRef: TemplateRef<any>) {
    }
}


@Directive({selector: 'fui-accordion-panel'})
export class FuiAccordionPanel implements AfterContentChecked {
    @Input() disabled = false;
    @Input() id = `fui-accordion-panel-${nextId++}`;

    titleTpl: FuiAccordionTitle | null;
    contentTpl: FuiAccordionContent | null;

    @ContentChildren(FuiAccordionTitle, {descendants: false}) titleTpls: QueryList<FuiAccordionTitle>;
    @ContentChildren(FuiAccordionContent, {descendants: false}) contentTpls: QueryList<FuiAccordionContent>;

    isOpen = false;

    ngAfterContentChecked() {
        this.titleTpl = this.titleTpls.first;
        this.contentTpl = this.contentTpls.first;
    }
}

export interface FuiPanelChangeEvent {
    panelId: string;
    nextState: boolean;
    preventDefault: () => void;
}

@Component({
    selector: 'fui-accordion',
    exportAs: 'fuiAccordion',
    host: {class: 'ui accordion', role: 'tablist', '[attr.aria-multiselectable]': '!closeOtherPanels'},
    styles: [`
        /* Fix for general styling issues */
        :host {
            display: block;
        }

        /* Fix for styled border issue */
        :host.styled fui-accordion-panel:first-child .title {
            border-top: none
        }
    `],
    template: `
        <ng-template ngFor let-panel [ngForOf]="panels">
            <div role="tab" id="{{panel.id}}-header" class="title" (click)="toggle(panel.id)" [class.active]="panel.isOpen">
                <i class="dropdown icon"></i>
                <ng-template [ngTemplateOutlet]="panel.titleTpl?.templateRef"
                             [ngTemplateOutletContext]="{$implicit: panel, opened: panel.isOpen}"></ng-template>
            </div>
            <div role="tabpanel" id="{{panel.id}}" class="content" [class.active]="panel.isOpen" *ngIf="!destroyOnHide || panel.isOpen"
                 [attr.aria-labelledby]="panel.id + '-header'">
                <ng-template [ngTemplateOutlet]="panel.contentTpl?.templateRef"></ng-template>
            </div>
        </ng-template>
    `
})
export class FuiAccordion implements AfterContentChecked {
    @ContentChildren(FuiAccordionPanel) panels: QueryList<FuiAccordionPanel>;

    @Input() activeIds: string | string[] = [];
    @Input('closeOthers') closeOtherPanels: boolean;
    @Input() destroyOnHide = true;

    @Output() panelChange = new EventEmitter<FuiPanelChangeEvent>();

    constructor(config: FuiAccordionConfig) {
        this.closeOtherPanels = config.closeOthers;
    }

    isExpanded(panelId: string): boolean {
        return this.activeIds.indexOf(panelId) > -1;
    }

    expand(panelId: string): void {
        this._changeOpenState(this._findPanelById(panelId), true);
    }

    expandAll(): void {
        if (this.closeOtherPanels) {
            if (this.activeIds.length === 0 && this.panels.length) {
                this._changeOpenState(this.panels.first, true);
            }
        } else {
            this.panels.forEach(panel => this._changeOpenState(panel, true));
        }
    }

    collapse(panelId: string) {
        this._changeOpenState(this._findPanelById(panelId), false);
    }

    collapseAll() {
        this.panels.forEach((panel) => {
            this._changeOpenState(panel, false);
        });
    }

    toggle(panelId: string) {
        const panel = this._findPanelById(panelId);
        if (panel) {
            this._changeOpenState(panel, !panel.isOpen);
        }
    }

    ngAfterContentChecked() {
        if (isString(this.activeIds)) {
            this.activeIds = (this.activeIds as string).split(/\s*,\s*/);
        }

        // update panels open states
        this.panels.forEach(panel => panel.isOpen = !panel.disabled && this.activeIds.indexOf(panel.id) > -1);

        // closeOthers updates
        if (this.activeIds.length > 1 && this.closeOtherPanels) {
            this._closeOthers(this.activeIds[0]);
            this._updateActiveIds();
        }
    }

    private _changeOpenState(panel: FuiAccordionPanel, nextState: boolean) {
        if (panel && !panel.disabled && panel.isOpen !== nextState) {
            let defaultPrevented = false;

            this.panelChange.emit(
                {
                    panelId: panel.id, nextState, preventDefault: () => {
                        defaultPrevented = true;
                    }
                });

            if (!defaultPrevented) {
                panel.isOpen = nextState;

                if (nextState && this.closeOtherPanels) {
                    this._closeOthers(panel.id);
                }
                this._updateActiveIds();
            }
        }
    }

    private _closeOthers(panelId: string) {
        this.panels.forEach(panel => {
            if (panel.id !== panelId) {
                panel.isOpen = false;
            }
        });
    }

    private _findPanelById(panelId: string): FuiAccordionPanel | null {
        return this.panels.find(p => p.id === panelId);
    }

    private _updateActiveIds() {
        this.activeIds = this.panels.filter(panel => panel.isOpen && !panel.disabled).map(panel => panel.id);
    }
}
