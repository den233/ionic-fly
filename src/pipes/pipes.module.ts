import { NgModule } from '@angular/core';
import { DatePipe } from './date/date';
import { DateSplitPipe } from './date-split/date-split';
import { DateTransformPipe } from './date-transform/date-transform';

@NgModule({
    declarations: [
        DatePipe,
        DateSplitPipe,
        DateTransformPipe
    ],
    imports: [

    ],
    exports: [
        DatePipe,
        DateSplitPipe,
        DateTransformPipe
    ]
})
export class PipesModule { }
