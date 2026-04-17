// import { getUser } from "../utils/auth";

// export default function CommentBubble({ comment }) {
//   const currentUser = getUser();
//   const isMine = currentUser?.id === comment.user_id;

//   return (
//     <div className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
//       <div
//         className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-lg ${
//           isMine
//             ? "bg-cyan-500 text-white"
//             : "bg-white/10 text-slate-100 border border-white/10"
//         }`}
//       >
//         <p className="text-sm leading-relaxed">{comment.message}</p>
//         <p className="text-[11px] mt-2 opacity-70">
//           User #{comment.user_id}
//         </p>
//       </div>
//     </div>
//   );
// }


import { getUser } from "../utils/auth";

export default function CommentBubble({ comment }) {
  const currentUser = getUser();
  const isMine = currentUser?.id === comment.user_id;

  return (
    <div className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[78%] rounded-2xl px-4 py-3 shadow-lg ${
          isMine
            ? "bg-cyan-500 text-white"
            : "bg-white/10 text-slate-100 border border-white/10"
        }`}
      >
        <p className="text-sm leading-relaxed">{comment.message}</p>
        <div className="flex items-center justify-between gap-3 mt-2">
          <p className="text-[11px] opacity-70">User #{comment.user_id}</p>
          <p className="text-[11px] opacity-60">
            {comment.created_at ? new Date(comment.created_at).toLocaleString() : ""}
          </p>
        </div>
      </div>
    </div>
  );
}