"use client";
import { useActionState, useEffect, useRef } from "react";
import type { Field } from "@/lib/resources";
import { UploadField } from "./upload-field";

type State = { error: string | null; ok: boolean };
type Action = (prev: State, fd: FormData) => Promise<State>;

export function EntityForm({
  fields,
  values,
  action,
  submitLabel = "Simpan",
  resetOnSuccess = false,
  children,
}: {
  fields: Field[];
  values?: Record<string, unknown>;
  action: Action;
  submitLabel?: string;
  resetOnSuccess?: boolean;
  children?: React.ReactNode;
}) {
  const [state, formAction, pending] = useActionState(action, { error: null, ok: false });
  const formRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state.ok && resetOnSuccess) formRef.current?.reset();
  }, [state, resetOnSuccess]);

  return (
    <form ref={formRef} action={formAction} className="grid gap-4 md:grid-cols-2">
      {fields.map((f) => {
        const v = values?.[f.name];
        const wide = f.type === "textarea" || f.type === "image" || f.type === "file";
        return (
          <label key={f.name} className={`space-y-1 text-sm ${wide ? "md:col-span-2" : ""}`}>
            <span className="font-semibold">
              {f.label} {f.required && <span className="text-red-500">*</span>}
            </span>
            {f.type === "textarea" ? (
              <textarea name={f.name} defaultValue={(v as string) ?? ""} rows={4} className="input" />
            ) : f.type === "checkbox" ? (
              <div><input type="checkbox" name={f.name} defaultChecked={values ? Boolean(v) : true} className="h-5 w-5 accent-[var(--accent)]" /></div>
            ) : f.type === "image" ? (
              <UploadField name={f.name} defaultValue={v as string} accept="image/*" />
            ) : f.type === "file" ? (
              <UploadField name={f.name} defaultValue={v as string} accept="application/pdf,image/*" />
            ) : (
              <input name={f.name} type={f.type === "number" ? "number" : "text"} defaultValue={(v as string | number) ?? (f.type === "number" ? 0 : "")} className="input" />
            )}
            {f.hint && <span className="block text-xs text-muted">{f.hint}</span>}
          </label>
        );
      })}
      <div className="flex flex-wrap items-center gap-3 md:col-span-2">
        <button className="btn" disabled={pending}>{pending ? "Menyimpan…" : submitLabel}</button>
        {children}
        {state.error && <span className="text-sm text-red-500">{state.error}</span>}
        {state.ok && !pending && <span className="text-sm text-green-600">Tersimpan ✓</span>}
      </div>
    </form>
  );
}
