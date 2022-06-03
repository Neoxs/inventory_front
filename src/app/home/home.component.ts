import { Component, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Item {
  _id: string;
  title: string;
  quantity: number;
  price: number;
  category: [
    {
      title: string;
    }
  ];
}

export interface Statistic {
  totalItems: number;
  totalCategories: number;
  todayItems: number;
  weekItems: number;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
@Injectable()
export class HomeComponent implements OnInit {
  items: Item[] = [];
  statistics: Statistic = {
    totalItems: 0,
    totalCategories: 0,
    todayItems: 0,
    weekItems: 0,
  };

  getItems() {
    this.http.get('http://localhost:5000/api/items/').subscribe((data: any) => {
      if (data.status === 'success') {
        this.items = data.items;
      }
    });
  }

  getData() {
    this.http
      .get('http://localhost:5000/api/statistics/')
      .subscribe((data: any) => {
        if (data.status === 'success') {
          this.statistics = data.statistics;
          console.log(data.statistics);
        }
      });
  }

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getItems();
    this.getData();
  }
}
