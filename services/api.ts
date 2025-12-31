import axios from 'axios';

// BASE URL should NOT include the resource name
const API_BASE_URL = 'https://6954dec81cd5294d2c7db96a.mockapi.io';

export const getSubjects = async () => {
  const response = await axios.get(`${API_BASE_URL}/Subjects`);
  return response.data;
};

export const addSubject = async (subject: {
  title: string;
  day: string;
  time: string;
}) => {
  const response = await axios.post(`${API_BASE_URL}/Subjects`, subject);
  return response.data;
};

export const deleteSubject = async (id: string) => {
  const response = await axios.delete(
    `${API_BASE_URL}/Subjects/${id}`
  );
  return response.data;
};
