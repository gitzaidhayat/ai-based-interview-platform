import axios from 'axios';
import { buildRecruiterShareLink } from './recruiterInterviewLinks.js';

const RECRUITER_API_BASE = 'http://localhost:5000/api/recruiter';

export const getRecruiterAuthConfig = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    return {};
  }

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const fetchRecruiterInterviews = async () => {
  const { data } = await axios.get(`${RECRUITER_API_BASE}/interviews`, getRecruiterAuthConfig());
  const interviews = Array.isArray(data) ? data : [];

  return interviews.map((interview) => ({
    ...interview,
    shareableLink: buildRecruiterShareLink(interview),
  }));
};

export const fetchRecruiterInterviewResults = async (interviewId) => {
  const { data } = await axios.get(`${RECRUITER_API_BASE}/results/${interviewId}`, getRecruiterAuthConfig());
  return Array.isArray(data?.results) ? data.results : [];
};
