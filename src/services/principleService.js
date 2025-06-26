import axiosInstance from "./axiosInstance";

const BASE_URL = "/api/users";

export const getUnassignedPrinciples = async () => {
  const res = await axiosInstance.get(`${BASE_URL}?role=principle`);

  return (res.data.data || res.data).filter(item => !item.classId);
};

export const assignPrinciplesToClass = async (classId, principleIds) => {
  const requests = principleIds.map((id) =>
    axiosInstance.put(`${BASE_URL}/update/${id}`, {
      classId,
    })
  );
  return Promise.all(requests);
};

export const getAllPrinciples = async () => {
  const res = await axiosInstance.get(`${BASE_URL}?role=principle`);
  return res.data.data || res.data;
};

export const addPrinciple = async (principle) => {
  const res = await axiosInstance.post(BASE_URL, {
    ...principle,
    role: "principle",
  });
  return res.data.data || res.data;
};

export const deletePrinciple = async (id) => {
  await axiosInstance.delete(`${BASE_URL}/${id}`);
};