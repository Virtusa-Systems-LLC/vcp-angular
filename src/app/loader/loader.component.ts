import { Component, OnInit, OnDestroy, ChangeDetectorRef, AfterContentChecked } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoaderService } from '../_services/loader.service';
import { LoaderState } from './loader';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit, OnDestroy, AfterContentChecked {
  show = false;
  private subscription: Subscription;
  constructor(private loaderService: LoaderService, private spinner: NgxSpinnerService, private cd: ChangeDetectorRef) { }
  ngOnInit() {
    this.subscription = this.loaderService.loaderState
      .subscribe((state: LoaderState) => {
        this.show = state.show;
        if (state.show) {
          this.spinner.show();
        } else {
          this.spinner.hide();
        }
        this.cd.detectChanges();
      });
  }
  ngAfterContentChecked(): void {
    this.cd.detectChanges();
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
