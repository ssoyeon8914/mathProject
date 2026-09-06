"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getTopicById } from "@/lib/curriculum/topics";
import { saveQuizConfig, saveQuizProblems } from "@/lib/quiz-state";
import {
  getWrongNotes,
  removeWrongNote,
} from "@/lib/storage";
import type { WrongNoteItem } from "@/types/problem";

export function NotesClient() {
  const router = useRouter();
  const [notes, setNotes] = useState<WrongNoteItem[]>([]);

  function refresh() {
    setNotes(getWrongNotes());
  }

  useEffect(() => {
    refresh();
  }, []);

  function retryAll() {
    if (notes.length === 0) return;
    saveQuizProblems([]);
    saveQuizConfig({
      topicId: notes[0].topicId,
      grade: 1,
      difficulty: "easy",
      problemCount: notes.length,
      timed: false,
      mode: "wrong-notes",
      wrongNoteIds: notes.map((n) => n.id),
    });
    router.push("/quiz");
  }

  function retryOne(note: WrongNoteItem) {
    saveQuizProblems([]);
    saveQuizConfig({
      topicId: note.topicId,
      grade: 1,
      difficulty: "easy",
      problemCount: 1,
      timed: false,
      mode: "wrong-notes",
      wrongNoteIds: [note.id],
    });
    router.push("/quiz");
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-8">
      <section className="card-panel">
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-extrabold text-teal-950">
          오답 노트
        </h1>
        <p className="mt-2 text-sm text-teal-800/70">
          틀렸던 문제를 모아 두었어요. 다시 풀면 노트에서 사라져요.
        </p>
        {notes.length > 0 && (
          <button type="button" onClick={retryAll} className="btn-primary mt-4">
            오답 {notes.length}문제 다시 풀기
          </button>
        )}
      </section>

      {notes.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-teal-200 bg-white/60 px-6 py-12 text-center text-teal-800/70">
          아직 오답이 없어요. 연습을 시작해 볼까요?
        </div>
      ) : (
        <ul className="space-y-3">
          {notes.map((note) => {
            const topic = getTopicById(note.topicId);
            return (
              <li key={note.id} className="card-panel">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold text-teal-600">
                      {topic?.name ?? note.topicId}
                    </p>
                    <p className="mt-1 font-[family-name:var(--font-display)] text-2xl font-bold text-teal-950">
                      {note.prompt}
                    </p>
                    <p className="mt-2 text-sm text-teal-800/80">
                      그때 답: {note.userAnswer} · 정답: {note.displayAnswer}
                    </p>
                    <p className="mt-1 text-sm text-teal-700/70">{note.explanation}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => retryOne(note)}
                      className="btn-primary px-4 py-2 text-sm"
                    >
                      다시 풀기
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        removeWrongNote(note.id);
                        refresh();
                      }}
                      className="btn-secondary px-4 py-2 text-sm"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
