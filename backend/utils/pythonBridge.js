import { PythonShell } from "python-shell";

export const runPython = (scriptPath, args = {}) =>
  new Promise((resolve, reject) => {
    const options = {
      mode: "text",
      pythonPath: "python3",
      scriptPath: scriptPath.substring(0, scriptPath.lastIndexOf("/")),
      args: Object.values(args),
    };

    PythonShell.run(scriptPath, options, (err, results) => {
      if (err) reject(err);
      else resolve(results.join(""));
    });
  });
