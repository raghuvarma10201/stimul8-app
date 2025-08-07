/*===============================================================================
File Name: notification.enum.ts
Description:
    This file provides a comprehensive interface for managing notification enum with the following capabilities and testing:   

Author(s):
    Naresh      

Version History:  
    - v1 (04-Mar-2025): Initial version

License:      
    This software is proprietary and is not open source.   
    Unauthorized copying, distribution, modification, or use of this file,        
    via any medium, is strictly prohibited unless expressly authorized by           
    stimul8.ai Inc. A valid license must be purchased
    and is required for lawful use of this software.    

    For licensing inquiries, please contact: [license@stimul8.ai]   
    All rights reserved. Unauthorized copying of this file, via any medium,     
    is strictly prohibited. Proprietary and confidential.   
===============================================================================  
*/

export enum NotificationMessages {
  // General Errors
  ERROR = 'An error occurred. Please try again.',
  FETCH_ERROR_MESSAGE = 'Failed to fetch the data.',
  CHAT_SEND_ERROR = "Sorry, we couldn't process your message at the moment. Please try again shortly.",
  NotFound = 'The requested resource is not found.',
  ValidationError = 'Please complete all required fields.',

  // Authentication & Authorization
  Unauthorized = 'You are not authorized to perform this action.',

  // Network & Request Errors
  NetworkError = 'A network error occurred. Check your connection.',
  TimeoutError = 'The request timed out. Please try again later.',

  // Agent-related Messages
  AGENT_CREATE_SUCCESS = 'Agent created successfully.',
  AGENT_UPDATE_SUCCESS = 'Agent updated successfully.',
  AGENT_DELETE_SUCCESS = 'Agent deleted successfully.',
  AGENT_ADDED_SUCCESS = 'Agent added successfully.',
  AGENT_REMOVE_SUCCESS = 'Agent removed successfully.',
  AGENT_ERROR = 'An error occurred while processing the Agent. Please try again.',
  NO_AGENT_DATA = 'No Agents found.',
  AGENT_DELETE_MESSAGE = 'Are you sure you want to delete the Agent?',
  NO_AGENT_SELECTED = 'No Agent Selected',
  NO_AGENT_SELECTED_MESSAGE = 'Select an Agent to proceed',
  ALL_AGENTS_ADDED = 'All available Agents have been added to the agent.',
  ALL_AGENTS_REMOVED = 'All available Agents have been removed from the agent.',

  // Vendor-related Messages
  VENDOR_CREATE_SUCCESS = 'Vendor created successfully.',
  VENDOR_UPDATE_SUCCESS = 'Vendor updated successfully.',
  VENDOR_DELETE_SUCCESS = 'Vendor deleted successfully.',
  VENDOR_ADDED_SUCCESS = 'Vendor added successfully.',
  VENDOR_REMOVE_SUCCESS = 'Vendor removed successfully.',
  VENDOR_ERROR = 'An error occurred while processing the Vendor. Please try again.',
  NO_VENDOR_DATA = 'No Vendors found.',
  VENDOR_DELETE_MESSAGE = 'Are you sure you want to delete the Vendor?',
  NO_VENDOR_SELECTED = 'Select a Vendor to proceed',

  // Channel-related Messages
  CHANNEL_CREATE_SUCCESS = 'Channel created successfully.',
  CHANNEL_UPDATE_SUCCESS = 'Channel updated successfully.',
  CHANNEL_DELETE_SUCCESS = 'Channel deleted successfully.',
  CHANNEL_NOT_FOUND = 'Channel not found.',
  CHANNEL_DELETE_MESSAGE = 'Are you sure you want to delete the Channel?',
  NO_CHANNEL_SELECTED = 'No Channel Selected',
  CHANNEL_CREATE_ERROR = 'Failed to create channel. Please try again.',
  CHANNEL_UPDATE_ERROR = 'Failed to update channel. Please try again.',
  CHANNEL_DELETE_ERROR = 'Failed to delete channel. Please try again.',
  CHANNEL_ADD_ERROR = "We couldn't process your message at the moment. Please try again shortly.",
  CHANNEL_NOT_FOUND_ERROR = "Sorry couldn't find what you are looking for",

  ENTITY_NO_AGENTS_FOUND = 'No Agents found.',
  ENTITY_NO_RUNBOOKS_FOUND = 'No Runbooks found.',
  ENTITY_NO_RUNBOOK_TEMPLATES_FOUND = 'No Runbook Templates found.',
  ENTITY_NO_VENDORS_FOUND = 'No Vendors found.',
  ENTITY_NO_TOOLS_FOUND = 'No Tools found.',
  ENTITY_NO_APPLICATIONS_FOUND = 'No Applications found.',

  ENTITY_ALL_AGENTS_ADDED = 'All available Agents are already added to {entityName}.',

