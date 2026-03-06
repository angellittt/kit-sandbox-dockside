import express, { Request, Response } from "express";

export const app = express();
const port = Number(process.env.PORT) || 8000;

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Server is running!" });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
