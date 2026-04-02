// src/components/Editor.tsx
"use client";

import { BlockNoteEditor, PartialBlock } from "@blocknote/core";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css"; // 스타일 불러오기

interface EditorProps {
  onChange: (html: string) => void; // 부모에게 HTML을 전달할 함수
  initialContent?: string;
}

export default function Editor({ onChange }: EditorProps) {
  // 에디터 생성
  const editor = useCreateBlockNote();

  // 내용이 바뀔 때마다 실행되는 함수
  const handleChange = async () => {
    // 블록을 HTML로 변환
    const html = await editor.blocksToHTMLLossy(editor.document);
    onChange(html);
  };

  return (
    <div className="border border-gray-300 rounded-md min-h-[300px] p-2">
      <BlockNoteView editor={editor} onChange={handleChange} theme="light" />
    </div>
  );
}
