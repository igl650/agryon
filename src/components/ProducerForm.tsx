import { useState } from "react";
import {
  emptyProducer,
  finalidades,
  tiposCriacao,
  type Producer,
} from "@/lib/profile";

export function ProducerForm({
  initial,
  submitLabel,
  onSubmit,
}: {
  initial?: Producer | null;
  submitLabel: string;
  onSubmit: (p: Producer) => void;
}) {
  const [form, setForm] = useState<Producer>(initial ?? emptyProducer);

  function set(key: keyof Producer, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  return (
    <form
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form);
      }}
    >
      <Field label="Nome Completo" required>
        <input
          required
          value={form.nome}
          onChange={(e) => set("nome", e.target.value)}
          placeholder="Ex: João da Silva"
          className={inputClass}
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Município" required>
          <input
            required
            value={form.municipio}
            onChange={(e) => set("municipio", e.target.value)}
            placeholder="Ex: Uauá"
            className={inputClass}
          />
        </Field>
        <Field label="Estado" required>
          <input
            required
            value={form.estado}
            onChange={(e) => set("estado", e.target.value)}
            placeholder="Ex: BA"
            className={inputClass}
          />
        </Field>
      </div>

      <Field label="Idade (opcional)">
        <input
          type="number"
          value={form.idade}
          onChange={(e) => set("idade", e.target.value)}
          placeholder="Ex: 42"
          className={inputClass}
        />
      </Field>

      <Field label="Tipo de Criação" required>
        <select
          required
          value={form.tipoCriacao}
          onChange={(e) => set("tipoCriacao", e.target.value)}
          className={inputClass}
        >
          <option value="">Selecione...</option>
          {tiposCriacao.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </Field>

      <Field label="Quantidade de Animais" required>
        <input
          required
          type="number"
          value={form.quantidadeAnimais}
          onChange={(e) => set("quantidadeAnimais", e.target.value)}
          placeholder="Ex: 150"
          className={inputClass}
        />
      </Field>

      <Field label="Finalidade" required>
        <select
          required
          value={form.finalidade}
          onChange={(e) => set("finalidade", e.target.value)}
          className={inputClass}
        >
          <option value="">Selecione...</option>
          {finalidades.map((f) => (
            <option key={f}>{f}</option>
          ))}
        </select>
      </Field>

      <Field label="Tempo de Experiência" required>
        <input
          required
          value={form.experiencia}
          onChange={(e) => set("experiencia", e.target.value)}
          placeholder="Ex: 10 anos"
          className={inputClass}
        />
      </Field>

      <button
        type="submit"
        className="w-full rounded-2xl bg-brand-orange py-4 text-xl font-bold text-primary-foreground shadow-card transition-opacity hover:opacity-90"
      >
        {submitLabel}
      </button>
    </form>
  );
}

const inputClass =
  "w-full rounded-2xl border border-border bg-card px-4 py-4 text-lg text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-brand-green";

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-lg font-bold text-foreground">
        {label} {required ? <span className="text-brand-green">*</span> : null}
      </span>
      {children}
    </label>
  );
}
