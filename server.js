import express from "express";
        import cors from "cors";
        import { YoutubeTranscript } from "youtube-transcript";

        const app = express();
        // 启用 CORS
        app.use(cors());
        app.use(express.json());

        // MCP metadata - 供 Agent Builder 读取的描述信息
        app.get("/", (req, res) => {
          res.json({
            mcp: "1.0",
            name: "youtube_transcript_mcp",
            description: "Fetch full transcript from a YouTube video.",
            capabilities: ["youtube.transcript.fetch"]
          });
        });

        // MCP Tool: 核心功能 - 获取完整的视频字幕
        app.post("/youtube/transcript", async (req, res) => {
          try {
            const { url } = req.body;
            if (!url) {
              return res.status(400).json({ error: "url is required" });
            }

            // 调用 youtube-transcript 库获取字幕
            const transcript = await YoutubeTranscript.fetchTranscript(url);

            res.json({
              success: true,
              url,
              transcript
            });
          } catch (err) {
            // 错误处理，返回 500 状态码和错误信息
            res.status(500).json({
              success: false,
              error: err.toString()
            });
          }
        });

        // 启动服务器
        const PORT = process.env.PORT || 3000; // Replit 默认使用 3000/8080，使用 process.env.PORT 最好
        app.listen(PORT, () => {
          console.log(`MCP server running on port ${PORT}`);
        });
