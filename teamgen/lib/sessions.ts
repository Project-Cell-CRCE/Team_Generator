import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
} from "firebase/firestore";
import { getDb } from "./firebase";
import type { SessionState, SessionSummary } from "./types";

function sessionsRef(uid: string) {
  const db = getDb();
  if (!db) throw new Error("Firebase is not configured");
  return collection(db, "users", uid, "sessions");
}

export async function saveSession(uid: string, state: SessionState) {
  await setDoc(doc(sessionsRef(uid), state.id), state);
}

export async function loadSession(
  uid: string,
  sessionId: string,
): Promise<SessionState | null> {
  const snapshot = await getDoc(doc(sessionsRef(uid), sessionId));
  return snapshot.exists() ? (snapshot.data() as SessionState) : null;
}

export async function listSessions(uid: string): Promise<SessionSummary[]> {
  const snapshot = await getDocs(
    query(sessionsRef(uid), orderBy("updatedAt", "desc")),
  );
  return snapshot.docs.map((d) => {
    const data = d.data() as SessionState;
    return {
      id: data.id,
      name: data.name,
      peopleCount: data.people.length,
      teamCount: data.teams.length,
      updatedAt: data.updatedAt,
    };
  });
}

export async function deleteSession(uid: string, sessionId: string) {
  await deleteDoc(doc(sessionsRef(uid), sessionId));
}
