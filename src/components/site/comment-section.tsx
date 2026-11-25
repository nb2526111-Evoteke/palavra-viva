import { CommentForm } from "./comment-form";
import { formatDate, initials } from "@/lib/utils";
import type { Comment } from "@/lib/types";

export function CommentSection({
  postId,
  comments,
  enabled,
}: {
  postId: number;
  comments: Comment[];
  enabled: boolean;
}) {
  return (
    <section id="comentarios" className="mt-16 border-t border-line pt-12">
      <div className="flex items-end justify-between gap-4">
        <div>
          <span className="eyebrow">Conversa</span>
          <h2 className="display mt-2 text-3xl">
            {comments.length > 0
              ? `${comments.length} ${comments.length === 1 ? "comentário" : "comentários"}`
              : "Comentários"}
          </h2>
        </div>
      </div>

      {comments.length > 0 && (
        <ul className="mt-8 space-y-6">
          {comments.map((comment) => (
            <li key={comment.id} className="flex gap-4">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-accent-soft text-xs font-semibold text-accent">
                {initials(comment.name)}
              </span>
              <div className="min-w-0 flex-1 rounded-2xl border border-line bg-surface px-5 py-4">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <p className="text-sm font-semibold text-heading">{comment.name}</p>
                  <span className="size-1 rounded-full bg-line" />
                  <p className="text-[10.5px] text-muted">{formatDate(comment.created_at)}</p>
                </div>
                <p className="mt-2 whitespace-pre-line text-[13.5px] leading-relaxed text-muted">{comment.content}</p>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-8">
        {enabled ? (
          <CommentForm postId={postId} />
        ) : (
          <p className="rounded-2xl border border-line bg-surface p-5 text-sm text-muted">
            Os comentários estão desativados no momento.
          </p>
        )}
      </div>
    </section>
  );
}
