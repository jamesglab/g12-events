import { Component, OnInit, Input, SimpleChanges, HostListener } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { AssistantsService } from 'src/app/modules/_services/assistants.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-assistants-table',
  templateUrl: './assistants-table.component.html',
  styleUrls: ['./assistants-table.component.css']
})
export class AssistantsTableComponent implements OnInit {

  @Input() public search: String = "";
  private unsubscribe: Subscription[] = [];

  public displayedColumns: String[] = ['name', 'document', 'email', 'phone', 'delete'];
  public dataSource: MatTableDataSource<any[]>; //ANY CHANGE FOR ASSISTANT
  public innerWidth: number;
  public isResponsive: boolean;
  constructor(private assistantsService: AssistantsService) { }

  @HostListener('window:resize', ['$event'])

  onResize(event?) {
    this.innerWidth = window.innerWidth;
    if (this.innerWidth <= 500) {
      this.isResponsive = true;
    } else {
      this.isResponsive = false;
    }
  }

  ngOnInit(): void {
    this.onResize();
    this.dataSource = new MatTableDataSource<any[]>(this.assistantsService.assistants);
    this.susbcribeToChanges();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.search) {
      if (!changes.search.firstChange) {
        this.applyFilter();
      }
    }
  }

  susbcribeToChanges() {
    this.assistantsService.assistantsEvent.subscribe(assistants => this.dataSource.data = assistants)
  }

  applyFilter() {
    this.dataSource.filter = this.search.trim().toLowerCase();
    if (this.dataSource.paginator) { this.dataSource.paginator.firstPage(); }
  }

  handleClose(index) {

    Swal.fire({
      title: '¿Deseas eliminar este registro?',
      showDenyButton: true,
      icon: 'question',
      showCancelButton: false,
      confirmButtonText: `Si`,
      reverseButtons: true,
      denyButtonText: `No`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.assistantsService.deleteItem(index);
      }
    })
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
