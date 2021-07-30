/**
 * Student-Management-System-API
 * The Student-Management-System-API. <a href=\'http://localhost:3000/api-json\'>JSON</a>
 *
 * The version of the OpenAPI document: 1.0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

export interface GroupSettingsDto {
	/**
	 * Determines, wether course allows group creation.
	 */
	allowGroups: boolean;
	/**
	 * If utilized, all group names will use the nameSchema followed by the group\'s number.
	 */
	nameSchema?: string;
	/**
	 * The required amount of members the group needs in order to submit group-assignments.
	 */
	sizeMin: number;
	/**
	 * The maximum amount of members in a group.
	 */
	sizeMax: number;
	/**
	 * Indicates, wether the group is managed by its members.
	 */
	selfmanaged: boolean;
	/**
	 * If enabled, participants that join the course will automatically join a group.
	 */
	autoJoinGroupOnCourseJoined: boolean;
	/**
	 * If enabled, groups that don\'t have enough members will be merged when an assignment starts.
	 */
	mergeGroupsOnAssignmentStarted: boolean;
}