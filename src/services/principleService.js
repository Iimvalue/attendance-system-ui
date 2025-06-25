import axios from "axios";

const BASE_URL = "https://6836b885664e72d28e41d28e.mockapi.io/api/register";


export const getUnassignedPrinciples = async () => {
  const res = await axios.get(BASE_URL);
  return res.data.filter(
    (item) => item.role === "principle" && item.assigned === false
  );
};


export const assignPrinciplesToClass = async (classId, principleIds) => {
  const requests = principleIds.map((id) =>
    axios.put(`${BASE_URL}/${id}`, {
      classId,
      assigned: true,
    })
  );
  return Promise.all(requests);
};


export const getAllPrinciples = async () => {
  const res = await axios.get(BASE_URL);
  return res.data.filter((item) => item.role === "principle");
};


export const addPrinciple = async (principle) => {
  const res = await axios.post(BASE_URL, {
    ...principle,
    role: "principle",
    assigned: false,
  });
  return res.data;
};


export const deletePrinciple = async (id) => {
  await axios.delete(`${BASE_URL}/${id}`);
};