import {
    collection,
    deleteDoc,
    doc,
    getDoc,
    onSnapshot,
    query,
    serverTimestamp,
    setDoc,
    where,
    type FirestoreError,
} from "firebase/firestore";

import { db } from "../config/firebase";
import type { SaveUserNoteInput, UserNote } from "../types/progress";

const USERS_COLLECTION = "users";
const NOTES_COLLECTION = "notes";

function getNotesCollection(userId: string) {
  return collection(db, USERS_COLLECTION, userId, NOTES_COLLECTION);
}

function getNoteReference(userId: string, noteId: string) {
  return doc(db, USERS_COLLECTION, userId, NOTES_COLLECTION, noteId);
}

export async function saveUserNote(
  userId: string,
  input: SaveUserNoteInput,
): Promise<string> {
  const cleanContent = input.content.trim();

  if (!cleanContent) {
    throw new Error("The note cannot be empty.");
  }

  const noteReference = input.noteId
    ? getNoteReference(userId, input.noteId)
    : doc(getNotesCollection(userId));

  const existingNote = await getDoc(noteReference);

  await setDoc(
    noteReference,
    {
      noteId: noteReference.id,
      lessonId: input.lessonId,
      pathId: input.pathId,
      content: cleanContent,
      updatedAt: serverTimestamp(),
      ...(existingNote.exists() ? {} : { createdAt: serverTimestamp() }),
    },
    { merge: true },
  );

  return noteReference.id;
}

export async function deleteUserNote(
  userId: string,
  noteId: string,
): Promise<void> {
  await deleteDoc(getNoteReference(userId, noteId));
}

export function subscribeToLessonNotes(
  userId: string,
  lessonId: string,
  onNotesChange: (notes: UserNote[]) => void,
  onError?: (error: FirestoreError) => void,
) {
  const notesQuery = query(
    getNotesCollection(userId),
    where("lessonId", "==", lessonId),
  );

  return onSnapshot(
    notesQuery,
    (snapshot) => {
      const notes = snapshot.docs.map(
        (noteDocument) => noteDocument.data() as UserNote,
      );

      // Show the newest edited note first
      notes.sort(
        (firstNote, secondNote) =>
          (secondNote.updatedAt?.toMillis() ?? 0) -
          (firstNote.updatedAt?.toMillis() ?? 0),
      );

      onNotesChange(notes);
    },
    (error) => {
      console.error("Notes listener error:", error);
      onError?.(error);
    },
  );
}
