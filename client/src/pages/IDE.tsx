import Editor from "@monaco-editor/react";
import { useState } from "react";
import { Play, Save, Download } from "lucide-react";

export default function IDE() {
  const [code, setCode] = useState("# Start coding here...\nprint('Hello World')");
  const [output, setOutput] = useState("");

  const handleRun = () => {
    // In a real app, this would send to a code execution API
    // Here we'll just mock it
    setOutput("Running script...\n> Hello World\n\nProcess finished with exit code 0");
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-[#1e1e1e]">
      {/* IDE Toolbar */}
      <div className="h-12 bg-card border-b border-border flex items-center px-4 justify-between">
        <div className="flex items-center gap-4">
          <span className="font-display text-xs text-primary">Playground.py</span>
          <div className="h-4 w-[1px] bg-border"></div>
          <button className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
            <Save className="h-3 w-3" /> Save
          </button>
          <button className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
            <Download className="h-3 w-3" /> Export
          </button>
        </div>
        
        <button 
          onClick={handleRun}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded text-xs font-bold flex items-center gap-2 transition-colors"
        >
          <Play className="h-3 w-3 fill-current" /> Run
        </button>
      </div>

      {/* Main Area */}
      <div className="flex-1 flex flex-col md:flex-row">
        <div className="flex-1 relative border-r border-border">
          <Editor
            height="100%"
            defaultLanguage="python"
            theme="vs-dark"
            value={code}
            onChange={(val) => setCode(val || "")}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              fontFamily: "'Fira Code', monospace",
              padding: { top: 20 },
            }}
          />
        </div>

        {/* Console / Terminal */}
        <div className="h-1/3 md:h-full md:w-1/3 bg-[#111] flex flex-col">
          <div className="bg-[#252526] px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-[#333]">
            Terminal
          </div>
          <div className="flex-1 p-4 font-mono text-sm text-gray-300 overflow-auto whitespace-pre-wrap">
            {output || <span className="text-gray-600 italic">Ready to execute...</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
