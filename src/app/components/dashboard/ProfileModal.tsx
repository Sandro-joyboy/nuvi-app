"use client";

import { useRef, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Camera01Icon, Cancel01Icon } from "@hugeicons/core-free-icons";
import { useDialog } from "./useDialog";
import { initialOf, saveProfile, type Profile } from "./prefs";

const MAX_PHOTO_BYTES = 2 * 1024 * 1024; // 2 MB
const MAX_NAME = 60;

interface ProfileModalProps {
  open: boolean;
  profile: Profile;
  onClose: () => void;
}

export default function ProfileModal(props: ProfileModalProps) {
  if (!props.open) return null;
  // Montado ao abrir: o formulário começa sempre com os dados guardados.
  return <ModalBody {...props} />;
}

function ModalBody({ profile, onClose }: ProfileModalProps) {
  const [name, setName] = useState(profile.name);
  const [photo, setPhoto] = useState<string | null>(profile.photo);
  const [error, setError] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  useDialog(true, onClose, ref, nameRef);

  const changed = name.trim() !== profile.name || photo !== profile.photo;

  const onFile = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Escolhe uma imagem (JPG, PNG ou WebP).");
      return;
    }
    if (file.size > MAX_PHOTO_BYTES) {
      setError("A imagem tem de ter no máximo 2 MB.");
      return;
    }
    setError(null);
    const reader = new FileReader();
    reader.onload = () => setPhoto(typeof reader.result === "string" ? reader.result : null);
    reader.readAsDataURL(file);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveProfile({ name: name.trim(), photo });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-(--nv-scrim) p-4 backdrop-blur-[3px]"
      onPointerDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-title"
        className="nuvi-pop sq w-full max-w-[420px] overflow-hidden rounded-[32px] bg-(--nv-solid) shadow-[0_0_0_0.5px_var(--nv-line),0_30px_80px_-20px_var(--nv-shadow)]"
      >
        <form onSubmit={onSubmit}>
          <header className="flex items-center justify-between px-6 pt-6 pb-4">
            <h2 id="profile-title" className="text-[22px] font-bold tracking-[-0.025em] text-(--nv-text)">
              Editar perfil
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar"
              className="lg-control flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-(--nv-text)"
            >
              <HugeiconsIcon icon={Cancel01Icon} size={16} strokeWidth={2} />
            </button>
          </header>

          <div className="border-y border-(--nv-line) bg-(--nv-panel) px-6 py-6">
            {/* Foto */}
            <div className="flex flex-col items-center">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                aria-label={photo ? "Mudar foto" : "Adicionar foto"}
                className="group relative h-24 w-24 cursor-pointer rounded-full"
              >
                {photo ? (
                  // eslint-disable-next-line @next/next/no-img-element -- data URL local
                  <img src={photo} alt="" className="h-24 w-24 rounded-full object-cover" />
                ) : (
                  <span className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-b from-[#5DB6F5] to-[#0076E8] text-[34px] font-bold text-white">
                    {initialOf(name)}
                  </span>
                )}
                <span className="absolute right-0 bottom-0 flex h-8 w-8 items-center justify-center rounded-full bg-(--nv-text) text-(--nv-solid) ring-[3px] ring-(--nv-panel) transition-transform group-hover:scale-105">
                  <HugeiconsIcon icon={Camera01Icon} size={15} strokeWidth={2} />
                </span>
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={(e) => onFile(e.target.files?.[0])}
              />
              <p className="mt-3 text-[13px] font-medium text-(--nv-text-2)">
                {photo ? "Toca para mudar a foto" : "Toca para adicionar foto"}
              </p>
              {photo && (
                <button
                  type="button"
                  onClick={() => setPhoto(null)}
                  className="mt-1 cursor-pointer text-[12.5px] font-medium text-[#FF3B30] hover:underline"
                >
                  Remover foto
                </button>
              )}
              {error && (
                <p role="alert" className="mt-2 text-[12.5px] font-medium text-[#FF3B30]">
                  {error}
                </p>
              )}
            </div>

            {/* Nome */}
            <label htmlFor="profile-name" className="mt-6 block text-[14px] font-semibold text-(--nv-text)">
              O teu nome
            </label>
            <input
              ref={nameRef}
              id="profile-name"
              value={name}
              maxLength={MAX_NAME}
              autoComplete="name"
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome pessoal"
              aria-describedby="profile-name-hint"
              className="sq mt-2 h-12 w-full rounded-[14px] border border-(--nv-line-strong) bg-(--nv-solid) px-4 text-[15px] text-(--nv-text) outline-none transition-shadow placeholder:text-(--nv-text-3) focus:border-[#4EA7EB] focus:shadow-[0_0_0_4px_rgba(78,167,235,0.15)]"
            />
            <p id="profile-name-hint" className="mt-2 text-[12.5px] text-(--nv-text-3)">
              Aparece quando falas com criadores.
            </p>
          </div>

          <footer className="flex items-center justify-between gap-3 px-6 py-5">
            <button
              type="button"
              onClick={onClose}
              className="lg-control sq h-11 cursor-pointer rounded-full px-5 text-[14px] font-semibold text-(--nv-text)"
            >
              Cancelar
            </button>
            <button type="submit" disabled={!changed} className="nuvi-btn-sm sq !h-11 !px-6">
              Guardar
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}
