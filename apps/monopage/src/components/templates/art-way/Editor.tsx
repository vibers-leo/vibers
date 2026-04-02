// src/components/Editor.tsx
"use client";

import { BlockNoteEditor, PartialBlock } from "@blocknote/core";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import { useEffect } from "react";
import "@blocknote/mantine/style.css"; // 스타일 불러오기

interface EditorProps {
  onChange: (html: string) => void; // 부모에게 HTML을 전달할 함수
  initialContent?: string;
}

export default function Editor({ onChange, initialContent }: EditorProps) {
  // 에디터 생성
  const editor = useCreateBlockNote({
    uploadFile: async (file: File) => {
      // 1. 파일명 생성 (충돌 방지)
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}_${Math.random()
        .toString(36)
        .substring(7)}.${fileExt}`;

      try {
        // 2. NCP 서버에 업로드 (API 프록시 경유)
        const formData = new FormData();
        formData.append("file", file);
        formData.append("bucket", "images");
        formData.append("path", `editor/${fileName}`);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          throw new Error(`업로드 실패: ${res.statusText}`);
        }

        const data = await res.json();
        return data.url || `http://49.50.138.93:8090/images/editor/${fileName}`;
      } catch (error) {
        console.error("Error uploading image:", error);
        return "https://via.placeholder.com/150?text=Upload+Error"; // 에러 시 대체 이미지
      }
    },
  });

  // 초기 내용 로드 (HTML -> Blocks)
  useEffect(() => {
    async function loadInitialContent() {
      if (initialContent && editor) {
        const blocks = await editor.tryParseHTMLToBlocks(initialContent);
        editor.replaceBlocks(editor.document, blocks);
      }
    }
    loadInitialContent();
  }, [editor]); // initialContent는 의존성에서 제외 (무한루프 방지)

  // ... (나머지 코드)

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
