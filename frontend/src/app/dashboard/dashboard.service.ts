import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, switchMap, shareReplay } from 'rxjs';

export interface DashboardDto {
  kpis:{
    revenue:number;
    orders:number;
    customers:number;
    averageOrderValue:number;
  };
  revenueTrend:{date:string;revenue:number}[];
  ordersByChannel:{channel:string;orders:number}[];
  customerMix:{segment:string;customers:number}[];
  transactions:{
    id:number;
    date:string;
    channel:string;
    category:string;
    amount:number;
    status:string;
  }[];
}

@Injectable({providedIn:'root'})
export class DashboardService {
  private readonly rangeSubject =
    new BehaviorSubject<{from:string;to:string}>({
      from:'2026-01-01',
      to:'2026-01-31'
    });

  readonly range$=this.rangeSubject.asObservable();

  readonly dashboard$:Observable<DashboardDto>=this.range$.pipe(
    switchMap(range =>
      this.http.get<DashboardDto>('http://localhost:3000/api/dashboard',{params:range})
    ),
    shareReplay({bufferSize:1,refCount:true})
  );

  constructor(private http:HttpClient){}

  setRange(from:string,to:string){
    this.rangeSubject.next({from,to});
  }
}