  ENTITY_ALL_RUNBOOKS_ADDED = 'All available Runbooks are already added to {entityName}.',

  ENTITY_ALL_RUNBOOK_TEMPLATES_ADDED = 'All available Runbook Templates are already added to {entityName}.',

  ENTITY_ALL_VENDORS_ADDED = 'All available Vendors are already added to {entityName}.',

  ENTITY_ALL_TOOLS_ADDED = 'All available Tools are already added to {entityName}.',

  ENTITY_ALL_APPLICATIONS_ADDED = 'All available Applications are already added to {entityName}.',

  ENTITY_NO_AGENTS_ADDED = 'No Agents have been added to the {entityName}.',
  ENTITY_NO_RUNBOOKS_ADDED = 'No Runbooks have been added to the {entityName}.',
  ENTITY_NO_RUNBOOK_TEMPLATES_ADDED = 'No Runbook Templates have been added to the {entityName}.',
  ENTITY_NO_VENDORS_ADDED = 'No Vendors have been added to the {entityName}.',
  ENTITY_NO_TOOLS_ADDED = 'No Tools have been added to the {entityName}.',
  ENTITY_NO_APPLICATIONS_ADDED = 'No Applications have been added to the {entityName}.',
  ENTITY_NO_OPERATIONS_ADDED = 'No Operations have been added to the {entityName}.',
  ENTITY_NO_RESOURCES_ADDED = 'No Resources have been added to the {entityName}.',
  ENTITY_NO_CREDENTIALS_ADDED = 'No Credentials have been added to the {entityName}.',
  ENTITY_NO_DATA_MAPPING_ADDED = 'No Data Mapping have been added to the {entityName}.',
  ENTITY_NO_LINKING_RULES_ADDED = 'No Linking Rules have been added to the {entityName}.',

  ENTITY_NAME_ALREADY_EXISTS = '{entityName} with same name already exists.',

  // Runbook-related Messages
  RUNBOOK_CREATE_SUCCESS = 'Runbook created successfully.',
  RUNBOOK_UPDATE_SUCCESS = 'Runbook updated successfully.',
  RUNBOOK_DELETE_SUCCESS = 'Runbook deleted successfully.',
  RUNBOOK_ADDED_SUCCESS = 'Runbook added successfully.',
  RUNBOOK_REMOVE_SUCCESS = 'Runbook removed successfully.',
  RUNBOOK_ADD_ERROR = 'Select a Runbook to proceed',
  RUNBOOK_REMOVE_ERROR = 'Select a Runbook to proceed',
  RUNBOOK_DELETE_MESSAGE = 'Are you sure you want to delete the Runbook?',
  RUNBOOK_TEMPLATE_CREATE_SUCCESS = 'Runbook Template created successfully.',
  RUNBOOK_TEMPLATE_DELETE_MESSAGE = 'Are you sure you want to delete the Runbook Template?',
  EXECUTE_ACTION_SUCCESS = 'Runbook executed successfully.',
  RUNBOOK_TEMPLATE_ADDED_SUCCESS = 'Runbook Template added successfully.',
  NO_RUNBOOK_DATA = 'No Records found.',
  NO_RUNBOOK_SELECTED = 'Select a Runbook to proceed',
  RUNBOOK_ADD_OR_COPY_SUCCESS = 'Runbook created successfully.',

  // Tool-related Messages
  CREATE_TOOL_SUCCESS = 'Tool created successfully.',
  UPDATE_TOOL_SUCCESS = 'Tool updated successfully.',
  TOOL_DELETE_SUCCESS = 'Tool deleted successfully.',
  TOOLS_ADDED_SUCCESS = 'Tools added successfully.',
  TOOLS_REMOVED_SUCCESS = 'Tools removed successfully.',
  TOOL_DELETE_MESSAGE = 'Are you sure you want to delete the Tool?',
  NO_TOOL_SELECTED = 'Select a Tool to proceed.',
  NO_TOOLS_DATA = 'No Tools found.',
  TOOL_UPDATE_SUCCESS = 'Tool updated successfully.',
  TOOL_CREATE_SUCCESS = 'Tool created successfully.',
  TOOL_COPY_SUCCESS = 'Tool copied successfully.',
  ALL_TOOLS_ADDED = 'All available Tools have been added to the Agent.',
  ALL_TOOLS_REMOVED = 'All available Tools have been removed from the Agent.',

  // Template-related Messages
  TEMPLATE_CREATE_SUCCESS = 'Runbook Template created successfully.',
  TEMPLATE_UPDATE_SUCCESS = 'Runbook Template updated successfully.',
  TEMPLATE_DELETE_SUCCESS = 'Runbook Template deleted successfully.',
  TEMPLATE_ADD_ERROR = 'No Runbook Template selected',
  NO_TEMPLATE_SELECTED = 'Select a Runbook Template to proceed',
  NO_RUNBOOK_TEMPLATE_DATA = 'No Runbook Templates found.',
  RUNBOOK_TEMPLATE_REMOVE_SUCCESS = 'Runbook Template removed successfully.',
  RUNBOOK_TEMPLATE_ADD_OR_COPY_SUCCESS = 'Runbook Template created successfully.',

