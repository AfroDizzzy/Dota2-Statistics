import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  title = 'DotA 2 Statistics';
  constructor() { }
  isCollapsed = true;

  ngOnInit(): void {
  }

}
