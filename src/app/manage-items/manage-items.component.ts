import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface PeriodicElement {
  name: string;
  position: number;
  category: string;
  quantity: number;
}

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

export interface Category {
  _id: string;
  title: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', category: 'grocery', quantity: 6 },
  { position: 2, name: 'Helium', category: 'grocery', quantity: 6 },
  { position: 3, name: 'Lithium', category: 'grocery', quantity: 6 },
  { position: 4, name: 'Beryllium', category: 'grocery', quantity: 6 },
  { position: 5, name: 'Boron', category: 'grocery', quantity: 6 },
  { position: 6, name: 'Carbon', category: 'grocery', quantity: 6 },
  { position: 7, name: 'Nitrogen', category: 'grocery', quantity: 6 },
  { position: 8, name: 'Oxygen', category: 'grocery', quantity: 6 },
  { position: 9, name: 'Fluorine', category: 'grocery', quantity: 6 },
  { position: 10, name: 'Neon', category: 'grocery', quantity: 6 },
];

@Component({
  selector: 'app-manage-items',
  templateUrl: './manage-items.component.html',
  styleUrls: ['./manage-items.component.scss'],
})
@Injectable()
export class ManageItemsComponent implements OnInit {
  //   items = ELEMENT_DATA;

  newItem = {
    title: new FormControl('', [Validators.required, Validators.minLength(4)]),
    price: new FormControl('', Validators.required),
    quantity: new FormControl('', [Validators.required]),
    category: new FormControl('', [Validators.required]),
  };

  updatedItem = {
    title: new FormControl('', [Validators.required, Validators.minLength(4)]),
    price: new FormControl('', Validators.required),
    quantity: new FormControl('', [Validators.required]),
    category: new FormControl('', [Validators.required]),
  };

  added = false;
  updated = false;
  deleted = false;

  items: Item[] = [];
  categories: Category[] = [];

  selectedItem: any = {};

  addItem() {
    this.http
      .post('http://localhost:5000/api/items/create', {
        title: this.newItem.title.value,
        price: this.newItem.price.value,
        quantity: this.newItem.quantity.value,
        category: this.newItem.category.value,
      })
      .subscribe((data: any) => {
        if (data.status === 'success') {
          this.added = true;
          this.items.push({
            ...data.item,
            category: [
              this.categories.find(
                (cat) => cat._id === this.newItem.category.value
              ),
            ],
          });
        }
      });
  }

  editItem() {
    this.http
      .patch(`http://localhost:5000/api/items/edit/${this.selectedItem._id}`, {
        title: this.updatedItem.title.value,
        price: this.updatedItem.price.value,
        quantity: this.updatedItem.quantity.value,
        category: this.updatedItem.category.value,
      })
      .subscribe((data: any) => {
        if (data.status === 'success') {
          this.updated = true;
          this.getItems();
        }
      });
    }

  deleteItem() {
    this.http
      .delete(`http://localhost:5000/api/items/${this.selectedItem._id}`)
      .subscribe((data: any) => {
        if (data.status === 'success') {
          this.items = this.items.filter(
            (item) => item._id !== this.selectedItem._id
          );
          this.deleted = true;
        }
      });
  }

  getItems() {
    this.http.get('http://localhost:5000/api/items/').subscribe((data: any) => {
      if (data.status === 'success') {
        this.items = data.items;
        console.log(data.items);
      }
    });
  }

  getCategories() {
    this.http
      .get('http://localhost:5000/api/categories/')
      .subscribe((data: any) => {
        if (data.status === 'success') {
          this.categories = data.categories;
        }
      });
  }

  closeModal() {
    this.added = false;
    this.updated = false;
    this.newItem = {
      title: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
      ]),
      price: new FormControl('', Validators.required),
      quantity: new FormControl('', [Validators.required]),
      category: new FormControl('', [Validators.required]),
    };
  }

  closeEditModal() {
    this.updated = false;
  }

  closeDeleteModal() {
    this.deleted = false;
  }

  toggle(item: Item) {
    this.selectedItem = item;
  }

  toggleEdit(item: Item) {
    this.selectedItem = item;
    this.updatedItem = {
      title: new FormControl(item.title, [
        Validators.required,
        Validators.minLength(4),
      ]),
      price: new FormControl(item.price, Validators.required),
      quantity: new FormControl(item.quantity, [Validators.required]),
      category: new FormControl(item.category, [Validators.required]),
    };
  }

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getItems();
    this.getCategories();
  }
}
