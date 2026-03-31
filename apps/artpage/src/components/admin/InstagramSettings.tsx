"use client";

import { useState } from "react";
import { Instagram, Link2, Unlink, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

type InstagramConnection = {
  id: string;
  site_slug: string;
  username: string;
  last_synced: string | null;
  token_expires: string;
} | null;

export default function InstagramSettings({
  connection,
  siteSlug,
}: {
  connection: InstagramConnection;
  siteSlug: string;
}) {
  const [loading, setLoading] = useState(false);
  const [disconnected, setDisconnected] = useState(false);

  const handleConnect = () => {
    window.location.href = `/api/instagram/connect?site_slug=${siteSlug}`;
  };

  const handleDisconnect = async () => {
    if (!confirm("인스타그램 연결을 해제하시겠습니까?")) return;

    setLoading(true);
    try {
      const res = await fetch("/api/instagram/disconnect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ site_slug: siteSlug }),
      });
      const data = await res.json();
      if (data.success) {
        setDisconnected(true);
      } else {
        alert("연결 해제 실패: " + data.error);
      }
    } catch {
      alert("연결 해제 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const isConnected = connection && !disconnected;

  return (
    <div className="bg-white border rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
        <Instagram className="w-5 h-5" />
        인스타그램 연동
      </h3>

      {isConnected ? (
        <div className="space-y-4">
          {/* 연결 상태 */}
          <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            <div>
              <p className="font-medium text-green-800">
                @{connection.username} 연결됨
              </p>
              {connection.last_synced && (
                <p className="text-xs text-green-600 mt-1">
                  마지막 동기화: {new Date(connection.last_synced).toLocaleDateString("ko-KR")}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                토큰 만료: {new Date(connection.token_expires).toLocaleDateString("ko-KR")}
              </p>
            </div>
          </div>

          {/* 연결 해제 버튼 */}
          <Button
            variant="outline"
            onClick={handleDisconnect}
            disabled={loading}
            className="text-red-600 border-red-200 hover:bg-red-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Unlink className="w-4 h-4 mr-2" />
            )}
            연결 해제
          </Button>

          <p className="text-xs text-gray-400">
            * 인스타그램 게시물은 매일 자동으로 갤러리에 동기화됩니다.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            인스타그램 계정을 연결하면 게시물이 자동으로
            갤러리에 동기화됩니다.
          </p>

          <Button onClick={handleConnect} className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white">
            <Link2 className="w-4 h-4 mr-2" />
            인스타그램 연결
          </Button>

          <ul className="text-xs text-gray-400 space-y-1">
            <li>- 비즈니스 또는 크리에이터 계정 필요</li>
            <li>- 게시물 이미지가 포트폴리오에 자동 추가</li>
            <li>- 연결은 언제든 해제 가능</li>
          </ul>
        </div>
      )}
    </div>
  );
}
