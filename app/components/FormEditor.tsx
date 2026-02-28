import { useState } from "react";
import Button from "./Button";
import Input from "./Input";
import { isAxiosError } from "axios";

export type QuestionType =
  | "SHORT_ANSWER"
  | "MULTIPLE_CHOICE"
  | "CHECKBOX"
  | "DROPDOWN";

export type FormStatus = "DRAFT" | "PUBLISHED" | "CLOSED";

export interface Question {
  id?: string;
  text: string;
  type: QuestionType;
  required: boolean;
  options: string[];
}

export interface FormData {
  title: string;
  description: string;
  status?: FormStatus;
  questions: Question[];
}

interface FormEditorProps {
  initialData?: FormData;
  onSubmit: (data: FormData) => Promise<void>;
  submitLabel: string;
  onCancel: () => void;
  loading?: boolean;
}

export default function FormEditor({
  initialData,
  onSubmit,
  submitLabel,
  onCancel,
  loading = false,
}: FormEditorProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(
    initialData?.description || "",
  );
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED" | "CLOSED">(
    initialData?.status || "DRAFT",
  );
  const [questions, setQuestions] = useState<Question[]>(
    initialData?.questions?.map((q) => ({
      ...q,
      options: q.options || [],
    })) || [{ text: "", type: "SHORT_ANSWER", required: false, options: [] }],
  );
  const [error, setError] = useState<string>(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    for (const q of questions) {
      if (
        ["MULTIPLE_CHOICE", "CHECKBOX", "DROPDOWN"].includes(q.type) &&
        q.options.length === 0
      ) {
        setError(
          `Question "${q.text || "Untitled"}" requires at least one option.`,
        );
        return;
      }
    }

    try {
      await onSubmit({ title, description, status, questions });
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        setError(err.response?.data?.message || "An error occurred");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An error occurred");
      }
    }
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { text: "", type: "SHORT_ANSWER", required: false, options: [] },
    ]);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const updateQuestion = (
    index: number,
    field: keyof Question,
    value: string | boolean | string[] | QuestionType,
  ) => {
    const newQuestions = [...questions];
    const updatedQuestion = { ...newQuestions[index], [field]: value };

    if (field === "type" && value === "SHORT_ANSWER") {
      updatedQuestion.options = [];
    }

    newQuestions[index] = updatedQuestion;
    setQuestions(newQuestions);
  };

  const addOption = (qIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options.push("");
    setQuestions(newQuestions);
  };

  const updateOption = (qIndex: number, oIndex: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex] = value;
    setQuestions(newQuestions);
  };

  const removeOption = (qIndex: number, oIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options = newQuestions[qIndex].options.filter(
      (_, i) => i !== oIndex,
    );
    setQuestions(newQuestions);
  };

  return (
    <div className="mx-auto w-full max-w-3xl">
      {error && (
        <div className="mb-6 rounded bg-red-100 p-3 text-red-700">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        {/* Form Details */}
        <div className="border-border bg-card flex flex-col gap-4 rounded-lg border p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Form Details</h3>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Status:</label>
              <select
                className="border-input bg-background focus-visible:ring-ring h-9 rounded-md border px-3 py-1 text-sm shadow-sm focus-visible:ring-1 focus-visible:outline-none"
                value={status}
                onChange={(e) => setStatus(e.target.value as FormStatus)}
              >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
                <option value="CLOSED">Closed</option>
              </select>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Title</label>
            <Input
              required
              placeholder="Form Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Description</label>
            <textarea
              className="border-input bg-background focus-visible:ring-ring rounded-md border px-3 py-2 text-sm shadow-sm focus-visible:ring-1 focus-visible:outline-none"
              placeholder="Form Description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        {/* Questions */}
        <div className="flex flex-col gap-6">
          {questions.map((q, qIndex) => (
            <div
              key={qIndex}
              className="border-border bg-card group relative flex flex-col gap-4 rounded-lg border p-6 shadow-sm"
            >
              <div className="absolute top-4 right-4 opacity-0 transition-opacity group-hover:opacity-100">
                {questions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeQuestion(qIndex)}
                    className="text-sm font-medium text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="flex flex-col gap-4 md:flex-row md:items-start">
                <div className="flex flex-1 flex-col gap-2">
                  <label className="text-sm font-medium">Question Text</label>
                  <Input
                    required
                    placeholder="Question"
                    value={q.text}
                    onChange={(e) =>
                      updateQuestion(qIndex, "text", e.target.value)
                    }
                  />
                </div>
                <div className="flex w-full flex-col gap-2 md:w-48">
                  <label className="text-sm font-medium">Type</label>
                  <select
                    className="border-input bg-background focus-visible:ring-ring h-9 rounded-md border px-3 py-1 text-sm shadow-sm focus-visible:ring-1 focus-visible:outline-none"
                    value={q.type}
                    onChange={(e) =>
                      updateQuestion(qIndex, "type", e.target.value)
                    }
                  >
                    <option value="SHORT_ANSWER">Short Answer</option>
                    <option value="MULTIPLE_CHOICE">Multiple Choice</option>
                    <option value="CHECKBOX">Checkbox</option>
                    <option value="DROPDOWN">Dropdown</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`required-${qIndex}`}
                  checked={q.required}
                  onChange={(e) =>
                    updateQuestion(qIndex, "required", e.target.checked)
                  }
                  className="text-primary focus:ring-primary h-4 w-4 rounded border-gray-300"
                />
                <label htmlFor={`required-${qIndex}`} className="text-sm">
                  Required
                </label>
              </div>

              {/* Options for non-text questions */}
              {q.type !== "SHORT_ANSWER" && (
                <div className="border-border mt-2 flex flex-col gap-2 border-l-2 pl-4">
                  <label className="text-muted-foreground text-sm font-medium">
                    Options
                  </label>
                  {q.options.map((opt, oIndex) => (
                    <div key={oIndex} className="flex items-center gap-2">
                      <Input
                        placeholder={`Option ${oIndex + 1}`}
                        value={opt}
                        onChange={(e) =>
                          updateOption(qIndex, oIndex, e.target.value)
                        }
                        className="h-8 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => removeOption(qIndex, oIndex)}
                        className="text-red-400 hover:text-red-600"
                      >
                        x
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addOption(qIndex)}
                    className="text-primary self-start text-sm hover:underline"
                  >
                    + Add Option
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={addQuestion}
            className="w-full self-center md:w-auto"
          >
            + Add Question
          </Button>

          <div className="border-border flex justify-end gap-4 border-t pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : submitLabel}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
