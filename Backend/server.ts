import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import { connectDB } from "./config/db";
import authRouter from "./routes/authRoutes";
import emailRouter from "./routes/emailRoutes";
import templateRouter from "./routes/templateRoutes";
import userRouter from "./routes/userRoutes";
import { errorHandler, notFoundHandler } from "./middleware/errorMiddleware";

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 5000;

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:8081",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow Postman, server-to-server calls
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("CORS not allowed"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (_req: Request, res: Response) => {
  res.status(200).send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Email Assistant Backend</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body class="bg-slate-50 text-slate-900 flex items-center justify-center min-h-screen">
        <div class="bg-white p-10 rounded-2xl shadow-xl max-w-md text-center">
          <h1 class="text-4xl font-bold mb-4 text-blue-600">Email Assistant</h1>
          <p class="text-lg mb-6">Backend is running smoothly!</p>
          <div class="text-left bg-slate-100 p-4 rounded-lg">
            <p><strong>English:</strong> Email Assistant backend is running.</p>
            <p><strong>Amharic:</strong> የEmail Assistant backend እየሰራ ነው።</p>
          </div>
          <a 
            href="https://example.com/docs" 
            class="inline-block mt-6 px-6 py-3 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-500 transition"
          >
            View API Docs
          </a>
        </div>
      </body>
    </html>
  `);
});

app.use("/api/auth", authRouter);
app.use("/api/email", emailRouter);
app.use("/api/templates", templateRouter);
app.use("/api/user", userRouter);

app.use(notFoundHandler);
app.use(errorHandler);

const bootstrap = async (): Promise<void> => {
  try {
    await connectDB();
    app.listen(port, () => {
      // eslint-disable-next-line no-console
      console.log(`Server started on port ${port}`);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Failed to bootstrap server:", error);
    process.exit(1);
  }
};

void bootstrap();
