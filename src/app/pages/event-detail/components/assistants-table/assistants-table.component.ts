import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { AssistantsService } from 'src/app/modules/_services/assistants.service';

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

  constructor(private assistantsService: AssistantsService) { }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<any[]>(this.assistantsService.assistants);
    this.susbcribeToChanges();
  }

  ngOnChanges(changes: SimpleChanges){
    if(changes.search){
      if(!changes.search.firstChange){
        this.applyFilter();
      }
    }
  }

  susbcribeToChanges(){
    this.assistantsService.assistantsEvent.subscribe(assistants => this.dataSource.data = assistants)
  }

  applyFilter() {
    this.dataSource.filter = this.search.trim().toLowerCase();
    if (this.dataSource.paginator) { this.dataSource.paginator.firstPage(); }
  }

  handleClose(index){
    this.assistantsService.deleteItem(index);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
