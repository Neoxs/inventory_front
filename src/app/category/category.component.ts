import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface PeriodicElement {
  title: string;
  position: number;
  nbItems: number;
}

export interface Category {
  _id: string;
  title: string;
  nbItems: number;
}

export interface Data {
  status: string;
  category: Object;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, title: 'Hydrogen', nbItems: 6 },
  { position: 2, title: 'Helium', nbItems: 6 },
  { position: 3, title: 'Lithium', nbItems: 6 },
  { position: 4, title: 'Beryllium', nbItems: 6 },
  { position: 5, title: 'Boron', nbItems: 6 },
  { position: 6, title: 'Carbon', nbItems: 6 },
];

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
@Injectable()
export class CategoryComponent implements OnInit {
  items = ELEMENT_DATA;

  newCategory = {
    title: new FormControl('', [Validators.required, Validators.minLength(4)]),
  };

  updatedCategory = {
    title: new FormControl('', [Validators.required, Validators.minLength(4)]),
  };

  added = false;
  updated = false;
  deleted = false;
  categories: Category[] = [];
  selectedCategory: any = {};

  getCategories() {
    this.http
      .get('http://localhost:5000/api/categories/')
      .subscribe((data: any) => {
        if (data.status === 'success') {
          this.categories = data.categories;
        }
      });
  }

  createCategory() {
    this.http
      .post('http://localhost:5000/api/categories/create', {
        title: this.newCategory.title.value,
      })
      .subscribe((data: any) => {
        if (data.status === 'success') {
          this.added = true;
          this.categories.push(data.category);
        }
      });
  }

  editCategory() {
    this.http
      .patch(
        `http://localhost:5000/api/categories/edit/${this.selectedCategory._id}`,
        {
          title: this.updatedCategory.title.value,
        }
      )
      .subscribe((data: any) => {
        if (data.status === 'success') {
          this.updated = true;
          this.getCategories();
        }
      });
  }

  deleteCategory() {
    this.http
      .delete(
        `http://localhost:5000/api/categories/${this.selectedCategory._id}`
      )
      .subscribe((data: any) => {
        if (data.status === 'success') {
          this.categories = this.categories.filter(
            (category) => category._id !== this.selectedCategory._id
          );
          this.deleted = true;
        }
      });
  }

  closeModal() {
    this.added = false;
    this.newCategory.title = new FormControl('', [
      Validators.required,
      Validators.minLength(4),
    ]);
  }

  closeDeleteModal() {
    this.deleted = false;
  }

  closeEditModal() {
    this.updated = false;
  }

  toggle(category: Category) {
    this.selectedCategory = category;
  }

  toggleEdit(category: Category) {
    this.selectedCategory = category;
    this.updatedCategory = {
      title: new FormControl(category.title, [
        Validators.required,
        Validators.minLength(4),
      ]),
    };
  }

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getCategories();
  }
}
