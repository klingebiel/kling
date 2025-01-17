import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	Input,
	OnInit,
	Output
} from "@angular/core";
import { FileSelectors } from "@web-ide/client/data-access/state";
import { File } from "@web-ide/programming";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";

@Component({
	selector: "web-ide-tab",
	templateUrl: "./tab.component.html",
	styleUrls: ["./tab.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabComponent implements OnInit {
	@Input() path!: string;
	@Input() selected!: boolean;

	@Output() tabSelected = new EventEmitter<string>();
	@Output() tabClosed = new EventEmitter<string>();

	file$!: Observable<File | undefined>;

	constructor(private store: Store) {}

	ngOnInit(): void {
		this.file$ = this.store.select(FileSelectors.selectFileByPath(this.path));
	}
}
