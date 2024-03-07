import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html'
})
export class SearchComponent implements OnInit {

  @Input() searchQuery: string = '';
  autocompleteOptions: any[] = [];
  allOptions: any[] = [];

  constructor(private router: Router, public dialogRef: MatDialogRef<SearchComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    if (data) {
      this.allOptions = data.allOptions;
      this.searchQuery = data.searchQuery;
    }
  }

  ngOnInit(): void {
    this.getFromLocalstorage()
  }
  onSearchInput() {
    if (this.searchQuery.length > 0) {
      this.autocompleteOptions = this.allOptions.filter((option) =>
        option.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      )
    }
    else {
      this.getFromLocalstorage()
    }
  }

  selectOption(option: any) {
    this.searchQuery = option.name;
    this.router.navigateByUrl(option.value);
    this.searchQuery = "";
    // Get the existing stored search results
    const storedSearchResults = JSON.parse(localStorage.getItem('searchResults') || '[]');
    // Remove the selected option if it already exists in the list
    const updatedResults = storedSearchResults.filter((result: any) => result.name !== option.name);

    if (updatedResults.length >= 5) {
      // Remove the last item (oldest) from the list
      updatedResults.pop();
    }

    // Add the newly selected item to the beginning of the list
    updatedResults.unshift(option);
    // Save the updated list back to local storage
    localStorage.setItem('searchResults', JSON.stringify(updatedResults));
    this.dialogRef.close();
  }
  
  Close() {
    this.dialogRef.close()
  }

  getFromLocalstorage() {
    const storedSearchResults = JSON.parse(localStorage.getItem('searchResults') || '[]');
    this.autocompleteOptions = storedSearchResults;
  }

}
