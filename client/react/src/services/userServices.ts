/* eslint-disable @typescript-eslint/no-explicit-any */
export async function userLogin(data: any) {
  const response = await fetch("http://localhost:3000/api/user/", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const result = await response.json();
  return result;
}


export async function userRegistration(data: any) {
  const response = await fetch("http://localhost:3000/api/user/signup", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const result = await response.json();
  console.log(result);
  return result;
}