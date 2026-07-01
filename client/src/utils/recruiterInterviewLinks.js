import { SERVER_URL } from './apiConfig.js';

const getInterviewIdFromLink = (link) => {
  if (!link) return '';

  try {
    const url = new URL(link, typeof window !== 'undefined' ? window.location.origin : SERVER_URL);
    const segments = url.pathname.split('/').filter(Boolean);

    const routeKeys = ['interview', 'candidate-interview', 'interview-room'];
    for (const key of routeKeys) {
      const keyIndex = segments.indexOf(key);
      if (keyIndex !== -1 && segments[keyIndex + 1]) {
        return decodeURIComponent(segments[keyIndex + 1]);
      }
    }

    return decodeURIComponent(segments[segments.length - 1] || '');
  } catch {
    return '';
  }
};

export const buildRecruiterShareLink = (interview) => {
  const interviewId =
    interview?.interviewId ||
    getInterviewIdFromLink(interview?.shareableLink) ||
    interview?._id ||
    interview?.id;

  if (!interviewId) {
    return interview?.shareableLink || '';
  }

  if (typeof window === 'undefined') {
    return `/interview/${interviewId}`;
  }

  return `${window.location.origin}/interview/${interviewId}`;
};

