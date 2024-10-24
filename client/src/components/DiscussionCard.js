import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  createComment,
  likeDiscussion,
  likeComment,
  updateDiscussionAPI,
  createReply,
} from "../store/slices/discussionSlice";

const DiscussionCard = ({ discussion, currentUserId }) => {
  const dispatch = useDispatch();
  const [commentText, setCommentText] = useState("");
  const [replyText, setReplyText] = useState("");
  const [activeReplyCommentId, setActiveReplyCommentId] = useState(null);

  const handleCommentSubmit = async () => {
    if (commentText.trim() === "") {
      alert("Comment cannot be empty.");
      return;
    }

    const action = await dispatch(
      createComment({
        discussionId: discussion._id,
        commentData: { content: commentText },
      })
    );

    if (action.meta.requestStatus === "fulfilled") {
      const newComment = {
        _id: action.payload._id,
        content: commentText,
        user: currentUserId,
        likes: [],
        replies: [],
      };

      await dispatch(
        updateDiscussionAPI({
          discussionId: discussion._id,
          updatedDiscussion: {
            ...discussion,
            comments: [...discussion.comments, newComment],
          },
        })
      );

      setCommentText("");
    } else {
      alert("Failed to post comment");
    }
  };

  const handleReplySubmit = async (commentId) => {
    if (replyText.trim() === "") {
      alert("Reply cannot be empty.");
      return;
    }

    const action = await dispatch(
      createReply({
        discussionId: discussion._id,
        commentId,
        replyData: { content: replyText },
      })
    );

    if (action.meta.requestStatus === "fulfilled") {
      setReplyText("");
      setActiveReplyCommentId(null);
    } else {
      alert("Failed to post reply");
    }
  };

  const handleDiscussionLike = () => {
    dispatch(likeDiscussion(discussion._id));
  };

  const handleCommentLike = (commentId) => {
    dispatch(likeComment({ discussionId: discussion._id, commentId }));
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <h3 className="text-2xl font-semibold mb-2 text-gray-800">{discussion.title}</h3>
      <p className="text-gray-700 mb-2">{discussion.content}</p>
      {discussion.media && (
        <img
          src={discussion.media}
          alt="discussion media"
          className="w-full h-48 object-cover rounded-lg mb-4"
        />
      )}
      <p className="text-sm text-gray-500 mb-4">
        <strong>Course:</strong> {discussion.course?.title || "N/A"}
      </p>

      <button
        onClick={handleDiscussionLike}
        className={`bg-blue-500 hover:bg-blue-600 text-white py-1 px-4 rounded-md transition ${
          discussion.likes.includes(currentUserId) ? "bg-blue-700" : ""
        }`}
      >
        {discussion.likes.includes(currentUserId) ? "Unlike" : "Like"} (
        {discussion.likes.length})
      </button>

      {/* Comments Section */}
      <div className="mt-6">
        <h4 className="text-xl font-semibold mb-4">Comments</h4>
        {discussion.comments?.map((comment) => (
          <div
            key={comment._id}
            className="bg-gray-100 p-4 rounded-lg mb-4 shadow-sm"
          >
            <p className="text-gray-800">{comment.content}</p>
            <button
              onClick={() => handleCommentLike(comment._id)}
              className={`text-sm mt-2 px-3 py-1 rounded-md transition ${
                comment?.likes?.includes(currentUserId)
                  ? "bg-blue-600 text-white"
                  : "bg-blue-100 text-blue-500"
              }`}
            >
              {comment.likes.includes(currentUserId) ? "Unlike" : "Like"} (
              {comment.likes.length})
            </button>

            {/* Replies Section */}
            <div className="ml-6 mt-2 space-y-2">
              {comment.replies?.map((reply) => (
                <div key={reply._id} className="pl-4 border-l-2">
                  <p className="text-gray-600 italic">{reply.content}</p>
                </div>
              ))}

              {/* Reply Form */}
              {activeReplyCommentId === comment._id ? (
                <div className="mt-2">
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write a reply..."
                    className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-400"
                  />
                  <button
                    onClick={() => handleReplySubmit(comment._id)}
                    className="mt-2 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Post Reply
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setActiveReplyCommentId(comment._id)}
                  className="text-blue-500 mt-2"
                >
                  Reply
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Comment Form */}
      <div className="mt-6">
        <input
          type="text"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Write a comment..."
          className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleCommentSubmit}
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Post Comment
        </button>
      </div>
    </div>
  );
};

export default DiscussionCard;
