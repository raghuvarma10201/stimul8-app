/*===============================================================================
File Name: chat.interface.ts
Description:
    This file contains all the interfaces used by the chat component.
    These interfaces define the structure of data used throughout the chat functionality.
    This file provides a comprehensive interface for managing chat functionality with the following capabilities and testing:

Author(s):
    Naresh 

Version History:
    - v1 (04-Mar-2025): 

License:
    This software is proprietary and is not open source. 
    Unauthorized copying, distribution, modification, or use of this file, 
    via any medium, is strictly prohibited unless expressly authorized by 
    stimul8.ai Inc. A valid license must be purchased  
    and is required for lawful use of this software.

    For licensing inquiries, please contact: [license@stimul8.ai]

    Copyright (c) 2025 by stimul8.ai Inc.
    All rights reserved. Unauthorized copying of this file, via any medium,    
    is strictly prohibited. Proprietary and confidential. 
===============================================================================
*/

// import { ChartType } from 'chart.js';

/**
 * Represents an uploaded file in the chat
 */
export interface UploadedFile {
  file: File;
  filename?: string;
  typeLabel?: string;
}

/**
 * Represents chart data structure
 */
export interface ChartData {
  [key: string]: string | number;
}

/**
 * Represents a text message with optional formatting and chart data
 */
export interface TextMessage {
  heading?: string;
  code?: string;
  chartId?: string;
  chartDataField: ChartData[];
  chartType: any;
  chartTitle: string;
  language?: string;
  text?: string;
  type?: string;
}

/**
 * Represents a chat message with all its properties
 */
export interface ChatMessage {
  type?: string;
  text?: string | TextMessage;
  sender: string;
  timestamp: Date;
  files?: UploadedFile[];
  error?: boolean;
  feedback?: Feedback;
  responseId?: string;
  context_messages?: string[];
}

/**
 * Represents user feedback for a chat message
 */
export interface Feedback {
  reason: string;
  comment: string;
  is_good: boolean;
  is_bad: boolean;
}

/**
 * Represents a channel in the chat system
 */
export interface Channel {
  id: string;
  name: string;
  description?: string;
  vendor?: Vendor[];
}

/**
 * Represents a vendor in the system
 */
export interface Vendor {
  id: string;
  name: string;
  description?: string;
  status?: string;
}

/**
 * Represents a bot message with specific properties
 */
export interface BotMessage {
  type: 'text' | 'form' | '';
  text: string | TextMessage;
  timestamp: Date;
  sender: 'bot';
  error: boolean;
  operationType: string;
  entityType: string;
  entityName: string;
  appID: string;
  data: {
    operation: string;
    entity_type: string;
    entity_id: string;
  };
  context_messages?: string[];
  response?: string | TextMessage;
}

/**
 * Represents an API response structure
 */
export interface ApiResponse {
  type: 'text' | 'form';
  response?: string | TextMessage;
  data?: {
    operation: string;
    entity_type: string;
    entity_id: string;
  };
  context_messages?: string[];
}

/**
 * Represents a channel response from the API
 */
export interface ChannelResponse {
  id: string;
  name: string;
  description: string;
}

/**
 * Represents channel history response from the API
 */
export interface ChannelHistoryResponse {
  response?: {
    response: string;
    date: Date;
  };
  request?: {
    message: string;
    date: Date;
    data: UploadedFile[];
  };
  id: string;
  feedback?: Feedback;
}

/**
 * Represents an API error structure
 */
export interface ApiError {
  error: {
    error: {
      api_error_code: number;
      message: string;
    };
  };
  detail?: string;
  message?: string;
}

/**
 * Represents entity data structure
 */
export interface EntityData {
  id: string;
  name: string;
  description?: string;
  attributes?: any[];
  data_mapping?: any[];
  linking_rules?: any[];
  operations?: any[];
  resources?: any[];
  createdByName?: string;
  creationDate?: string;
  lastModifiedByName?: string;
  lastModifiedDate?: string;
  owners?: string[];
}
