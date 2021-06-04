import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { ConfirmDialog } from "./confirm-dialog.dialog";

describe("ConfirmDialogComponent", () => {
	let component: ConfirmDialog;
	let fixture: ComponentFixture<ConfirmDialog>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [ConfirmDialog]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ConfirmDialog);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});