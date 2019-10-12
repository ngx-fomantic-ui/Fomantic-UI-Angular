import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {FuiAccordion, FuiAccordionContent, FuiAccordionPanel, FuiAccordionTitle} from './accordion';

export {
    FuiAccordion,
    FuiAccordionPanel,
    FuiAccordionTitle,
    FuiAccordionContent,
    FuiPanelChangeEvent,
    FuiPanelHeaderContext,
} from './accordion';
export {FuiAccordionConfig} from './accordion-config';

@NgModule({
    declarations: [FuiAccordion, FuiAccordionPanel, FuiAccordionTitle, FuiAccordionContent],
    exports: [FuiAccordion, FuiAccordionPanel, FuiAccordionTitle, FuiAccordionContent],
    imports: [CommonModule]
})
export class FuiAccordionModule {
}
