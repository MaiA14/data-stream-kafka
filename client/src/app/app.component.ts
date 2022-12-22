import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { HttpService } from 'src/services/http.service';
import { SocketService } from 'src/services/socket.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { REQUESTS_URLS } from './env';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'app';

  assignments$: BehaviorSubject<Array<any>>;
  dataSource: MatTableDataSource<any>;
  data: Array<any>;
  pageSize: number = 10;
  totalSize: number = 0;
  currentPage: number = 0;
  pageSizeOptions = [5, 10, 25, 100];

  displayedColumns: string[] = [
    'sendAt', 'isActive', 'hasIntrests', 'email', 'phone', 'address',
    'gender', 'country', 'tags', 'content'
  ];

  stream: any;

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;

  constructor(private http: HttpService, private socketService: SocketService) {
    this.assignments$ = new BehaviorSubject<Array<any>>([]);
    this.assignments$.subscribe((data: any[]) => {
      this.dataSource = new MatTableDataSource(data);
      this.data = data;
      this.totalSize = data.length;
    })
    this.dataSource = new MatTableDataSource<any>([]);
    this.data = [];
    this.stream = {
      filePath: 'gs://public-assignments',
      fileName: 'generated.json',
      brokerTopic: 'assignments'
    };
  }


  ngOnInit() {
    this.socketService
      .connect()
      .subscribe(data => {
        this.assignments$.next([...this.assignments$.value, data]);
      });

    try {
      this.http.post(REQUESTS_URLS.READ_NOTIFICATIONS, this.stream)
    } catch (error) {
      console.log(error);
    }
  }

  // handle sort & pagination
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }


  ngOnDestroy() {
    this.socketService.disconnect();
  }

  // handle paging calculation
  iterator() {
    const end = (this.currentPage + 1) * this.pageSize;
    const start = this.currentPage * this.pageSize;
    const part = this.data.slice(start, end);
    this.dataSource = new MatTableDataSource(part);
  }

  // handle paging
  handlePage(event$: any) {
    this.currentPage = event$.pageIndex;
    this.pageSize = event$.pageSize;
    this.iterator();
  }

  // handle sort
  sortData(data: any) {
    data.sort = this.sort;
  }

  // handle filter
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}