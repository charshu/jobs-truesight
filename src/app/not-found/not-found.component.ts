import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

@Component({
    templateUrl: 'not-found.component.html',
    styleUrls: ['./not-found.component.scss']
})

export class NotFoundComponent implements AfterViewInit {

    @ViewChild('box') elementView: ElementRef;
    private viewHeight: number;
    public ngAfterViewInit() {
        this.viewHeight = this.elementView.nativeElement.offsetHeight / 4;
        // console.log(this.elementView.nativeElement);
    }
};
