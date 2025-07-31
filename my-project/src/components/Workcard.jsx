// src/components/WorkCard.jsx
import React from 'react';

export default function WorkCard({ work }) {
  return (
    <div className="p-4 border rounded shadow bg-white">
      <h4 className="font-semibold text-lg mb-1">{work.title}</h4>

      {work.description && <p className="mb-1 text-gray-700">{work.description}</p>}

      {work.githubUrl && (
        <p className="mb-1">
          <a
            href={work.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            View Project
          </a>
        </p>
      )}

      {work.resumeUrl && (
        <p>
          Resume:{' '}
          <a
            href={work.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-600 underline"
          >
            Download
          </a>
        </p>
      )}
    </div>
  );
}
