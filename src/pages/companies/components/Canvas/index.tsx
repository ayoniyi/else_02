import React, { useState, useCallback } from "react";
import style from "./Canvas.module.scss";
import { motion } from "framer-motion";

interface Note {
  id: number;
  text: string;
  name: string;
  color: string;
  x: number;
  y: number;
  rotation: number;
}

const NOTE_COLORS = [
  "#ffffff",
  "#e0e0e0",
  "#ff6b6b",
  "#ffa94d",
  "#69db7c",
  "#4ecdc4",
  "#a8d8ea",
  "#ff85a2",
];

const MAX_NOTES = 20;

interface CanvasProps {
  title?: string;
}

const Canvas: React.FC<CanvasProps> = ({ title = "ADD A COMPANY" }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [noteName, setNoteName] = useState("");
  const [selectedColor, setSelectedColor] = useState(NOTE_COLORS[0]);
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  const getRandomPosition = useCallback(() => {
    const padding = 100;
    const noteSize = 150;
    const x =
      padding + Math.random() * (window.innerWidth - padding * 2 - noteSize);
    const y = padding + Math.random() * (500 - padding * 2 - noteSize);
    const rotation = (Math.random() - 0.5) * 20;
    return { x, y, rotation };
  }, []);

  const handleOpenModal = () => {
    if (notes.length >= MAX_NOTES) {
      alert("Maximum notes reached (20)");
      return;
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNoteText("");
    setNoteName("");
    setSelectedColor(NOTE_COLORS[0]);
  };

  const handleSubmit = () => {
    if (!noteText.trim()) return;

    const { x, y, rotation } = getRandomPosition();
    const newNote: Note = {
      id: Date.now(),
      text: noteText.slice(0, 100),
      name: noteName.trim() || "Anonymous",
      color: selectedColor,
      x,
      y,
      rotation,
    };

    setNotes((prev) => [...prev, newNote]);
    handleCloseModal();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      handleCloseModal();
    } else if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className={style.canvasContainer}>
      {/* Header */}
      <div className={style.header}>
        <p className={style.headerText}>
          &gt; Tell me an interesting fact or something sweet.
          <br />
          Remember to be respectful to your internet friend &lt;3
        </p>
        <div className={style.noteCount}>{notes.length} notes shared</div>
      </div>

      {/* Title */}
      {title && <h2 className={style.canvasTitle}>{title}</h2>}

      {/* Canvas Area */}
      <div className={style.canvas}>
        {notes.map((note) => (
          <div
            key={note.id}
            className={style.note}
            style={{
              backgroundColor: note.color,
              left: note.x,
              top: note.y,
              transform: `rotate(${note.rotation}deg)`,
            }}
          >
            <p className={style.noteText}>{note.text}</p>
            <span className={style.noteName}>{note.name}</span>
          </div>
        ))}
      </div>

      {/* Floating Button */}
      <div className={style.floatingButtons}>
        <button
          className={style.addNoteBtn}
          onClick={handleOpenModal}
          onMouseEnter={() => setIsButtonHovered(true)}
          onMouseLeave={() => setIsButtonHovered(false)}
        >
          <span className={style.btnIcon}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="3"
                y="3"
                width="18"
                height="18"
                rx="2"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M8 12H16M12 8V16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </span>
          {isButtonHovered && (
            <span className={style.btnLabel}>Leave a note</span>
          )}
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className={style.modalOverlay} onClick={handleCloseModal}>
          <div
            className={style.modalContent}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={handleKeyDown}
          >
            {/* Color Picker */}
            <div className={style.colorPickerSection}>
              <div className={style.colorPicker}>
                {NOTE_COLORS.map((color) => (
                  <button
                    key={color}
                    className={`${style.colorBtn} ${
                      selectedColor === color ? style.selected : ""
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setSelectedColor(color)}
                    aria-label={`Select color ${color}`}
                  />
                ))}
              </div>
              <span className={style.colorLabel}>Sticky Note</span>
            </div>

            {/* Form */}
            <div
              className={style.formCard}
              style={{ backgroundColor: selectedColor }}
            >
              <h2 className={style.formTitle}>Tell me an interesting fact</h2>
              <textarea
                className={style.textInput}
                placeholder="Type your message here"
                value={noteText}
                onChange={(e) => setNoteText(e.target.value.slice(0, 100))}
                maxLength={100}
                autoFocus
              />
              <div className={style.charCount}>{noteText.length}/100</div>

              <label className={style.nameLabel}>
                What&apos;s your name? (Optional)
              </label>
              <input
                type="text"
                className={style.nameInput}
                placeholder="Your name here"
                value={noteName}
                onChange={(e) => setNoteName(e.target.value)}
              />
            </div>

            {/* Modal Actions */}
            <div className={style.modalActions}>
              <button className={style.closeBtn} onClick={handleCloseModal}>
                Close [esc]
              </button>
              <button
                className={style.submitBtn}
                onClick={handleSubmit}
                disabled={!noteText.trim()}
              >
                Submit ↵
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Canvas;
