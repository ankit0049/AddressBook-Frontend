import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AddressBookService } from './services/address-book.service';
import { Address } from './models/address.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  addressBookService = inject(AddressBookService);
  isFormVisible = false;
  addresses: Address[] = [];
  currentAddress: Address = this.createEmptyAddress();
  zipCodesForSelectedState: string[] = [];

  states = ['Madhya Pradesh', 'Andhra Pradesh', 'Delhi', 'Maharashtra', 'Tamil Nadu', 'Uttar Pradesh'];
  cities = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Ahmedabad', 'Chennai', 'Kolkata', 'Surat', 'Pune', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal', 'Visakhapatnam', 'Pimpri-Chinchwad', 'Patna', 'Vadodara',
    'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik', 'Ranchi', 'Meerut', 'Guwahati', 'Rajkot', 'Chandigarh', 'Mysore',
    'Bareilly', 'Aligarh', 'Jodhpur', 'Jabalpur', 'Coimbatore', 'Gwalior', 'Vijayawada', 'Madurai', 'Raipur', 'Kota',
    'Bhubaneswar', 'Varanasi', 'Prayagraj'];

  zipCodes: { [key: string]: string[] } = {
    'Madhya Pradesh': ['452001', '462001', '474001', '482001'],
    'Andhra Pradesh': ['500001'],
    'Delhi': ['110001'],
    'Maharashtra': ['400001'],
    'Tamil Nadu': ['600001'],
    'Uttar Pradesh': ['226001'],
  };

  constructor() {}

  ngOnInit(): void {
    this.fetchAddresses();
  }

  fetchAddresses() {
    this.addressBookService.getAddresses().subscribe({
      next: (data) => (this.addresses = data),
      error: (err) => console.error('Error fetching addresses:', err),
    });
  }

  addAddress() {
    this.isFormVisible = true;
    this.currentAddress = this.createEmptyAddress();
    this.zipCodesForSelectedState = [];
  }

  editAddress(address: Address) {
    this.isFormVisible = true;
    this.currentAddress = { ...address };
    this.updateZipCodes();
  }

 saveAddress() {
  if (this.currentAddress.id) {
    this.addressBookService.updateAddress(this.currentAddress.id, this.currentAddress).subscribe({
      next: () => {
        this.isFormVisible = false;
        this.fetchAddresses();
        alert('Address Edited successfully!');
      },
      error: (err) => {
        console.error('Update failed:', err);
        alert(err.error.message || 'Validation failed. Please check your input.');
      }
    });
  } else {
    this.addressBookService.addAddress(this.currentAddress).subscribe({
      next: () => {
        this.isFormVisible = false;
        this.fetchAddresses();
        alert('Address Added successfully!');
      },
      error: (err) => {
        console.error('Add failed:', err);
        alert(err.error.message || 'Validation failed. Please check your input.');
      }
    });
  }
}

deleteAddress(id: number) {
  this.addressBookService.deleteAddress(id).subscribe({
    next: (response) => {
      console.log('Delete response:', response); // Debugging log
      this.addresses = this.addresses.filter(address => address.id !== id); // Remove from UI
      alert(response); // Show backend response in alert
    },
    error: (err) => {
      console.error('Delete failed:', err);
      alert('Failed to delete address. Please try again.');
    }
  });
}


  updateZipCodes() {
    this.zipCodesForSelectedState = this.zipCodes[this.currentAddress.state] || [];
    this.currentAddress.zipCode = '';
  }

  createEmptyAddress(): Address {
    return { id: undefined, fullName: '', phoneNumber: '', address: '', city: '', state: '', zipCode: '' };
  }
}
