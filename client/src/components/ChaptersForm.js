import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addChapter } from "./../store/slices/chapterSlice";
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";

// Sortable Item Component
const SortableItem = ({
  id,
  chapter,
  index,
  handleChapterChange,
  handleToggleTopics,
  expandedChapters,
  handleAddTopic,
  handleTopicChange,
  onInputChange,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="mb-6 border-l-4 border-blue-500 pl-4"
    >
      <h3 className="text-xl font-semibold text-gray-700 mb-2 flex items-center">
        Chapter {index + 1}
        <button
          type="button"
          onClick={() => handleToggleTopics(index)}
          className="ml-2 focus:outline-none"
        >
          <span
            className={`transform transition-transform duration-200 ${
              expandedChapters.includes(index) ? "rotate-180" : ""
            }`}
          >
            ⬇️
          </span>
        </button>
      </h3>

      <div className="flex items-center mb-4">
        <input
          type="text"
          name="title"
          value={chapter.title}
          onChange={(e) => {
            handleChapterChange(index, e);
            onInputChange(); // Disable drag-and-drop on input change
          }}
          placeholder="Chapter Title"
          className="p-2 w-full bg-gray-100 border border-gray-300 rounded focus:outline-none focus:ring-blue-200"
          required
        />
        <button
          type="button"
          onClick={() => handleAddTopic(index)}
          className="ml-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Add Topic
        </button>
      </div>

      {expandedChapters.includes(index) && (
        <div>
          {chapter.topics.map((topic, topicIndex) => (
            <div
              key={topicIndex}
              className="mb-4 border border-gray-300 rounded-lg p-4 bg-gray-50 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-gray-600 mb-2">
                  Topic {topicIndex + 1}
                </h4>
              </div>
              <input
                type="text"
                name="title"
                value={topic.title}
                onChange={(e) => {
                  handleTopicChange(index, topicIndex, e);
                  onInputChange(); // Disable drag-and-drop on input change
                }}
                placeholder="Topic Title"
                className="p-2 border border-gray-300 rounded w-full mb-2 focus:outline-none focus:ring-blue-200"
                required
              />
              <input
                type="text"
                name="description"
                value={topic.description}
                onChange={(e) => {
                  handleTopicChange(index, topicIndex, e);
                  onInputChange(); // Disable drag-and-drop on input change
                }}
                placeholder="Topic Description"
                className="p-2 border border-gray-300 rounded w-full mb-2 focus:outline-none focus:ring-blue-200"
                required
              />
              <textarea
                name="content"
                value={topic.content}
                onChange={(e) => {
                  handleTopicChange(index, topicIndex, e);
                  onInputChange(); // Disable drag-and-drop on input change
                }}
                placeholder="Topic Content"
                className="p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-blue-200"
                rows="3"
                required
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Main ChaptersForm Component
const ChaptersForm = ({ courseId }) => {
  const dispatch = useDispatch();
  const [chapters, setChapters] = useState([
    { id: 1, title: "", topics: [{ title: "", description: "", content: "" }] },
  ]);
  const [expandedChapters, setExpandedChapters] = useState([]);
  const [dragEnabled, setDragEnabled] = useState(false); // State to manage drag-and-drop functionality

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const handleChapterChange = (index, e) => {
    const { name, value } = e.target;
    setChapters((prevChapters) =>
      prevChapters.map((chapter, i) =>
        i === index ? { ...chapter, [name]: value } : chapter
      )
    );
  };

  const handleAddChapter = () => {
    setChapters((prevChapters) => [
      ...prevChapters,
      {
        id: prevChapters.length + 1,
        title: "",
        topics: [{ title: "", description: "", content: "" }],
      },
    ]);
  };

  const handleAddTopic = (chapterIndex) => {
    setChapters((prevChapters) =>
      prevChapters.map((chapter, i) =>
        i === chapterIndex
          ? {
              ...chapter,
              topics: [
                ...chapter.topics,
                { title: "", description: "", content: "" },
              ],
            }
          : chapter
      )
    );
  };

  const handleTopicChange = (chapterIndex, topicIndex, e) => {
    const { name, value } = e.target;
    setChapters((prevChapters) =>
      prevChapters.map((chapter, i) =>
        i === chapterIndex
          ? {
              ...chapter,
              topics: chapter.topics.map((topic, j) =>
                j === topicIndex ? { ...topic, [name]: value } : topic
              ),
            }
          : chapter
      )
    );
  };

  const handleToggleTopics = (index) => {
    setExpandedChapters((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = chapters.findIndex(
        (chapter) => chapter.id === active.id
      );
      const newIndex = chapters.findIndex((chapter) => chapter.id === over.id);
      setChapters((chapters) => arrayMove(chapters, oldIndex, newIndex));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Dispatch each chapter individually
    for (const chapter of chapters) {
      const chapterData = {
        title: chapter.title,
        courseId,
        topics: chapter.topics,
      };

      console.log(chapterData); // This will log the correct structure

      await dispatch(addChapter(chapterData));
    }

    // Reset chapters after submission
    setChapters([
      {
        id: 1,
        title: "",
        topics: [{ title: "", description: "", content: "" }],
      },
    ]);
  };

  // Function to handle input changes
  const handleInputChange = () => {
    setDragEnabled(false); // Disable drag-and-drop when typing
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-lg rounded-lg p-8 mb-10"
    >
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        Add Chapters for Course
      </h2>
      <button
        type="button"
        onClick={() => setDragEnabled((prev) => !prev)} // Toggle drag-and-drop functionality
        className="mb-4 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
      >
        {dragEnabled ? "Disable Drag-and-Drop" : "Enable Drag-and-Drop"}
      </button>

      {dragEnabled ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={chapters.map((chapter) => chapter.id)}
            strategy={verticalListSortingStrategy}
          >
            {chapters.map((chapter, index) => (
              <SortableItem
                key={chapter.id}
                id={chapter.id}
                chapter={chapter}
                index={index}
                handleChapterChange={handleChapterChange}
                handleToggleTopics={handleToggleTopics}
                expandedChapters={expandedChapters}
                handleAddTopic={handleAddTopic}
                handleTopicChange={handleTopicChange}
                onInputChange={handleInputChange} // Pass input change handler to SortableItem
              />
            ))}
          </SortableContext>
        </DndContext>
      ) : (
        chapters.map((chapter, index) => (
          <SortableItem
            key={chapter.id}
            id={chapter.id}
            chapter={chapter}
            index={index}
            handleChapterChange={handleChapterChange}
            handleToggleTopics={handleToggleTopics}
            expandedChapters={expandedChapters}
            handleAddTopic={handleAddTopic}
            handleTopicChange={handleTopicChange}
            onInputChange={handleInputChange} // Pass input change handler to SortableItem
          />
        ))
      )}

      <button
        type="button"
        onClick={handleAddChapter}
        className="mb-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
      >
        Add Chapter
      </button>
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Save Chapters
      </button>
    </form>
  );
};

export default ChaptersForm;
