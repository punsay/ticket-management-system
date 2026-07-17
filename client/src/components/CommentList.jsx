import { UserRound } from 'lucide-react';
import { formatDateTime } from '../utils/formatDate';

function sortCommentsOldestFirst(comments) {
  return [...comments].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
}

function CommentList({ comments = [] }) {
  const sortedComments = sortCommentsOldestFirst(comments);

  if (sortedComments.length === 0) {
    return <p className="text-sm text-gray-500">No comments yet.</p>;
  }

  return (
    <ul className="space-y-4">
      {sortedComments.map((comment) => (
        <li
          key={comment._id}
          className="rounded-lg border border-gray-200 bg-gray-50 p-4"
        >
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
            <span className="inline-flex items-center gap-1.5 font-medium text-gray-900">
              <UserRound className="h-4 w-4 text-gray-400" aria-hidden="true" />
              {comment.createdBy?.name ?? 'Unknown'}
            </span>
            <time className="text-gray-500" dateTime={comment.createdAt}>
              {formatDateTime(comment.createdAt)}
            </time>
          </div>
          <p className="mt-2 whitespace-pre-wrap text-sm text-gray-900">
            {comment.message}
          </p>
        </li>
      ))}
    </ul>
  );
}

export default CommentList;
