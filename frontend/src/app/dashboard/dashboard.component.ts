import {
  ChangeDetectionStrategy,
  Component,
  AfterViewInit,
  ElementRef,
  ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { Chart, registerables } from 'chart.js';
import { DashboardService, DashboardDto } from './dashboard.service';

Chart.register(...registerables);

@Component({
  standalone:true,
  selector:'app-dashboard',
  imports:[
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatInputModule
  ],
  template:`
    <div class="toolbar">
      <div>
        <h1>DataLens</h1>
        <p>Analytics dashboard powered by an Angular + Node.js BFF.</p>
      </div>
      <span class="spacer"></span>
      <mat-form-field>
        <mat-label>From</mat-label>
        <input matInput [matDatepicker]="fromPicker" [formControl]="from">
        <mat-datepicker-toggle matSuffix [for]="fromPicker"/>
        <mat-datepicker #fromPicker/>
      </mat-form-field>
      <mat-form-field>
        <mat-label>To</mat-label>
        <input matInput [matDatepicker]="toPicker" [formControl]="to">
        <mat-datepicker-toggle matSuffix [for]="toPicker"/>
        <mat-datepicker #toPicker/>
      </mat-form-field>
      <button mat-raised-button color="primary" (click)="applyRange()">Apply</button>
    </div>

    <ng-container *ngIf="dashboard$ | async as d">
      <div class="dashboard-grid">
        <mat-card class="kpi"><small>Revenue</small><h2>{{d.kpis.revenue | currency:'INR'}}</h2></mat-card>
        <mat-card class="kpi"><small>Orders</small><h2>{{d.kpis.orders | number}}</h2></mat-card>
        <mat-card class="kpi"><small>Customers</small><h2>{{d.kpis.customers | number}}</h2></mat-card>
        <mat-card class="kpi"><small>Average order</small><h2>{{d.kpis.averageOrderValue | currency:'INR'}}</h2></mat-card>

        <mat-card class="chart">
          <h3>Revenue trend</h3>
          <canvas #lineCanvas></canvas>
        </mat-card>

        <mat-card class="chart">
          <h3>Orders by channel</h3>
          <canvas #barCanvas></canvas>
        </mat-card>

        <mat-card class="chart">
          <h3>Customer mix</h3>
          <canvas #pieCanvas></canvas>
        </mat-card>

        <mat-card class="table-card">
          <h3>Transactions</h3>
          <mat-form-field>
            <mat-label>Filter</mat-label>
            <input matInput (input)="filter($any($event.target).value)" placeholder="Search channel/category/status">
          </mat-form-field>

          <table mat-table [dataSource]="dataSource" matSort>
            <ng-container matColumnDef="date">
              <th mat-header-cell *matHeaderCellDef>Date</th>
              <td mat-cell *matCellDef="let r">{{r.date}}</td>
            </ng-container>
            <ng-container matColumnDef="channel">
              <th mat-header-cell *matHeaderCellDef>Channel</th>
              <td mat-cell *matCellDef="let r">{{r.channel}}</td>
            </ng-container>
            <ng-container matColumnDef="category">
              <th mat-header-cell *matHeaderCellDef>Category</th>
              <td mat-cell *matCellDef="let r">{{r.category}}</td>
            </ng-container>
            <ng-container matColumnDef="amount">
              <th mat-header-cell *matHeaderCellDef>Amount</th>
              <td mat-cell *matCellDef="let r">{{r.amount | currency:'INR'}}</td>
            </ng-container>
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Status</th>
              <td mat-cell *matCellDef="let r">{{r.status}}</td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="columns"></tr>
            <tr mat-row *matRowDef="let row;columns:columns"></tr>
          </table>
          <mat-paginator [pageSize]="5" [pageSizeOptions]="[5,10,25]"/>
        </mat-card>
      </div>
    </ng-container>
  `,
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements AfterViewInit {
  from=new FormControl(new Date('2026-01-01'));
  to=new FormControl(new Date('2026-01-31'));
  dashboard$=this.service.dashboard$;
  dataSource=new MatTableDataSource<any>([]);
  columns=['date','channel','category','amount','status'];

  @ViewChild('lineCanvas') lineCanvas?:ElementRef<HTMLCanvasElement>;
  @ViewChild('barCanvas') barCanvas?:ElementRef<HTMLCanvasElement>;
  @ViewChild('pieCanvas') pieCanvas?:ElementRef<HTMLCanvasElement>;
  @ViewChild(MatPaginator) paginator?:MatPaginator;

  constructor(private service:DashboardService){}

  ngAfterViewInit(){
    this.dashboard$.subscribe(d=>{
      this.dataSource.data=d.transactions;
      if(this.paginator)this.dataSource.paginator=this.paginator;

      queueMicrotask(()=>this.renderCharts(d));
    });
  }

  applyRange(){
    const f=this.from.value;
    const t=this.to.value;
    if(!f||!t)return;
    this.service.setRange(
      f.toISOString().slice(0,10),
      t.toISOString().slice(0,10)
    );
  }

  filter(value:string){
    this.dataSource.filter=value.trim().toLowerCase();
  }

  private renderCharts(d:DashboardDto){
    if(this.lineCanvas){
      new Chart(this.lineCanvas.nativeElement,{
        type:'line',
        data:{
          labels:d.revenueTrend.map(x=>x.date),
          datasets:[{label:'Revenue',data:d.revenueTrend.map(x=>x.revenue),tension:.3}]
        },
        options:{responsive:true,maintainAspectRatio:false}
      });
    }

    if(this.barCanvas){
      new Chart(this.barCanvas.nativeElement,{
        type:'bar',
        data:{
          labels:d.ordersByChannel.map(x=>x.channel),
          datasets:[{label:'Orders',data:d.ordersByChannel.map(x=>x.orders)}]
        },
        options:{responsive:true,maintainAspectRatio:false}
      });
    }

    if(this.pieCanvas){
      new Chart(this.pieCanvas.nativeElement,{
        type:'doughnut',
        data:{
          labels:d.customerMix.map(x=>x.segment),
          datasets:[{data:d.customerMix.map(x=>x.customers)}]
        },
        options:{responsive:true,maintainAspectRatio:false}
      });
    }
  }
}
