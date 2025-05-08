// First, let's implement the notes.ts API file
import axios from 'axios';
import { config } from '../../../config';

export interface Note {
  _id: string;
  value: string;
  writtenAt: string;
  writtenBy: string;
}

export interface AddNoteResponse {
  success: boolean;
  result: Note;
  statusCode: number;
  errors: string[];
}

export interface UpdateNoteResponse {
  success: boolean;
  result: Note;
  statusCode: number;
  errors: string[];
}

export interface DeleteNoteResponse {
  success: boolean;
  result: null;
  statusCode: number;
  errors: string[];
}

export const notesApi = {
  async addNote(caseId: string, noteValue: string): Promise<AddNoteResponse> {
    try {
      const response = await axios.post(
        `${config.airHost}/api/public/cases/${caseId}/notes`,
        { value: noteValue },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.airApiToken}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error adding note to case:', error);
      throw error;
    }
  },
  async updateNote(caseId: string, noteId: string, noteValue: string): Promise<UpdateNoteResponse> {
    try {
      const response = await axios.patch(
        `${config.airHost}/api/public/cases/${caseId}/notes/${noteId}`,
        { value: noteValue },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.airApiToken}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating note in case:', error);
      throw error;
    }
  },
  async deleteNote(caseId: string, noteId: string): Promise<DeleteNoteResponse> {
    try {
      const response = await axios.delete(
        `${config.airHost}/api/public/cases/${caseId}/notes/${noteId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.airApiToken}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error deleting note from case:', error);
      throw error;
    }
  }
};