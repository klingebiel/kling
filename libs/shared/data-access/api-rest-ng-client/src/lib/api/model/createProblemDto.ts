/**
 * Kling-API
 * The Kling-API. <a href='http://localhost:3000/api-json'>JSON</a>
 *
 * OpenAPI spec version: 1.0
 *
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
import { CodeTemplateDto } from "./codeTemplateDto";
import { TestCaseDto } from "./testCaseDto";
import { UserDto } from "./userDto";

export interface CreateProblemDto {
	id: string;
	title: string;
	categories: Array<string>;
	difficulty: CreateProblemDto.DifficultyEnum;
	creatorId: number;
	creator?: UserDto;
	codeTemplates?: Array<CodeTemplateDto>;
	testCases?: Array<TestCaseDto>;
	status?: CreateProblemDto.StatusEnum;
}
export namespace CreateProblemDto {
	export type DifficultyEnum = "EASY" | "MEDIUM" | "HARD";
	export const DifficultyEnum = {
		EASY: "EASY" as DifficultyEnum,
		MEDIUM: "MEDIUM" as DifficultyEnum,
		HARD: "HARD" as DifficultyEnum
	};
	export type StatusEnum = "ATTEMPTED" | "SOLVED" | "UNSOLVED";
	export const StatusEnum = {
		ATTEMPTED: "ATTEMPTED" as StatusEnum,
		SOLVED: "SOLVED" as StatusEnum,
		UNSOLVED: "UNSOLVED" as StatusEnum
	};
}