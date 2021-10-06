export const Select = {
	sidebar: {
		explorerMenu: {
			button: "explorer-menu-btn",
			saveAsNewProject: "save-as-new-project-btn"
		}
	},
	fileExplorer: {
		button: {
			addFile: "add-file-btn",
			addDirectory: "add-directory-btn"
		},
		file: "file",
		fileContextMenu: {
			markAsEntryPoint: "markAsEntryPointBtn",
			delete: "deleteBtn"
		},
		directory: "directory"
	},
	fileTabs: {
		tab: "file-tab"
	},
	dialog: {
		createProject: {
			container: "create-project-dialog",
			projectNameInput: "project-name-input"
		},
		createFile: {
			container: "create-file-dialog",
			fileNameInput: "file-name-input"
		},
		createDirectory: {
			container: "create-directory-dialog",
			directoryNameInput: "directoryNameInput"
		}
	},
	button: {
		create: "create-btn",
		cancel: "cancel-btn"
	}
} as const;