  // Application-related Messages
  NO_APPLICATION_DATA = 'There are no applications configured.',
  NO_APPLICATION_RESOURCE_DATA = 'No resources found in the application.',
  NO_APPLICATION_OPERATIONS_DATA = 'There are no operations available in the application.',
  APPLICATION_ADD_OR_COPY_SUCCESS = 'Application created successfully.',
  APPLICATION_UPDATE_SUCCESS = 'Application updated successfully.',
  APPLICATION_SUBMITTED_FOR_REVIEW = 'Application submitted for review successfully.',
  APPLICATION_SUBMISSION_ERROR = 'Failed to submit application for review.',


  // Common Success Messages
  SaveSuccess = 'Your changes have been saved successfully.',
  DeleteSuccess = 'The item has been deleted successfully.',

  // Session-related Messages
  SessionMessage = 'Your session is about to expire. Do you want to extend it?',

  // Credential-related Messages
  CREDENTIAL_DELETE_MESSAGE = 'Are you sure you want to delete the Credential?',
  CREDENTIAL_DELETE_SUCCESS = 'Credential deleted successfully.',
  NO_CREDENTIAL_DATA = 'No Credentials are available.',

  // Common Entity Messages
  ENTITY_CREATE_SUCCESS = 'created successfully.',
  ENTITY_UPDATE_SUCCESS = 'updated successfully.',
  ENTITY_COPY_SUCCESS = 'copied successfully.',
  ENTITY_REMOVE_SUCCESS = 'removed successfully.',
  NO_ENTITY_SELECTED = 'Select an entity to proceed',

  // Application-related Messages
  APPLICATION_DELETE_MESSAGE = 'Are you sure you want to delete the Application?',
  APPLICATION_DELETE_SUCCESS = 'Application deleted successfully.',
  NO_APPLICATION_SELECTED = 'Select an Application to proceed',

  MESSAGE_SEND_ERROR = 'Failed to send message. Please try again.',
  REQUIRED_FIELD = 'This field is required',
  SPECIAL_CHARACTERS_NOT_ALLOWED = 'Special characters are not allowed',
  REQUIRED_FIELD_MESSAGE = '{field} is required.',
  REQUIRED_MIN_LENGTH_MESSAGE = '{field} must be at least {length} characters.',
  REQUIRED_MAX_LENGTH_MESSAGE = '{field} must be at most {length} characters.',
  SPECIAL_CHARACTERS_NOT_ALLOWED_MESSAGE = '{field} should not contain special characters.',
  GOOD_RESPONSE = 'Thank you for your feedback.',
  BAD_RESPONSE = 'Thank you for your feedback.',

  /* List of Feedbacks */
  FEEDBACK_Factual_Inaccuracy = 'Inaccurate information',
  FEEDBACK_Irrelevant_or_off_topic = 'Irrelevant information',
  FEEDBACK_Repetitive_or_looping = 'Repetitive information',
  FEEDBACK_Missing_context_assumptions = 'Information missing context',
  FEEDBACK_Vague_or_ambiguous = 'Lacks specific information',
  FEEDBACK_Misunderstood_question = 'Question misunderstood',
  FEEDBACK_Low_utility_unactionable = 'Information not helpful or actionable',
  FEEDBACK_Other = 'Something else',

  ENTITY_NO_ATTRIBUTES_ADDED = 'No Attributes have been added to the {entityName}.',
  ENTITY_NO_MANDATORY_ATTRIBUTES_ADDED = 'No Mandatory Attributes have been added to the {entityName}.',
  ENTITY_NO_UNIQUE_ATTRIBUTES_ADDED = 'No Unique Attributes have been added to the {entityName}.',
  ENTITY_NO_REFERENCE_ATTRIBUTES_ADDED = 'No Reference Attributes have been added to the {entityName}.',
  ENTITY_NO_USER_PROFILE_ATTRIBUTES_ADDED = 'No User Profile Attributes have been added to the {entityName}.',
  GENERIC_ERROR = 'Internal Server Error',
  ENTITY_NO_INPUT_APPLICATION_DESCRIPTION_ADDED = "No Input Application Description.",
  ENTITY_NO_SUMMARY_DATA_ERROR = 'No Summary Data found.',
  ACTIVITY_CLEAR_SUCCESS_MESSAGE = 'Activities have been cleared successfully.',
  CLEAR_INTERACTIONS_SUCCESS_MESSAGE = "All interactions have been cleared successfully.",
  NO_RECORDS_DATA = 'No Records found.',
}
