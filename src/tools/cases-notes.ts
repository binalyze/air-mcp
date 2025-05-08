// Now, let's implement the cases-notes.ts tool file
import { z } from 'zod';
import { notesApi } from '../api/cases/notes/notes';

// Schema for add note to case arguments
export const AddNoteToCaseArgsSchema = z.object({
  caseId: z.string().describe('The ID of the case to add a note to (e.g., "C-2022-0002")'),
  note: z.string().describe('The content of the note to add to the case'),
});

export const UpdateNoteCaseArgsSchema = z.object({
  caseId: z.string().describe('The ID of the case containing the note (e.g., "C-2022-0002")'),
  noteId: z.string().describe('The ID of the note to update (e.g., "8d9baa16-9aa3-4e4f-a08e-a74341ce2f90")'),
  note: z.string().describe('The new content for the note'),
});

export const DeleteNoteFromCaseArgsSchema = z.object({
  caseId: z.string().describe('The ID of the case containing the note (e.g., "C-2022-0002")'),
  noteId: z.string().describe('The ID of the note to delete (e.g., "8d9baa16-9aa3-4e4f-a08e-a74341ce2f90")'),
});

export const caseNotesTools = {
  // Add a note to a case
  async addNoteToCase(args: z.infer<typeof AddNoteToCaseArgsSchema>) {
    try {
      const response = await notesApi.addNote(args.caseId, args.note);
      
      if (!response.success) {
        return {
          content: [
            {
              type: 'text',
              text: `Error adding note to case: ${response.errors.join(', ')}`
            }
          ]
        };
      }
      
      return {
        content: [
          {
            type: 'text',
            text: `Successfully added note to case ${args.caseId}:\n` +
                  `Note ID: ${response.result._id}\n` +
                  `Content: ${response.result.value}\n` +
                  `Written at: ${new Date(response.result.writtenAt).toLocaleString()}\n` +
                  `Written by: ${response.result.writtenBy}`
          }
        ]
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        content: [
          {
            type: 'text',
            text: `Failed to add note to case: ${errorMessage}`
          }
        ]
      };
    }
  },
  async updateNoteInCase(args: z.infer<typeof UpdateNoteCaseArgsSchema>) {
    try {
      const response = await notesApi.updateNote(args.caseId, args.noteId, args.note);
      
      if (!response.success) {
        return {
          content: [
            {
              type: 'text',
              text: `Error updating note in case: ${response.errors.join(', ')}`
            }
          ]
        };
      }
      
      return {
        content: [
          {
            type: 'text',
            text: `Successfully updated note in case ${args.caseId}:\n` +
                  `Note ID: ${response.result._id}\n` +
                  `Content: ${response.result.value}\n` +
                  `Written at: ${new Date(response.result.writtenAt).toLocaleString()}\n` +
                  `Written by: ${response.result.writtenBy}`
          }
        ]
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        content: [
          {
            type: 'text',
            text: `Failed to update note in case: ${errorMessage}`
          }
        ]
      };
    }
  },
  async deleteNoteFromCase(args: z.infer<typeof DeleteNoteFromCaseArgsSchema>) {
    try {
      const response = await notesApi.deleteNote(args.caseId, args.noteId);
      
      if (!response.success) {
        return {
          content: [
            {
              type: 'text',
              text: `Error deleting note from case: ${response.errors.join(', ')}`
            }
          ]
        };
      }
      
      return {
        content: [
          {
            type: 'text',
            text: `Successfully deleted note with ID ${args.noteId} from case ${args.caseId}`
          }
        ]
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        content: [
          {
            type: 'text',
            text: `Failed to delete note from case: ${errorMessage}`
          }
        ]
      };
    }
  }
};