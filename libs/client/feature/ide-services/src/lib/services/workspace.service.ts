import { Injectable } from "@angular/core";
import { ToastService } from "@web-ide/client/shared/services";
import {
	FileActions,
	FileSelectors,
	WorkspaceActions,
	WorkspaceSelectors
} from "@web-ide/client/data-access/state";
import { IndexedDbService, InMemoryProject } from "@web-ide/indexed-db";
import { createDirectoriesFromFiles, File } from "@web-ide/programming";
import { Store } from "@ngrx/store";
import { firstValueFrom, Subject } from "rxjs";
import { FileSystemAccess } from "./file-system-access.service";

@Injectable({ providedIn: "root" })
export class WorkspaceService {
	private _init$ = new Subject<void>();
	/** Emits when the workspace is initialized. */
	init$ = this._init$.asObservable();

	private _fileAdded$ = new Subject<File>();
	/** Emits the added file. */
	fileAdded$ = this._fileAdded$.asObservable();

	private _fileRemoved$ = new Subject<File>();
	/** Emits the `id` of the removed file. */
	fileRemoved$ = this._fileRemoved$.asObservable();

	/** Emits when the editor should be focused programmatically, i.e. after adding a new file */
	readonly focusEditor$ = new Subject<void>();

	/** Determines the application's entry point. */
	readonly entryPoint$ = this.store.select(WorkspaceSelectors.selectEntryPoint);

	private stdin!: string;
	private projectName!: string;

	constructor(
		private readonly store: Store,
		private readonly fileSystem: FileSystemAccess,
		private readonly indexedDb: IndexedDbService,
		private toast: ToastService
	) {
		if ((window as any).Cypress) {
			(window as any)["appStore"] = store;
		}

		this.store.select(WorkspaceSelectors.selectProjectName).subscribe(projectName => {
			this.projectName = projectName;
		});
	}

	initWorkspace(): void {
		this._init$.next();
	}

	emitFileAdded(file: File): void {
		this._fileAdded$.next(file);
	}

	emitFileRemoved(file: File): void {
		this._fileRemoved$.next(file);
	}

	/**
	 * Saves a file. If the project is synchronized with a directory from the user's file system,
	 * the `content` will be written to the actual file on the user's system. Otherwise, it will be
	 * stored in-memory (inside `indexed-db`).
	 *
	 * @param path
	 * @param content
	 */
	async saveFile(path: string, content: string): Promise<void> {
		if (this.fileSystem.hasSynchronizedDirectory) {
			await this.fileSystem.saveSynchronizedFile(path, content);
		} else {
			await this.saveFileInMemory(path, content);
		}

		this.store.dispatch(FileActions.fileSaved({ path, content }));
	}

	/**
	 * Saves a file in the `indexed-db`.
	 * Creates a new project in `indexed-db`, if it does not exist.
	 *
	 * @param path
	 * @param content
	 */
	private async saveFileInMemory(path: string, content: string) {
		const file = await firstValueFrom(this.store.select(FileSelectors.selectFileByPath(path)));
		const project = await this.indexedDb.projects.getByName(this.projectName);

		if (!project) {
			console.log(`Project "${this.projectName}" does not exist yet. Creating new project.`);

			const files = await firstValueFrom(this.store.select(FileSelectors.selectAllFiles));

			await this.indexedDb.projects.saveProject(
				{
					lastOpened: new Date(),
					name: this.projectName,
					source: "in-memory"
				},
				files
			);
		} else {
			await this.indexedDb.files.put(this.projectName, {
				...file,
				content,
				hasUnsavedChanges: false
			} as any);
		}
	}

	async deleteFile(path: string): Promise<void> {
		return this.indexedDb.files.delete(this.projectName, path);
	}

	/**
	 * Restores the project, if it exists. Otherwise, an empty project will be created.
	 *
	 * @param projectName
	 */
	async createOrRestoreInMemoryProject(projectName: string): Promise<void> {
		const project = await this.indexedDb.projects.getByName(projectName);

		if (project) {
			await this.restoreInMemoryProject(project as InMemoryProject, false);
		} else {
			await this.indexedDb.projects.saveProject(
				{
					name: projectName,
					lastOpened: new Date(),
					source: "in-memory"
				},
				[]
			);

			this.store.dispatch(
				WorkspaceActions.loadProject({
					projectName: projectName,
					files: [],
					directories: []
				})
			);
		}
	}

	/**
	 * Restores a project from the `indexedDB` and loads it into the workspace.
	 *
	 * @param projectName Name of the project.
	 * @param [openFile=true] Determines, whether a file from this project should be opened automatically.
	 */
	async restoreProject(projectName: string, openFile = true): Promise<void> {
		try {
			const project = await this.indexedDb.projects.getByName(projectName);

			if (!project) {
				throw new Error("Project does not exist.");
			}

			if (project.source === "fs") {
				if (project.directoryHandle) {
					await this.fileSystem.synchronizeWithDirectory(
						project.directoryHandle,
						openFile,
						project
					);
				} else {
					throw new Error("Project has no directoryHandle.");
				}
			} else {
				await this.restoreInMemoryProject(project, openFile);
			}
		} catch (error) {
			this.toast.error("Error.FailedToLoadProject", undefined, { projectName });
			console.error(`Failed to restore project: ${projectName}`);
			console.error(error);
		}
	}

	private async restoreInMemoryProject(project: InMemoryProject, openFile = true): Promise<void> {
		const files = await this.indexedDb.files.getFiles(project.name);
		const directories = createDirectoriesFromFiles(files);

		this.store.dispatch(
			WorkspaceActions.loadProject({
				projectName: project.name,
				files: files ?? [],
				directories
			})
		);

		if (openFile) {
			this.store.dispatch(FileActions.setSelectedFile({ path: files?.[0]?.path ?? null }));
		}
	}

	/**
	 * Sets the entry point for the currently opened project.
	 * The entry point must be known to create code execution requests.
	 *
	 * @param path
	 */
	setEntryPoint(path: string): void {
		this.store.dispatch(WorkspaceActions.setEntryPoint({ path }));
	}

	/**
	 * Sets the `stdin`, which will be included in code execution requests to enable programs to read
	 * user input from the command line.
	 *
	 * @param content
	 */
	setStdin(content: string): void {
		this.stdin = content;
	}

	getStdin(): string {
		return this.stdin;
	}
}
